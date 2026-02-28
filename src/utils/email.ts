import nodemailer from 'nodemailer';
import { EmailConfig } from '../types/index.js';

export const createEmailTransporter = (config: EmailConfig) => {
  console.log('Creating email transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user
  });
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });
};

export const getEmailConfig = (): EmailConfig => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Email configuration is incomplete. Please check your environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS are required.');
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  };
};

export const validateEmailConfig = async (transporter: nodemailer.Transporter) => {
  try {
    console.log('Validating email configuration...');
    await transporter.verify();
    console.log('✓ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('✗ Email configuration validation failed:', error instanceof Error ? error.message : error);
    return false;
  }
};
