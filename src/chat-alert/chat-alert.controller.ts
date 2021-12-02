import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { ChatAlertGateway } from './chat-alert.gateway';

@Controller('alert')
export class ChatAlertController {

    constructor(private alertGateway: ChatAlertGateway) {}

    @Post()
    @HttpCode(200)
    sendAlertToAll(@Body() dto: { message: string }) {
        this.alertGateway.sendToAll(dto.message);
        return dto;
    }
}
