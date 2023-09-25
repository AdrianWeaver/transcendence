import { Module } from '@nestjs/common';
import { ChatSocketEvents } from './ChatSocketEvent';
import { ChatService } from './Chat.service';
@Module({
    providers:
    [
        ChatSocketEvents,
        ChatService
    ]
})
export class ChatModule {}
