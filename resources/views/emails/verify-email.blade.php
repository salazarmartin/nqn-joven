<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificá tu cuenta en NQN-Jóven</title>
    <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            background-color: #f0f0f8;
            color: #333;
        }

        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(10, 2, 54, 0.15);
        }

        /* Header con gradiente NQN */
        .header {
            background: linear-gradient(135deg, #0a0236 0%, #5d4dff 100%);
            padding: 36px 24px 28px;
            text-align: center;
            position: relative;
        }

        .header::after {
            content: '';
            display: block;
            height: 4px;
            background: linear-gradient(90deg, #5d4dff, #00d9fa, #c4ff00);
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .header img {
            max-width: 200px;
            height: auto;
        }

        /* Contenido principal */
        .content {
            background: #ffffff;
            padding: 44px 40px;
        }

        .greeting {
            font-size: 24px;
            font-weight: 800;
            color: #0a0236;
            margin-bottom: 18px;
        }

        .content p {
            font-size: 15px;
            line-height: 1.75;
            color: #4b5563;
            margin-bottom: 14px;
        }

        /* Caja resaltada */
        .highlight-box {
            background: linear-gradient(135deg, #f5f3ff 0%, #e0f9ff 100%);
            border-left: 4px solid #5d4dff;
            border-radius: 0 10px 10px 0;
            padding: 18px 22px;
            margin: 28px 0;
            font-size: 14px;
            color: #374151;
            line-height: 1.7;
        }

        .highlight-box strong {
            color: #5d4dff;
        }

        /* Botón principal */
        .btn-wrapper {
            text-align: center;
            margin: 36px 0 20px;
        }

        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #5d4dff 0%, #00d9fa 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 44px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.3px;
            box-shadow: 0 4px 18px rgba(93, 77, 255, 0.4);
        }

        .url-fallback {
            font-size: 11px;
            color: #9ca3af;
            word-break: break-all;
            text-align: center;
            margin-top: 14px;
        }

        .divider {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 28px 0;
        }

        /* Nota de seguridad */
        .note {
            background-color: #fafafa;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px 20px;
            font-size: 13px;
            color: #6b7280;
            line-height: 1.6;
        }

        .note span {
            color: #5d4dff;
            font-weight: 600;
        }

        /* Footer */
        .footer {
            background: #0a0236;
            padding: 28px 24px;
            text-align: center;
        }

        .footer p {
            font-size: 12px;
            color: #8b91c7;
            line-height: 1.8;
        }

        .footer .footer-brand {
            font-size: 14px;
            font-weight: 700;
            color: #00d9fa;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="wrapper">

        <!-- Header -->
        <div class="header">
            @if($logoPath)
                <img src="{{ $message->embed($logoPath) }}" alt="NQN-Jóven">
            @else
                <p style="color:#00d9fa; font-size:22px; font-weight:800; margin:0;">NQN-Jóven</p>
            @endif
        </div>

        <!-- Contenido -->
        <div class="content">
            <p class="greeting">¡Hola, {{ $nombre }}!</p>

            <p>
                Gracias por sumarte a <strong>NQN-Jóven</strong>, la plataforma de la Provincia del Neuquén para jóvenes y organizaciones.
            </p>

            <p>
                Para activar tu cuenta y empezar a explorar, verificá tu dirección de correo haciendo clic en el botón de abajo.
            </p>

            <div class="btn-wrapper">
                <a href="{{ $verificationUrl }}" class="btn">
                    ✉&nbsp; Verificar mi correo
                </a>
                <p class="url-fallback">
                    ¿No funciona el botón? Copiá este enlace en tu navegador:<br>
                    {{ $verificationUrl }}
                </p>
            </div>

            <hr class="divider">

            <div class="highlight-box">
                🔒 <strong>Este enlace es válido por 60 minutos.</strong><br>
                Si no creaste esta cuenta, podés ignorar este mensaje de forma segura. No se realizará ningún cambio en tu cuenta.
            </div>

            {{-- <div class="note">
                ¿Tenés algún problema? Escribinos a
                <span>{{ config('mail.from.address') }}</span> y te ayudamos.
            </div> --}}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-brand">NQN-Jóven</p>
            <p>© {{ date('Y') }} Provincia del Neuquén — Todos los derechos reservados</p>
            <p>Este es un correo automático, por favor no respondas directamente.</p>
        </div>

    </div>
</body>
</html>
