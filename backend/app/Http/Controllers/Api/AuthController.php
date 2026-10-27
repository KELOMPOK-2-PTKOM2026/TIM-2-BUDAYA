<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password as PasswordBroker;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers(),
            ],
        ]);

        $existingUser = User::where('email', $validated['email'])->first();

        if ($existingUser) {
            if ($existingUser->hasVerifiedEmail()) {
                throw ValidationException::withMessages([
                    'email' => ['Email sudah terdaftar dan terverifikasi. Silakan masuk.'],
                ]);
            }

            // Akun belum terverifikasi: perbarui data dan kirim ulang verifikasi
            $existingUser->update([
                'name'     => $validated['name'],
                'password' => Hash::make($validated['password']),
            ]);
            $user = $existingUser;
        } else {
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role'     => 'user',
            ]);
        }

        try {
            event(new Registered($user));
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Gagal mengirim email verifikasi saat register: ' . $e->getMessage());
        }

        return response()->json([
            'message'               => 'Registrasi berhasil. Silakan cek email Anda untuk tautan verifikasi sebelum login.',
            'requires_verification' => true,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('email')) . '|' . $request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message' => "Terlalu banyak percobaan. Silakan coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => ['Kredensial tidak valid.'],
            ]);
        }

        if (! $user->hasVerifiedEmail()) {
            throw ValidationException::withMessages([
                'email' => ['Email belum diverifikasi. Silakan periksa kotak masuk atau folder spam email Anda untuk mengaktifkan akun.'],
            ]);
        }

        RateLimiter::clear($throttleKey);

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => $user->only('id', 'name', 'email', 'role'),
            'role'    => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user'    => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = PasswordBroker::sendResetLink($request->only('email'));

        if ($status === PasswordBroker::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = PasswordBroker::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === PasswordBroker::PASSWORD_RESET) {
            return response()->json(['message' => __($status)]);
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    public function redirectToGoogle(Request $request)
    {
        $targetUrl = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        if ($request->expectsJson() || $request->has('json')) {
            return response()->json([
                'url' => $targetUrl,
            ]);
        }

        return redirect()->away($targetUrl);
    }

    public function handleGoogleCallback(Request $request)
    {
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Autentikasi Google gagal: ' . $e->getMessage(),
                ], 422);
            }

            return redirect($frontendUrl . '/login?error=' . urlencode('Autentikasi Google gagal atau dibatalkan.'));
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            if (! $user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }
        } else {
            $user = User::create([
                'name'              => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Pengguna Google',
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'password'          => null,
                'role'              => 'user',
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Login Google berhasil.',
                'token'   => $token,
                'user'    => $user->only('id', 'name', 'email', 'role'),
                'role'    => $user->role,
            ]);
        }

        $queryParams = http_build_query([
            'token' => $token,
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]);

        return redirect("{$frontendUrl}/login?{$queryParams}");
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
        $user = User::findOrFail($id);

        if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect($frontendUrl . '/login?error=' . urlencode('Tautan verifikasi tidak valid atau tidak cocok.'));
        }

        if ($user->hasVerifiedEmail()) {
            return redirect($frontendUrl . '/login?verified=already');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect($frontendUrl . '/login?verified=1');
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            $validated = $request->validate([
                'email' => 'required|email',
            ]);
            $user = User::where('email', $validated['email'])->first();

            if (! $user) {
                return response()->json([
                    'message' => 'Jika email Anda terdaftar, tautan verifikasi baru telah dikirim.',
                ]);
            }
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email sudah terverifikasi sebelumnya. Silakan langsung masuk.'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Tautan verifikasi baru telah dikirim ke email Anda.']);
    }
}
