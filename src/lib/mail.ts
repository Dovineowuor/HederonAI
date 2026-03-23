import nodemailer from "nodemailer";

// ─── SMTP Configuration ─────────────────────────────────────────────────────
const smtpConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s+/g, ""),
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// ─── Shared Brand Template ───────────────────────────────────────────────────
function brandedEmail(subject: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f12;border:1px solid #27272a;border-radius:20px;overflow:hidden;max-width:600px;width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed20,#1e1b4b40);padding:32px 40px;border-bottom:1px solid #27272a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <div style="width:36px;height:36px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:10px;display:inline-block;vertical-align:middle;"></div>
                      <span style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:-0.5px;vertical-align:middle;margin-left:10px;">Hederon AI</span>
                    </div>
                    <p style="color:#71717a;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin:8px 0 0;">Decentralized AI Execution Platform</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0a0a0d;border-top:1px solid #27272a;padding:24px 40px;">
              <p style="color:#3f3f46;font-size:11px;line-height:1.7;margin:0;">
                This email was sent by <strong style="color:#52525b;">Hederon AI</strong>. You're receiving this because you have an account on our platform.<br/>
                Powered by the Hedera Network · Protocol v1.0.0 Beta
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Send helper ─────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, contentHtml: string): Promise<boolean> {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Hederon AI" <noreply@hederonai.dovetecenterprises.site>',
    to,
    subject,
    html: brandedEmail(subject, contentHtml),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[mail] Sent "${subject}" to ${to}`);
    return true;
  } catch (error: any) {
    console.error(`[mail] Failed to send "${subject}" to ${to}:`, error.message);
    return false;
  }
}

// ─── Email Functions ─────────────────────────────────────────────────────────

/** Admin magic link for dashboard access */
export async function sendMagicLink(email: string, token: string): Promise<boolean> {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/verify?token=${token}`;
  const content = `
    <h1 style="color:#a78bfa;font-size:28px;font-weight:900;margin:0 0 12px;">🛡️ Admin Access Link</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 32px;">
      You requested a secure access link for the <strong style="color:#fff;">Hederon AI Admin Dashboard</strong>.
      This link expires in <strong style="color:#f59e0b;">15 minutes</strong>.
    </p>
    <a href="${adminUrl}" style="display:inline-block;background:#ffffff;color:#000;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">Verify Admin Session →</a>
    <p style="color:#3f3f46;font-size:11px;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
  `;
  return sendEmail(email, "🛡️ Hederon AI: Admin Access Link", content);
}

/** Welcome email after successful signup */
export async function sendWelcomeEmail(email: string, name: string, hederaAccountId?: string): Promise<boolean> {
  const content = `
    <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0 0 4px;">Welcome aboard, ${name}! 🚀</h1>
    <p style="color:#7c3aed;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 24px;">Your AI Executive Team is Ready</p>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      You've successfully joined <strong style="color:#fff;">Hederon AI</strong> — the platform where intelligent agents execute real work, secured by the Hedera Network.
    </p>
    ${hederaAccountId ? `
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#71717a;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Hedera Wallet</p>
      <p style="color:#a78bfa;font-family:monospace;font-size:14px;font-weight:700;margin:0;">${hederaAccountId}</p>
    </div>` : ""}
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 32px;">Explore the <strong style="color:#fff;">Agent Marketplace</strong>, hire your first AI executive, and watch autonomous work happen on-chain — in seconds.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">Browse the Marketplace →</a>
  `;
  return sendEmail(email, "🚀 Welcome to Hederon AI — Your AI Executive Team", content);
}

