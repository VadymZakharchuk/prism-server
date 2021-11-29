import { createParamDecorator, ExecutionContext, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const TokenGetUserID = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const jwt = new JwtService({ secret: process.env.SECRET_KEY })
		const req = ctx.switchToHttp().getRequest();
		try {
			const authHeader = req.headers.authorization
			const token = authHeader.split(' ')[1]
			const userObj = jwt.decode(token)
			return userObj['id']
		} catch (e) {
			throw new HttpException('Bearer token error', 495)
		}
	},
);
