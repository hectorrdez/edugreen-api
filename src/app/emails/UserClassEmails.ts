const LOGO_B64_GREEN_SQUARE = `<table cellpadding="0" cellspacing="0" border="0" style="line-height:0;">
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
              ${LOGO_B64_GREEN_SQUARE}
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

export default class UserClassEmails {
  static removedFromClassEmail(userName: string, className: string): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Has sido eliminado de una clase</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hola <strong>${userName}</strong>, has sido eliminado de la siguiente clase:
      </p>

      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background:#fffcf5;border-radius:10px;padding:20px 24px;border-left:4px solid #4d535e;">
            <p style="margin:0;font-size:17px;font-weight:700;color:#111111;">${className}</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Si crees que esto es un error, contacta con el administrador de tu institución.
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
    return base(`Has sido eliminado de ${className}`, body);
  }

  static addedToClassEmail(userName: string, className: string, classDescription: string | null): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Has sido añadido a una clase</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hola <strong>${userName}</strong>, has sido matriculado en la siguiente clase:
      </p>

      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background:#fffcf5;border-radius:10px;padding:20px 24px;border-left:4px solid #12ea36;">
            <p style="margin:0 0 4px;font-size:17px;font-weight:700;color:#111111;">${className}</p>
            ${classDescription ? `<p style="margin:0;font-size:14px;color:#4d535e;line-height:1.5;">${classDescription}</p>` : ""}
          </td>
        </tr>
      </table>

      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Inicia sesión en tu cuenta de EduGreen para acceder al material de la clase y empezar a aprender.
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
      <p style="margin:0;font-size:12px;color:#9ca3af;">Si crees que esto es un error, contacta con el administrador de tu institución.</p>
    `;
    return base(`Has sido añadido a ${className}`, body);
  }
}
