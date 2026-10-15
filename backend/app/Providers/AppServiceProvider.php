<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
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
        ResetPassword::createUrlUsing(function (object $user, string $token) {
            $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:3000'), '/');
            return $frontendUrl . '/reset-password?token=' . $token . '&email=' . $user->email;
        });
    }
}
