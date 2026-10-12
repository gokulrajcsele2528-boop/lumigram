import nodemailer, { type Transporter } from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Lumigram <noreply@lumigram.com>";
const APP_URL = process.env.CLIENT_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    } else {
      // Development mock / fallback transporter (logs to console)
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }
  return transporter;
}

/**
 * Base Lumigram email wrapper with signature dark aesthetic
 */
function createEmailTemplate(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #05070d; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0b1120; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 36px 30px 20px 30px; border-bottom: 1px solid #1e293b;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px; background: linear-gradient(135deg, #00f2fe, #f43f5e, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; color: #00f2fe; margin-bottom: 6px;">
                      ✨ Lumigram
                    </div>
                    <div style="font-size: 13px; color: #94a3b8; letter-spacing: 0.5px;">
                      Share your light.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 30px 32px; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px 32px 30px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">This email was sent to you as part of your security settings on Lumigram.</p>
              <p style="margin: 0;">If you did not make this request, please safely ignore this message or update your password.</p>
              <p style="margin: 12px 0 0 0; color: #475569;">© ${new Date().getFullYear()} Lumigram Inc. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. Send Email Verification Link
 */
export async function sendVerificationEmail(
  to: string,
  username: string,
  token: string
): Promise<{ success: boolean; info?: any }> {
  const verifyUrl = `${APP_URL}/verify-email/${token}`;

  const html = createEmailTemplate(
    "Verify your Lumigram Email",
    `
    <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
      Welcome to Lumigram, @${username}! 🌟
    </h2>
    <p style="margin-bottom: 24px; color: #cbd5e1;">
      Thank you for creating your account. Please verify your email address to unlock full community access and secure your account.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}" style="background: linear-gradient(135deg, #0095f6 0%, #1877f2 100%); color: #ffffff; font-weight: 600; font-size: 15px; padding: 14px 32px; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 149, 246, 0.4);">
        Verify Email Address
      </a>
    </div>
    <p style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
      Button not working? Copy and paste this URL into your browser:
    </p>
    <p style="font-size: 12px; color: #38bdf8; word-break: break-all; background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
      ${verifyUrl}
    </p>
    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
      ⏳ This verification link expires in 24 hours.
    </p>
    `
  );

  return sendMail(to, "Verify your email on Lumigram", html, verifyUrl);
}

/**
 * 2. Send Password Reset Link
 */
export async function sendPasswordResetEmail(
  to: string,
  username: string,
  token: string
): Promise<{ success: boolean; info?: any }> {
  const resetUrl = `${APP_URL}/reset-password/${token}`;

  const html = createEmailTemplate(
    "Reset your Lumigram Password",
    `
    <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
      Reset your password, @${username}
    </h2>
    <p style="margin-bottom: 24px; color: #cbd5e1;">
      We received a request to reset your Lumigram account password. Click the button below to choose a new, secure password.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-weight: 600; font-size: 15px; padding: 14px 32px; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(244, 63, 94, 0.4);">
        Reset Password
      </a>
    </div>
    <p style="font-size: 13px; color: #94a3b8; margin-bottom: 8px;">
      Button not working? Copy and paste this URL:
    </p>
    <p style="font-size: 12px; color: #38bdf8; word-break: break-all; background-color: #0f172a; padding: 12px; border-radius: 8px; border: 1px solid #1e293b;">
      ${resetUrl}
    </p>
    <p style="font-size: 13px; color: #fbbf24; margin-top: 24px; background: rgba(251, 191, 36, 0.1); padding: 10px 14px; border-radius: 8px; border-left: 3px solid #fbbf24;">
      ⏱️ For your security, this single-use link expires in 30 minutes.
    </p>
    `
  );

  return sendMail(to, "Lumigram password reset request", html, resetUrl);
}

/**
 * 3. Send Two-Factor Authentication OTP Code
 */
export async function sendTwoFactorOtpEmail(
  to: string,
  username: string,
  otpCode: string
): Promise<{ success: boolean; info?: any }> {
  const html = createEmailTemplate(
    "Your Lumigram Security Code",
    `
    <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
      Two-Factor Verification Code
    </h2>
    <p style="margin-bottom: 24px; color: #cbd5e1;">
      Hi @${username}, use the single-use 6-digit code below to complete your login:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background-color: #0f172a; border: 2px solid #0095f6; padding: 16px 36px; border-radius: 14px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; box-shadow: 0 0 25px rgba(0, 149, 246, 0.3);">
        ${otpCode}
      </div>
    </div>
    <p style="font-size: 13px; color: #94a3b8; text-align: center;">
      This code is valid for 10 minutes and allows a maximum of 5 attempts.
    </p>
    <p style="font-size: 13px; color: #ef4444; margin-top: 20px;">
      ⚠️ Never share this code with anyone. Lumigram staff will never ask for your code.
    </p>
    `
  );

  return sendMail(to, `Lumigram Login Code: ${otpCode}`, html, `OTP: ${otpCode}`);
}

/**
 * 4. Send "New Device Login Detected" Alert
 */
export async function sendNewDeviceLoginAlert(
  to: string,
  username: string,
  details: {
    ip: string;
    browser: string;
    device: string;
    time: string;
  }
): Promise<{ success: boolean; info?: any }> {
  const html = createEmailTemplate(
    "New Device Login Detected",
    `
    <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px;">
      New Login Alert for @${username} 🛡️
    </h2>
    <p style="margin-bottom: 20px; color: #cbd5e1;">
      We noticed a new login to your Lumigram account from an unrecognized device:
    </p>
    <table role="presentation" width="100%" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; padding: 16px; margin-bottom: 24px;" cellspacing="0" cellpadding="6">
      <tr>
        <td style="color: #94a3b8; font-size: 13px; width: 110px;">Device:</td>
        <td style="color: #ffffff; font-size: 13px; font-weight: 600;">${details.device}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; font-size: 13px;">Browser:</td>
        <td style="color: #ffffff; font-size: 13px; font-weight: 600;">${details.browser}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; font-size: 13px;">IP Address:</td>
        <td style="color: #38bdf8; font-size: 13px; font-mono: monospace;">${details.ip}</td>
      </tr>
      <tr>
        <td style="color: #94a3b8; font-size: 13px;">Date & Time:</td>
        <td style="color: #ffffff; font-size: 13px;">${details.time}</td>
      </tr>
    </table>
    <p style="font-size: 13px; color: #cbd5e1;">
      If this was you, you can safely disregard this email. If you did not log in, please reset your password immediately and revoke active sessions in your Settings.
    </p>
    `
  );

  return sendMail(to, "Security Alert: New login detected on Lumigram", html);
}

/**
 * Core send mail dispatcher
 */
async function sendMail(
  to: string,
  subject: string,
  html: string,
  previewText?: string
): Promise<{ success: boolean; info?: any }> {
  try {
    const client = getTransporter();
    const result = await client.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`📧 [Lumigram Mail] Sent "${subject}" to ${to} | ${previewText || ""}`);
    return { success: true, info: result };
  } catch (error: any) {
    console.error(`⚠️ [Lumigram Mail Error] Failed to send email to ${to}:`, error.message);
    // Don't throw - allow graceful fallback in dev/test
    return { success: false, info: error.message };
  }
}
