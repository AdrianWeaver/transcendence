
import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./GameSocketEvents";

@Module({
	providers:
	[GameSocketEvents]
})
export class GameSocketModule
{

}
