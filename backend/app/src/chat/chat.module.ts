import { Module } from '@nestjs/common';
import { ChatSocketEvents } from './ChatSocketEvent';
@Module({
    providers:
    [ChatSocketEvents]
})
export class ChatModule {}
