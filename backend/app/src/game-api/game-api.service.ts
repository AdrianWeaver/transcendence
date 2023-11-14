/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable curly */
/* eslint-disable max-len */
import { Injectable, Logger } from "@nestjs/common";
import { privateDecrypt } from "crypto";
import { GameService } from "src/game-socket/Game.service";
import { UserService } from "../user/user.service";

@Injectable()
export class GameApiService
{
	private readonly logger = new Logger("API-GAME");

	public constructor(
		private readonly	gameService: GameService,
		private readonly	userService: UserService
	)
	{
		this.logger.error("I am using game service with id:"
			+ this.gameService.getInstanceId());
	}

	public getInstanceId()
	{
		return (this.gameService.getInstanceId());
	}

	public	getGameServiceCopy() : any
	{
		return (this.gameService.getGameServiceCopy());
	}

	public	inviteFriends(myProfileId: string, friendProfileId: string): any
	{
		// this.gameService.
	}
	public	getAllInstancesByUserIdAndFilter(myProfileId: string, filter: string)
	{
		const serviceResult = this.gameService.getAllInstancesByUserIdAndFilter(myProfileId, filter);
		for (const game of serviceResult)
		{
			console.log("service results : ", game.playerOne);
	
			if (game.playerOne.profileId === undefined)
				game.playerOne.profilePicture = "test"; // mettre une photo style
			else
			{
				const user = this.userService.getUserById(game.playerOne.profileId);
				if (user !== undefined)
					game.playerOne.profilePicture = user.avatar;
				else
					game.playerOne.profilePicture = ""; // erreur  normalement, mais mettre autre chose
			}
			if (game.playerTwo.profileId === undefined)
				game.playerTwo.profilePicture = "test"; // mettre une photo style
			else
			{
				const userTwo = this.userService.getUserById(game.playerTwo.profileId);
				if (userTwo !== undefined)
					game.playerTwo.profilePicture = userTwo.avatar;
				else
					game.playerTwo.profilePicture = ""; // erreur  normalement, mais mettre autre chose
			}
		}
		return (serviceResult);
	}

	public findIndexGameInstanceUserProfileAndGameUuid(myProfileId: string, gameUuid: string)
	{
		return (
			this.gameService.findIndexGameInstanceUserProfileAndGameUuid(myProfileId, gameUuid)
		);
	}

	public	setUserRevokedInstance(myProfileId: string, indexInstance: number)
	{
		this.gameService.setUserRevokedInstance(myProfileId, indexInstance);
	}
}
