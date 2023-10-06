import { Module } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { AdminsController } from "./admins.controller";
import { AnonymousUserService } from "../anonymous-user/anonymous-user.service";
import { AnonymousUserModule } from "../anonymous-user/anonyous-user.module";

@Module({
	imports: [AnonymousUserModule],
	providers: [AdminsService],
	controllers: [AdminsController],
	exports: [AdminsService]
})
export class AdminsModule
{
}