/** Sign-in notification email */
export async function sendSignInNotification(email: string, name: string): Promise<boolean> {
  const now = new Date().toLocaleString("en-US", { timeZone: "UTC", dateStyle: "full", timeStyle: "short" });
  const content = `
    <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 12px;">🔔 New Sign-In Detected</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Hi <strong style="color:#fff;">${name}</strong>, your <strong style="color:#fff;">Hederon AI</strong> account was just accessed.
    </p>
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#71717a;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Sign-In Time (UTC)</p>
      <p style="color:#fff;font-family:monospace;font-size:14px;margin:0;">${now}</p>
    </div>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">If this was you, no action is required. If you didn't sign in, <strong style="color:#f87171;">please secure your account immediately.</strong></p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="display:inline-block;background:#ef4444;color:#fff;padding:14px 28px;border-radius:12px;font-weight:900;text-decoration:none;font-size:14px;">Secure My Account →</a>
  `;
  return sendEmail(email, "🔔 Hederon AI: New Sign-In to Your Account", content);
}

/** Account suspension notification */
export async function sendSuspensionEmail(email: string, name: string): Promise<boolean> {
  const content = `
    <h1 style="color:#ef4444;font-size:26px;font-weight:900;margin:0 0 12px;">🚫 Account Suspended</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Hi <strong style="color:#fff;">${name}</strong>, your <strong style="color:#fff;">Hederon AI</strong> account has been temporarily suspended by our Trust & Safety team.
    </p>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      While suspended, you will not be able to access the platform or initiate new escrow transactions. If you believe this is an error, please contact our support team.
    </p>
    <a href="mailto:${process.env.SMTP_USER}" style="display:inline-block;background:#27272a;color:#fff;padding:14px 28px;border-radius:12px;font-weight:900;text-decoration:none;font-size:14px;">Contact Support →</a>
  `;
  return sendEmail(email, "🚫 Hederon AI: Your Account Has Been Suspended", content);
}

/** Account reinstatement notification */
export async function sendReinstateEmail(email: string, name: string): Promise<boolean> {
  const content = `
    <h1 style="color:#34d399;font-size:26px;font-weight:900;margin:0 0 12px;">✅ Account Reinstated</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Great news, <strong style="color:#fff;">${name}</strong>! Your <strong style="color:#fff;">Hederon AI</strong> account has been reinstated and you can now access the platform again.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">Return to Platform →</a>
  `;
  return sendEmail(email, "✅ Hederon AI: Your Account Has Been Reinstated", content);
}

/** New escrow transaction notification to client */
export async function sendEscrowCreatedEmail(email: string, name: string, jobId: string, agentName: string, amountHbar: number): Promise<boolean> {
  const content = `
    <h1 style="color:#fff;font-size:26px;font-weight:900;margin:0 0 12px;">💸 Escrow Created</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Hi <strong style="color:#fff;">${name}</strong>, your escrow for a new job has been successfully created on the Hedera Network.
    </p>
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #27272a;">
            <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Job ID</span>
            <p style="color:#a78bfa;font-family:monospace;font-size:13px;margin:4px 0 0;">${jobId}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #27272a;">
            <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Agent</span>
            <p style="color:#fff;font-size:14px;font-weight:700;margin:4px 0 0;">${agentName}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Escrowed Amount</span>
            <p style="color:#34d399;font-family:monospace;font-size:20px;font-weight:900;margin:4px 0 0;">${amountHbar} ℏ</p>
          </td>
        </tr>
      </table>
    </div>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">The funds are securely locked in escrow. Your AI agent will begin execution immediately. You'll receive another email when the task is complete.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/my-jobs" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">View My Jobs →</a>
  `;
  return sendEmail(email, `💸 Hederon AI: Escrow Created — ${agentName}`, content);
}

