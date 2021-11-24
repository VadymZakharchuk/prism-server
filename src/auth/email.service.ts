import { SMTPClient } from 'emailjs';
import { Injectable } from '@nestjs/common';

@Injectable()

export class EmailService {

	async sendEmail(email: string, verifyCode: string) {
		const  client = new SMTPClient({
			user: process.env.UKR_NET_USER,
			password: process.env.UKR_NET_PASS,
			host: process.env.UKR_NET_SMTP,
			ssl: true,
		})
		const body = `<html><h2>Your verification code :: ${verifyCode}</h2><h4>PointPrism support</h4></html>`
		const message = {
			text: `Your verification code :: ${verifyCode}. PointPrism support`,
			from: 'vadimz@ukr.net',
			to: email,
			subject: 'Verification code to set new password',
			attachment: [
				{
					data: body,
					alternative: true
				}
			],
		}
		try {
			// @ts-ignore
			const res = await client.sendAsync(message)
			return res.header.to
		} catch (e) {
			return e
		}
	}
}
