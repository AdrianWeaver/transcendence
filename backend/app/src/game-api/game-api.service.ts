/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable curly */
/* eslint-disable max-len */
import { Injectable, Logger } from "@nestjs/common";
import { GameService } from "src/game-socket/Game.service";
import { UserService } from "../user/user.service";
import { FilteredArrayModel } from "src/game-socket/GameSocketEvents";
import { profile } from "console";
import { constrainedMemory } from "process";
import GameServe from "src/game-socket/Objects/GameServe";

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

	public getCopyWithActiveSocketSetAsActive(array: GameServe[])
	{
		const	copy = [...array];

		for (const instance of array)
		{
			switch (instance.playerOne.socketId)
			{
				case "undefined":
				case "disconnected":
				case "invited":
				case "revoked":
					break ;
				default:
					instance.playerOne.socketId = "connected";
			}
			switch (instance.playerTwo.socketId)
			{
				case "undefined":
				case "disconnected":
				case "invited":
				case "revoked":
					break ;
				default:
					instance.playerTwo.socketId = "connected";
			}
		}
		return (copy);
	}

	public	getAllInstancesByUserId(profileId: string)
	{
		const	tempClassicalGameMode = this.gameService.filterGameByProfileIdAndGameMode(profileId, "classical");
		const	deepCopyClassical = tempClassicalGameMode.map((instance) =>
		{
			return (instance.getSeralizable());
		});
		const	aliveClassicalGameMode = this.getCopyWithActiveSocketSetAsActive(deepCopyClassical);
		const	classicalArray = this.gameService.filterGameArrayBySocketState(profileId, aliveClassicalGameMode);

		// const	friendModeGame = this.gameService.filterGameByProfileIdAndGameMode(profileId, "friend");
		// console.log(copyClassicalGameMode);
		// const	upsideDownGameMode = this.gameService.filterGameByProfileIdAndGameMode(profileId, "upside-down");


		// console.log(classicalGameMode);
		// const	friendArray = this.gameService.filterGameArrayBySocketState(profileId, friendModeGame);

		// const	upsideDownArray = this.gameService.filterGameArrayBySocketState(profileId, upsideDownGameMode);

		// console.log("classical ", classicalArray);
		// const	friendSerialzed = this.getFilteredSerialized(friendArray);
		// const	classicalSerialzed = this.getFilteredSerialized(classicalArray);
		// const	upsideDownSerialzed = this.getFilteredSerialized(upsideDownArray);

		return (
			{
				classical: classicalArray.filtered,
			}
		);
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
