import { Module } from "@nestjs/common";
import { AnonymousUserService } from "./anonymous-user.service";
import { AnonymousUserController } from "./anonymous-user.controller";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
	imports: [PrismaModule],
	providers: [AnonymousUserService],
	exports: [AnonymousUserService]
})
export class AnonymousUserModule
{
}
