import { Module } from "@nestjs/common";
import { GameService } from "src/game-socket/Game.service";
import { GameApiService } from "./game-api.service";
import { GameSocketModule } from "src/game-socket/game-socket.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [
        GameSocketModule,
        PrismaModule,
    ],
    providers: [GameApiService]
})
export class GameApiModule
{}
