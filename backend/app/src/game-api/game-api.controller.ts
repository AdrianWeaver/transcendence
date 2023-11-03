import { Controller, Get, Logger } from "@nestjs/common";
import { GameApiService } from "./game-api.service";

@Controller("api/game")
export class GameApiController
{
    private readonly logger = new Logger("api-game-controller");

    public constructor(
        private readonly gameApiService: GameApiService
    )
    {
        this.logger.error("instanciate controller for the Game api"
            + "id: " + this.gameApiService.getInstanceId());
    }

    @Get("/")
    getRoot()
    {
        return ("hello");
    }
}
