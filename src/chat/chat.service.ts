import { Injectable } from '@nestjs/common';
import * as Pusher from "pusher";

@Injectable()
export class ChatService {

	pusher: Pusher;

	constructor () {
		this.pusher = new Pusher({
			appId: "1305880",
			key: "3a6d14be537d2a7eb9e7",
			secret: "f7afc53b60fee4cf4687",
			cluster: "eu",
			useTLS: true
		});
	}
	async trigger(channel: string, event: string, data: any) {
		await this.pusher.trigger(channel, event, data);
	}
}