/** Agent task completion emails: one to client, one to agent owner */
export async function sendJobCompletedEmail(params: {
  clientEmail: string;
  clientName: string;
  ownerEmail: string;
  ownerName: string;
  jobId: string;
  agentName: string;
  amountHbar: number;
  ownerEarnings: number;
}): Promise<void> {
  const { clientEmail, clientName, ownerEmail, ownerName, jobId, agentName, amountHbar, ownerEarnings } = params;

  const clientContent = `
    <h1 style="color:#34d399;font-size:26px;font-weight:900;margin:0 0 12px;">✅ Task Completed!</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Hi <strong style="color:#fff;">${clientName}</strong>, your AI agent <strong style="color:#fff;">${agentName}</strong> has completed your task and deliverables are ready.
    </p>
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;border-bottom:1px solid #27272a;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Job ID</span>
          <p style="color:#a78bfa;font-family:monospace;font-size:13px;margin:4px 0 0;">${jobId}</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Total Paid</span>
          <p style="color:#34d399;font-family:monospace;font-size:20px;font-weight:900;margin:4px 0 0;">${amountHbar} ℏ</p>
        </td></tr>
      </table>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/my-jobs" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">View Deliverables →</a>
  `;

  const ownerContent = `
    <h1 style="color:#f59e0b;font-size:26px;font-weight:900;margin:0 0 12px;">💰 You Earned HBAR!</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Great news, <strong style="color:#fff;">${ownerName}</strong>! Your agent <strong style="color:#fff;">${agentName}</strong> just completed a task. The deliverables are now with the client for review (handshake).
    </p>
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;border-bottom:1px solid #27272a;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Job ID</span>
          <p style="color:#a78bfa;font-family:monospace;font-size:13px;margin:4px 0 0;">${jobId}</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Pending Earnings</span>
          <p style="color:#f59e0b;font-family:monospace;font-size:24px;font-weight:900;margin:4px 0 0;">${ownerEarnings.toFixed(4)} ℏ</p>
        </td></tr>
      </table>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#000;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">View Creator Dashboard →</a>
  `;

  await Promise.all([
    sendEmail(clientEmail, `✅ Hederon AI: Task Complete — ${agentName}`, clientContent),
    ownerEmail !== clientEmail
      ? sendEmail(ownerEmail, `⏳ Hederon AI: Agent Completed Task — Awaiting Review`, ownerContent)
      : Promise.resolve(false),
  ]);
}

/** Client approved handshake */
export async function sendHandshakeConfirmedEmail(email: string, name: string, jobId: string, agentName: string): Promise<boolean> {
  const content = `
    <h1 style="color:#34d399;font-size:26px;font-weight:900;margin:0 0 12px;">🤝 Handshake Confirmed</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Hi <strong style="color:#fff;">${name}</strong>, you have successfully confirmed the handshake for Job <strong style="color:#fff;">${jobId}</strong>.
    </p>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      The escrow smart contract has released the funds to the agent creator on the Hedera Network. The transaction is immutable and final. Thank you for using Hederon AI!
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace/my-jobs" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">View Job History →</a>
  `;
  return sendEmail(email, `🤝 Hederon AI: Handshake Confirmed — ${agentName}`, content);
}

/** Escrow Released (Funds sent to agent owner) */
export async function sendEscrowReleaseEmail(email: string, name: string, jobId: string, agentName: string, amountHbar: number): Promise<boolean> {
  const content = `
    <h1 style="color:#10b981;font-size:26px;font-weight:900;margin:0 0 12px;">💸 Escrow Released!</h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">
      Congratulations, <strong style="color:#fff;">${name}</strong>! The client has approved the deliverables for your agent <strong style="color:#fff;">${agentName}</strong>.
    </p>
    <div style="background:#171717;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:8px 0;border-bottom:1px solid #27272a;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Job ID</span>
          <p style="color:#a78bfa;font-family:monospace;font-size:13px;margin:4px 0 0;">${jobId}</p>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <span style="color:#71717a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Earnings Released</span>
          <p style="color:#10b981;font-family:monospace;font-size:24px;font-weight:900;margin:4px 0 0;">+${amountHbar.toFixed(4)} ℏ</p>
        </td></tr>
      </table>
    </div>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;">The funds have been transferred to your connected Hedera Wallet.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:16px 32px;border-radius:12px;font-weight:900;text-decoration:none;font-size:15px;">View Revenue Analytics →</a>
  `;
  return sendEmail(email, `💸 Hederon AI: Funds Released! — +${amountHbar.toFixed(4)} ℏ`, content);
}
