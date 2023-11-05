
import { Module } from "@nestjs/common";
import { GameSocketEvents } from "./GameSocketEvents";
import { GameService } from "./Game.service";
import { UserModule } from "../user/user.module";

@Module({
	imports: [UserModule],
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
