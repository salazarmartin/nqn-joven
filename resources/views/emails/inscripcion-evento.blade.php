<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #5d4dff 0%, #0a0236 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .icon {
            font-size: 50px;
            margin-bottom: 10px;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
        }
        .info-box {
            background: white;
            border-left: 4px solid #5d4dff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-box h2 {
            color: #0a0236;
            margin-top: 0;
            font-size: 18px;
        }
        .info-row {
            display: flex;
            gap: 8px;
            margin: 8px 0;
            font-size: 14px;
            color: #374151;
        }
        .info-label {
            font-weight: bold;
            min-width: 60px;
        }
        .button {
            display: inline-block;
            background: #5d4dff;
            color: white;
            padding: 14px 30px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 15px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
            background: #f9fafb;
            border-radius: 0 0 5px 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="icon">🎉</div>
        <h1>¡Inscripción confirmada!</h1>
    </div>

    <div class="content">
        <p>Hola <strong>{{ $nombre }}</strong>,</p>

        <p>Tu inscripción al siguiente evento fue registrada exitosamente:</p>

        <div class="info-box">
            <h2>{{ $eventoTitulo }}</h2>
            @if($eventoFecha)
            <div class="info-row">
                <span class="info-label">📅 Fecha:</span>
                <span>{{ $eventoFecha }}</span>
            </div>
            @endif
            @if($eventoHora)
            <div class="info-row">
                <span class="info-label">🕐 Hora:</span>
                <span>{{ $eventoHora }}</span>
            </div>
            @endif
            @if($eventoLugar)
            <div class="info-row">
                <span class="info-label">📍 Lugar:</span>
                <span>{{ $eventoLugar }}</span>
            </div>
            @endif
        </div>

        <div style="text-align: center;">
            <a href="{{ $eventoUrl }}" class="button">Ver evento</a>
        </div>

        <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
            Si no realizaste esta inscripción, podés ignorar este mensaje.
        </p>
    </div>

    <div class="footer">
        <p><strong>Equipo de {{ config('app.name') }}</strong></p>
        <p>Este es un email automático, por favor no respondas.</p>
        <p>© {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.</p>
    </div>
</body>
</html>
