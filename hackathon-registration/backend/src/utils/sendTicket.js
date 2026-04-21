// Import nodemailer to send emails via SMTP.
const nodemailer = require('nodemailer');
// Import qrcode package to generate QR image data.
const QRCode = require('qrcode');

// Create and export an async function to send ticket email to a user.
async function sendTicketEmail(user) {
  // Validate that a user object was provided to the function.
  if (!user) {
    // Throw an error if user is missing.
    throw new Error('User data is required');
  }

  // Validate that user id exists because it is needed for QR data.
  if (!user._id) {
    // Throw an error when _id is missing.
    throw new Error('User _id is required');
  }

  // Validate that user email exists because it is needed for recipient and QR data.
  if (!user.email) {
    // Throw an error when email is missing.
    throw new Error('User email is required');
  }

  // Validate that user name exists so email greeting is meaningful.
  if (!user.name) {
    // Throw an error when name is missing.
    throw new Error('User name is required');
  }

  // Read sender Gmail address from environment variables.
  const emailUser = process.env.EMAIL_USER;
  // Read Gmail app password from environment variables.
  const emailPass = process.env.EMAIL_PASS;

  // Ensure EMAIL_USER is configured before trying to send email.
  if (!emailUser) {
    // Throw configuration error when EMAIL_USER is missing.
    throw new Error('EMAIL_USER is not configured');
  }

  // Ensure EMAIL_PASS is configured before trying to send email.
  if (!emailPass) {
    // Throw configuration error when EMAIL_PASS is missing.
    throw new Error('EMAIL_PASS is not configured');
  }

  // Build the exact ticket payload string to encode in QR code.
  const ticketCode = `NEXATHON-2026-${user._id}-${user.email}`;
  // Generate a base64 data URL PNG from the ticket code string.
  const qrDataUrl = await QRCode.toDataURL(ticketCode);

  // Create SMTP transporter configured for Gmail.
  const transporter = nodemailer.createTransport({
    // Use Gmail service preset for host/port/security defaults.
    service: 'gmail',
    // Provide authentication credentials from environment variables.
    auth: {
      // Set Gmail username used for sending emails.
      user: emailUser,
      // Set Gmail app password used for SMTP login.
      pass: emailPass,
    },
  });

  // Build HTML body containing event details and embedded QR image.
  const html = `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
      <h1 style="margin-bottom: 8px;">You're registered for AIML Hackathon 2026!</h1>
      <p style="margin: 0 0 12px;">Hi ${user.name},</p>
      <p style="margin: 0 0 8px;">Event date: April 24, 2026</p>
      <p style="margin: 0 0 16px;">Show this QR code at the venue for check-in</p>
      <img src="${qrDataUrl}" alt="Ticket QR Code" style="width: 220px; height: 220px; border: 1px solid #e5e7eb; padding: 8px; border-radius: 8px;" />
    </div>
  `;

  // Send the email and wait for nodemailer response.
  const info = await transporter.sendMail({
    // Set sender identity displayed in recipient inbox.
    from: `"AIML Hackathon 2026" <${emailUser}>`,
    // Set recipient email address from provided user object.
    to: user.email,
    // Set a clear subject line for the ticket email.
    subject: 'Your AIML Hackathon 2026 Ticket',
    // Attach the HTML content that includes inline QR image.
    html,
  });

  // Return nodemailer response info for optional logging/debugging.
  return info;
}

// Export the function so other route files can import and use it.
module.exports = { sendTicketEmail };
