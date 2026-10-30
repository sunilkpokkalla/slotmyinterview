import { config } from "../config/env.js";
import { logger } from "../config/logger.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, html, text } = options;

    // Resend Provider
    if (config.email.provider === "resend" && config.email.resendApiKey && !config.email.resendApiKey.startsWith("re_test")) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.email.resendApiKey}`,
          },
          body: JSON.stringify({
            from: config.email.from,
            to,
            subject,
            html,
            text,
          }),
        });

        if (!response.ok) {
          const errData = await response.text();
          logger.error("Resend API error:", { errData });
          return false;
        }

        logger.info(`Email successfully dispatched via Resend to ${to}: "${subject}"`);
        return true;
      } catch (err: any) {
        logger.error(`Resend email delivery failure: ${err.message}`);
        return false;
      }
    }

    // SendGrid Provider
    if (config.email.provider === "sendgrid" && config.email.sendgridApiKey) {
      try {
        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.email.sendgridApiKey}`,
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: config.email.from },
            subject,
            content: [
              { type: "text/html", value: html },
              ...(text ? [{ type: "text/plain", value: text }] : []),
            ],
          }),
        });

        if (!response.ok) {
          const errData = await response.text();
          logger.error("SendGrid API error:", { errData });
          return false;
        }

        logger.info(`Email successfully dispatched via SendGrid to ${to}: "${subject}"`);
        return true;
      } catch (err: any) {
        logger.error(`SendGrid email delivery failure: ${err.message}`);
        return false;
      }
    }

    // Default / Development: Structured Console delivery
    logger.info(`[Email Service Simulation] Delivering email to: ${to}`);
    logger.info(`[Subject]: ${subject}`);
    logger.debug(`[Body Preview]:\n${text || html.substring(0, 300)}...`);
    return true;
  },

  // Templates
  createJobMatchAlertEmail(params: {
    seekerName: string;
    jobTitle: string;
    companyName: string;
    location: string;
    workType: string;
    salaryRange: string;
    matchedSkills: string[];
    applyUrl: string;
    tuneAlertsUrl: string;
  }): { subject: string; html: string; text: string } {
    const { seekerName, jobTitle, companyName, location, workType, salaryRange, matchedSkills, applyUrl, tuneAlertsUrl } = params;

    const subject = `🎯 Match Alert: ${companyName} is hiring a ${jobTitle}`;
    
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; rounded: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 24px;">SlotMyInterview</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">AI-Powered Software Engineer Marketplace</p>
        </div>

        <p style="font-size: 16px; color: #1e293b;">Hi ${seekerName},</p>
        
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          A new high-priority role matches your verified skill set on <strong>SlotMyInterview</strong>:
        </p>

        <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">${jobTitle}</h3>
          <p style="margin: 0 0 6px 0; color: #475569; font-weight: 600;">${companyName} &bull; ${location} (${workType})</p>
          <p style="margin: 0 0 10px 0; color: #10b981; font-weight: 700;">${salaryRange}</p>
          <div>
            <span style="font-size: 13px; color: #64748b;">Matching Skills:</span>
            <div style="margin-top: 6px;">
              ${matchedSkills.map(skill => `<span style="display: inline-block; background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 9999px; font-size: 12px; margin-right: 4px; margin-bottom: 4px; font-weight: 500;">${skill}</span>`).join(" ")}
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${applyUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            One-Click Submit Interest &rarr;
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />

        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          You receive up to 3 high-affinity alerts per week based on your preferences.
          <br />
          <a href="${tuneAlertsUrl}" style="color: #6366f1; text-decoration: underline;">Tune frequency or pause alerts</a> in your settings.
        </p>
      </div>
    `;

    const text = `Hi ${seekerName},\n\nA new job matches your skills: ${jobTitle} at ${companyName}.\nLocation: ${location} (${workType})\nSalary: ${salaryRange}\nMatching Skills: ${matchedSkills.join(", ")}\n\nSubmit interest with one click: ${applyUrl}\n\nTune or pause alerts: ${tuneAlertsUrl}`;

    return { subject, html, text };
  },

  createTaskAssignmentEmail(params: {
    candidateName: string;
    jobTitle: string;
    companyName: string;
    taskTitle: string;
    taskType: string;
    instructions: string;
    deadline: string;
    dashboardUrl: string;
  }): { subject: string; html: string; text: string } {
    const { candidateName, jobTitle, companyName, taskTitle, taskType, instructions, deadline, dashboardUrl } = params;

    const subject = `📋 Action Required: Assessment assigned by ${companyName} for ${jobTitle}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #4f46e5; margin: 0 0 16px 0;">Assessment Assigned</h2>
        <p style="color: #334155;">Hello ${candidateName},</p>
        <p style="color: #334155;">
          ${companyName} has progressed your application for <strong>${jobTitle}</strong> to the <strong>Tasked</strong> stage and assigned the following evaluation:
        </p>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${taskType.replace(/_/g, " ")}</p>
          <p style="margin: 0 0 8px 0;"><strong>Title:</strong> ${taskTitle}</p>
          <p style="margin: 0 0 8px 0; color: #dc2626;"><strong>Deadline:</strong> ${deadline}</p>
          <p style="margin: 8px 0 0 0; color: #475569;"><strong>Instructions:</strong></p>
          <div style="background: #ffffff; padding: 12px; border-radius: 6px; font-size: 14px; margin-top: 6px; white-space: pre-line; border: 1px solid #e2e8f0;">
            ${instructions}
          </div>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${dashboardUrl}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Open Assessment & Submit Solution
          </a>
        </div>
      </div>
    `;

    const text = `Hello ${candidateName},\n\n${companyName} assigned you a task for ${jobTitle}: ${taskTitle} (${taskType}). Deadline: ${deadline}.\nInstructions:\n${instructions}\n\nSubmit on your dashboard: ${dashboardUrl}`;

    return { subject, html, text };
  },

  createInterviewBookedEmail(params: {
    recipientName: string;
    jobTitle: string;
    counterpartyName: string;
    format: string;
    location: string;
    startTime: string;
    endTime: string;
  }): { subject: string; html: string; text: string } {
    const { recipientName, jobTitle, counterpartyName, format, location, startTime, endTime } = params;

    const subject = `🗓️ Interview Confirmed: ${jobTitle} with ${counterpartyName}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #10b981; margin: 0 0 16px 0;">Interview Confirmed!</h2>
        <p style="color: #334155;">Hello ${recipientName},</p>
        <p style="color: #334155;">Your interview slot for <strong>${jobTitle}</strong> with <strong>${counterpartyName}</strong> has been successfully booked.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Format:</strong> ${format}</p>
          <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${startTime} - ${endTime}</p>
          <p style="margin: 0;"><strong>Meeting Link / Location:</strong> <a href="${location}" style="color: #059669;">${location}</a></p>
        </div>
        <p style="font-size: 14px; color: #64748b;">Please arrive 5 minutes early. A calendar invitation has also been synchronized.</p>
      </div>
    `;

    const text = `Interview Confirmed!\nPosition: ${jobTitle}\nWith: ${counterpartyName}\nFormat: ${format}\nTime: ${startTime} - ${endTime}\nLocation: ${location}`;

    return { subject, html, text };
  }
};

