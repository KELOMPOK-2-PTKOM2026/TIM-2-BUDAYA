<?php

namespace App\Providers;

use App\Mail\Transport\BrevoTransport;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Mail::extend('brevo', function (array $config = []) {
            $key = $config['key'] ?? config('services.brevo.key');
            return new BrevoTransport((string) $key);
        });

        ResetPassword::createUrlUsing(function (object $user, string $token) {
            $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . $user->email;
        });
    }
}
