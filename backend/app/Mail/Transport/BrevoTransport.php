<?php

namespace App\Mail\Transport;

use Illuminate\Support\Facades\Http;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Email;

class BrevoTransport extends AbstractTransport
{
    public function __construct(protected string $key)
    {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = $message->getOriginalMessage();
        if (!$email instanceof Email) {
            return;
        }

        $from = $email->getFrom()[0] ?? null;
        $senderName = $from?->getName() ?: (string) config('mail.from.name', 'App');
        $senderEmail = $from?->getAddress() ?: (string) config('mail.from.address');

        $html = $email->getHtmlBody();
        if (is_resource($html)) {
            $html = stream_get_contents($html);
        }

        $text = $email->getTextBody();
        if (is_resource($text)) {
            $text = stream_get_contents($text);
        }

        $payload = [
            'sender' => [
                'name' => $senderName,
                'email' => $senderEmail,
            ],
            'to' => array_map(fn ($addr) => [
                'name' => $addr->getName() ?: null,
                'email' => $addr->getAddress(),
            ], $email->getTo()),
            'subject' => $email->getSubject(),
            'htmlContent' => $html ?: ($text ? nl2br($text) : '<p></p>'),
        ];

        // ponytail: supports basic text/html emails; add attachments/cc/bcc when mail requirements expand
        $request = Http::withHeaders([
            'api-key' => $this->key,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ]);

        if (!config('services.brevo.verify_ssl', true)) {
            $request = $request->withoutVerifying();
        }

        $response = $request->post('https://api.brevo.com/v3/smtp/email', $payload);

        if ($response->failed()) {
            throw new \RuntimeException('Brevo API error (' . $response->status() . '): ' . $response->body());
        }
    }

    public function __toString(): string
    {
        return 'brevo';
    }
}
