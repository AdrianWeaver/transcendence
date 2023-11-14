/* eslint-disable curly */
/* eslint-disable max-statements */
/* eslint-disable max-classes-per-file */
import { Body, Controller, ForbiddenException, Get, Logger, Param, Post, Req, UseGuards } from "@nestjs/common";
import { GameApiService } from "./game-api.service";
import { UserService } from "src/user/user.service";
import { UserAuthorizationGuard } from "../user/user.authorizationGuard";
import { IsNotEmpty, IsNumberString, IsUUID} from "class-validator";

class InviteDto
{
	@IsNotEmpty()
	friend: string;
}

class RevokeTokenDto
{
	@IsNotEmpty()
	@IsUUID()
	uuid: string;
}

class	FriendInvitationDto
{
	@IsNotEmpty()
	friendId: string
}

@Controller("api/game")
export class GameApiController
{
	private readonly logger = new Logger("api-game-controller");

	public constructor(
		private readonly gameApiService: GameApiService,
		private readonly userService: UserService
	)
	{
		this.logger.error("instanciate controller for the Game api"
			+ "id: " + this.gameApiService.getInstanceId());
		this.logger.verbose("Using the userService with id : "
			+ this.userService.getUuidInstance());
	}

	@Get("/")
	getRoot()
	{
		return ({
			message: "the service is available but will be implemented asap"
		});
	}

	// debug
	@Get("/user-service")
	getDataFromUserService()
	{
		return (this.userService.getAllUserRaw());
	}

	// debug
	@Get("/instance/service/game")
	getGameServiceCopy()
	{
		return (this.gameApiService.getGameServiceCopy());
	}

	
	@Post("/instance/myActiveGame")
	@UseGuards(UserAuthorizationGuard)
	getMyActiveGame(
		@Req() req: any
	)
	{
		const filter = "undefined"; // just for test
		const arrayFriends = this.gameApiService
			.getAllInstancesByUserIdAndFilter(req.user.id, filter);
		this.logger.error("Array friends", arrayFriends);
		this.logger.verbose("User req id :" + req.user.id);
		return ({
			random: [0],
			friend: arrayFriends
		});
	}

	@Post("/instance/revokeGame")
	@UseGuards(UserAuthorizationGuard)
	revokeGame(
		@Req() req: any,
		@Body() body: RevokeTokenDto): string
	{
		console.log(req.user.id);
		console.log(body);
		const indexGameInstance = this.gameApiService
			.findIndexGameInstanceUserProfileAndGameUuid(
				req.user.id, body.uuid
			);
		if (indexGameInstance !== -1)
		{
			this.gameApiService
				.setUserRevokedInstance(req.user.id, indexGameInstance);
		}
		return ("end");
	}

	@Post("/invite/friends")
	// @UseGuards(UserAuthorizationGuard)
	inviteFriend(
		@Req() req: any,
		@Body() body: FriendInvitationDto
	)
	{
		console.log(req.user.id);
		console.log(body);
		return ("hello");
	}

}
