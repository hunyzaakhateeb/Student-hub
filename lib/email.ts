import nodemailer from 'nodemailer'

// Check if email is configured
const isEmailConfigured = () => {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS)
}

// Only create transporter if email is configured
const getTransporter = () => {
  if (!isEmailConfigured()) {
    return null
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail(to: string, subject: string, html: string) {
  // Skip email if not configured
  if (!isEmailConfigured()) {
    console.log('Email not configured. Skipping email send.')
    return false
  }

  try {
    const transporter = getTransporter()
    if (!transporter) {
      return false
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@placementportal.com',
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

