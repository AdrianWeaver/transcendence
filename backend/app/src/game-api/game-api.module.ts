import { Module } from "@nestjs/common";
import { GameService } from "src/game-socket/Game.service";
import { GameApiService } from "./game-api.service";
import { GameSocketModule } from "src/game-socket/game-socket.module";

@Module({
    imports: [GameSocketModule],
    providers: [GameApiService]
})
export class GameApiModule
{}
