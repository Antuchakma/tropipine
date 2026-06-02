const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  FRONTEND_URL = 'http://localhost:5173',
} = process.env;

// Only create transporter if SMTP credentials are provided
const transporter = (EMAIL_HOST && EMAIL_USER && EMAIL_PASS)
  ? nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT || '587', 10),
      secure: parseInt(EMAIL_PORT || '587', 10) === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
  : null;

async function sendPasswordResetEmail(to, token) {
  if (!transporter) {
    console.warn('[mailer] SMTP not configured — skipping password reset email.');
    console.warn(`[mailer] Reset link: ${FRONTEND_URL}/reset-password/${token}`);
    return;
  }

  const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
  const from = EMAIL_FROM || 'TropiPine <noreply@tropipine.com>';

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset your TropiPine password',
    text: `You requested a password reset.\n\nClick the link below to set a new password (expires in 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E5DDD3;">

                <!-- Header -->
                <tr>
                  <td style="padding:36px 40px 24px;border-bottom:1px solid #E5DDD3;">
                    <p style="margin:0;font-size:22px;font-style:italic;color:#1A1410;font-family:Georgia,serif;font-weight:600;">TropiPine</p>
                    <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8C6F58;">Premium Tropical Fruits</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    <h1 style="margin:0 0 16px;font-size:26px;font-weight:700;color:#1A1410;font-family:Georgia,serif;line-height:1.2;">
                      Reset your password
                    </h1>
                    <p style="margin:0 0 20px;font-size:14px;color:#8C6F58;line-height:1.65;">
                      We received a request to reset the password for your TropiPine account. Click the button below to set a new password. This link expires in <strong style="color:#1A1410;">1 hour</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                      <tr>
                        <td style="background:#2A3B26;">
                          <a href="${resetUrl}" target="_blank"
                            style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 12px;font-size:13px;color:#8C6F58;line-height:1.65;">
                      Or copy and paste this URL into your browser:
                    </p>
                    <p style="margin:0 0 24px;font-size:12px;color:#2A3B26;word-break:break-all;font-family:monospace;">
                      ${resetUrl}
                    </p>

                    <p style="margin:24px 0 0;padding-top:24px;border-top:1px solid #E5DDD3;font-size:12px;color:#BDA88A;line-height:1.65;">
                      If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #E5DDD3;background:#F8F5F0;">
                    <p style="margin:0;font-size:11px;color:#BDA88A;">
                      © ${new Date().getFullYear()} TropiPine · Dhaka, Bangladesh
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
