const LOGO = `<table cellpadding="0" cellspacing="0" border="0" style="line-height:0;">
  <tr>
    <td style="vertical-align:middle;padding-right:10px;">
      <table cellpadding="0" cellspacing="0" border="0" width="22" height="22">
        <tr>
          <td width="22" height="22" bgcolor="#12ea36" style="background:#12ea36;border-radius:4px 10px 4px 10px;">&nbsp;</td>
        </tr>
      </table>
    </td>
    <td style="vertical-align:middle;">
      <span style="font-family:'Inter',Arial,Helvetica,sans-serif;font-size:20px;font-weight:600;line-height:1;letter-spacing:-0.01em;text-decoration:none;color:#ffffff;">EduGreen</span>
    </td>
  </tr>
</table>`;

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f6f8f6;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8f6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0a1f0d;border-radius:12px 12px 0 0;padding:24px 32px;">
              ${LOGO}
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#000000;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#ffffff;font-weight:600;">EduGreen</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">Este correo se ha enviado automáticamente. Por favor, no respondas.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default class AuthEmails {
  static profileUpdatedEmail(userName: string, updatedFields: string[]): string {
    const fieldLabels: Record<string, string> = {
      name: "First name",
      lastName: "Last name",
      email: "Email address",
    };
    const fieldList = updatedFields
      .map((f) => `<li style="margin-bottom:4px;color:#4d535e;">${fieldLabels[f] ?? f}</li>`)
      .join("");
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Tu perfil ha sido actualizado</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hola <strong>${userName}</strong>, los siguientes datos de tu cuenta de EduGreen han sido modificados recientemente:
      </p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background:#fffcf5;border-radius:10px;padding:20px 24px;border-left:4px solid #12ea36;">
            <ul style="margin:0;padding:0 0 0 16px;font-size:14px;line-height:1.8;">
              ${fieldList}
            </ul>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Si no has realizado estos cambios, contacta con tu administrador inmediatamente.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#12ea36;border-radius:15px;text-align:center;">
            <a href="${process.env.CLIENT_DOMAIN}"
               style="display:inline-block;min-height:44px;padding:12px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;line-height:20px;border-radius:15px;text-align:center;">
              Ir a EduGreen
            </a>
          </td>
        </tr>
      </table>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Este correo se ha enviado automáticamente. Por favor, no respondas.</p>
    `;
    return base("Tu perfil de EduGreen ha sido actualizado", body);
  }


  static verificationEmail(verificationUrl: string): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Verifica tu cuenta</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        ¡Gracias por registrarte! Haz clic en el botón para confirmar tu dirección de correo y activar tu cuenta de EduGreen.
        Este enlace caduca en <strong>5 minutos</strong>.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#12ea36;border-radius:15px;text-align:center;">
            <a href="${verificationUrl}"
               style="display:inline-block;min-height:44px;padding:12px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;line-height:20px;border-radius:15px;text-align:center;">
              Verificar mi cuenta
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:13px;color:#4d535e;">O copia y pega este enlace en tu navegador:</p>
      <p style="margin:0;font-size:12px;color:#4d535e;word-break:break-all;">
        <a href="${verificationUrl}" style="color:#12ea36;">${verificationUrl}</a>
      </p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Si no has creado ninguna cuenta, puedes ignorar este correo.</p>
    `;
    return base("Verifica tu cuenta de EduGreen", body);
  }

  static forgotPasswordEmail(resetUrl: string): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Restablece tu contraseña</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de EduGreen.
        Haz clic en el botón para establecer una nueva contraseña. Este enlace caduca en <strong>5 minutos</strong>.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#12ea36;border-radius:15px;">
            <a href="${resetUrl}"
               style="display:inline-block;min-height:44px;padding:12px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;line-height:20px;border-radius:15px;">
              Restablecer contraseña
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:13px;color:#4d535e;">O copia y pega este enlace en tu navegador:</p>
      <p style="margin:0;font-size:12px;color:#4d535e;word-break:break-all;">
        <a href="${resetUrl}" style="color:#12ea36;">${resetUrl}</a>
      </p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
    `;
    return base("Restablece tu contraseña de EduGreen", body);
  }
}
