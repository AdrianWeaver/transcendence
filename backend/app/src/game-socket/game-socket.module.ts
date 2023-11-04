
import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./GameSocketEvents";
import { GameService } from "./Game.service";

@Module({
	providers:
	[
		GameSocketEvents,
		GameService
	],
	exports: [GameService]
})
export class GameSocketModule
{

}
