import { Injectable, Logger } from "@nestjs/common";
import { GameService } from "src/game-socket/Game.service";

@Injectable()
export class GameApiService
{
	private readonly logger = new Logger("API-GAME");

	public constructor(
		private readonly gameService: GameService
	)
	{
		this.logger.error("I am using game service with id:"
			+ this.gameService.getInstanceId());
	}

	public getInstanceId()
	{
		return (this.gameService.getInstanceId());
	}

	public	getGameServiceCopy() :any
	{
		return (this.gameService.getGameServiceCopy());
	}
}
