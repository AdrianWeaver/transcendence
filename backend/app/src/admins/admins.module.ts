import { Module } from "@nestjs/common";
import { AdminsService } from "./admins.service";
import { AdminsController } from "./admins.controller";
import { AnonymousUserModule } from "../anonymous-user/anonyous-user.module";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
	imports: [
		AnonymousUserModule,
		UserModule,
		PrismaModule,
	],
	providers: [AdminsService],
	controllers: [AdminsController],
	exports: [AdminsService]
})
export class AdminsModule
{
}
