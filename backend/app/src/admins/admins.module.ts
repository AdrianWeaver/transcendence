import { Module } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { AdminsController } from "./admins.controller";
import { AnonymousUserService } from "../anonymous-user/anonymous-user.service";

@Module({
	providers:
	[
		AdminsService,
		AnonymousUserService
	],
	controllers: [AdminsController],
	exports: [AdminsService]
})
export class AdminsModule
{

}
