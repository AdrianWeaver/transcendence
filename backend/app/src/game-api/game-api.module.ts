import { Module } from "@nestjs/common";
import { GameService } from "src/game-socket/Game.service";
import { GameApiService } from "./game-api.service";

@Module({
    imports: [GameService],
    providers: [GameApiService]
})
export class GameApiModule
{}
