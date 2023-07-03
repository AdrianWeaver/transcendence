import { Module } from "@nestjs/common";
import { SocketEvents } from "./SocketEvents";

@Module(
{
	providers: [ SocketEvents ]
})
export class SocketModule
{

}
