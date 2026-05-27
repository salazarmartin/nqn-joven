<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Notifications\Messages\MailMessage;

class CustomVerifyEmail extends VerifyEmailNotification
{
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        $logoPath = public_path('images/logo-nqnjoven.png');

        return (new MailMessage)
            ->subject('Verificá tu cuenta en NQN-Jóven')
            ->view('emails.verify-email', [
                'nombre'          => $notifiable->nombre,
                'verificationUrl' => $verificationUrl,
                'logoPath'        => $logoPath,
            ]);
    }

    protected function verificationUrl($notifiable)
    {
        return config('app.url') . '/verificar-email/' . $notifiable->email_verification_token;
    }
}
