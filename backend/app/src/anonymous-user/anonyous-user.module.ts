import { Module } from "@nestjs/common";
import { AnonymousUserService } from "./anonymous-user.service";


@Module({
	providers: [AnonymousUserService],
	exports: [AnonymousUserService]
})
export class AnonymousUserModule
{
}
