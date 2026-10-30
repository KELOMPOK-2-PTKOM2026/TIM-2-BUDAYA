FROM php:8.3-cli-alpine

RUN apk add --no-cache \
    postgresql-dev \
    sqlite-dev \
    libzip-dev \
    curl \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pdo_sqlite bcmath

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY backend/ .

RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data storage/logs \
    && chmod -R 777 storage bootstrap/cache

RUN composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 8000

CMD php artisan migrate --force && php artisan storage:link --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
