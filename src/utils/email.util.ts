import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export async function sendEmailWithPassword(
  name: string,
  toEmail: string,
  code: string,
) {
  const emailBody = {
    Messages: [
      {
        From: {
          Email: 'lynesultane@gmail.com',
          Name: 'Skinly',
        },
        To: [
          {
            Email: toEmail,
            Name: name,
          },
        ],
        Subject: 'Your Verification Code',
        HTMLPart: `<h3>Hello ${name},</h3><p>Your verification code is: <strong>${code}</strong></p>`,
      },
    ],
  };

  try {
    const response = await axios.post('https://api.mailjet.com/v3.1/send', emailBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${process.env.API_KEY_EMAIl}:${process.env.KEY}`).toString('base64')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
