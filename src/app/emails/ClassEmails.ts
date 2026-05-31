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
<html lang="en">
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
              <p style="margin:0;font-size:12px;color:#9ca3af;">This email was sent automatically. Please do not reply.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default class ClassEmails {
  static classCreatedEmail(tutorName: string, className: string, classDescription: string | null): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Your class is ready</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hi <strong>${tutorName}</strong>, your new class has been created successfully.
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
        You can now add students and create challenges for this class from your EduGreen dashboard.
      </p>

      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#12ea36;border-radius:15px;text-align:center;">
            <a href="${process.env.CLIENT_DOMAIN}"
               style="display:inline-block;min-height:44px;padding:12px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;line-height:20px;border-radius:15px;text-align:center;">
              Go to dashboard
            </a>
          </td>
        </tr>
      </table>

      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">If you did not create this class, please contact your administrator.</p>
    `;
    return base(`Class "${className}" created`, body);
  }

  static challengeCreatedEmail(
    tutorName: string,
    challengeName: string,
    className: string,
    points: number,
    challengeDescription: string | null,
  ): string {
    const body = `
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;">Challenge created</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Hi <strong>${tutorName}</strong>, a new challenge has been added to <strong>${className}</strong>.
      </p>

      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
        <tr>
          <td style="background:#fffcf5;border-radius:10px;padding:20px 24px;border-left:4px solid #12ea36;">
            <p style="margin:0 0 4px;font-size:17px;font-weight:700;color:#111111;">${challengeName}</p>
            ${challengeDescription ? `<p style="margin:0 0 8px;font-size:14px;color:#4d535e;line-height:1.5;">${challengeDescription}</p>` : ""}
            <p style="margin:0;font-size:13px;font-weight:700;color:#12ea36;">${points} pts</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 28px;font-size:15px;color:#4d535e;line-height:1.6;">
        Students enrolled in <strong>${className}</strong> can now participate in this challenge.
      </p>

      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#12ea36;border-radius:15px;text-align:center;">
            <a href="${process.env.CLIENT_DOMAIN}"
               style="display:inline-block;min-height:44px;padding:12px 28px;font-size:15px;font-weight:700;color:#000000;text-decoration:none;line-height:20px;border-radius:15px;text-align:center;">
              Go to dashboard
            </a>
          </td>
        </tr>
      </table>

      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">If you did not create this challenge, please contact your administrator.</p>
    `;
    return base(`Challenge "${challengeName}" created`, body);
  }
}
