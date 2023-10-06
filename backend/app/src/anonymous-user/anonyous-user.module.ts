import { Module } from "@nestjs/common";
import { AnonymousUserService } from "./anonymous-user.service";
import { AnonymousUserController } from "./anonymous-user.controller";


@Module({
	providers: [AnonymousUserService],
	exports: [AnonymousUserService]
})
export class AnonymousUserModule
{
}
