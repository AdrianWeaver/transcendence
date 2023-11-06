import { Controller, Get, Logger, Post } from "@nestjs/common";
import
{
	AnonymousAdminResponseModel
}	from "../anonymous-user/anonymous-user.interface";
import { AnonymousUserService } from "../anonymous-user/anonymous-user.service";
import { UserService } from "../user/user.service";

@Controller("admins")
export class AdminsController
{
	private readonly	logger;
	constructor(
		private readonly	anonymousUserService: AnonymousUserService,
		private	readonly	userService: UserService,
	)
	{
		this.logger = new Logger("ADMIN");
		this.logger
			.debug("Admin start with anonymous-user-service instance id "
				+ this.anonymousUserService.getUuidInstance());
		this.logger
			.debug("Admin start with user-service instance id "
				+ this.userService.getUuidInstance());
	}

	// Unprotected for now may use a special Guard For Administrator/Moderator
	@Get("list-all-anonymous")
	adminListAllAnonymous()
	: AnonymousAdminResponseModel
	{
		this.logger
			.log("A user request 'list-all-anonymous'");
		return (this.anonymousUserService.getAnonymousUserArray());
	}

	// Unprotected for now 
	@Post("close-all-connection")
	adminCloseAllClient()
	: string
	{
		this.logger
			.log("A user request 'close-all-anonymous'");
		return (this.anonymousUserService.adminCloseAllClient());
	}

	@Get("users/get-all-users")
	getAllUsers()
	{
		return (this.userService.getAllUserRaw());
	}
}
