/* eslint-disable max-classes-per-file */
import { Body, Controller, Get, Logger, Param, UseGuards } from "@nestjs/common";
import { GameApiService } from "./game-api.service";
import { UserService } from "src/user/user.service";
import { UserAuthorizationGuard } from "../user/user.authorizationGuard";
import { IsNotEmpty, IsNumberString} from "class-validator";

class InviteDto
{
    @IsNotEmpty()
    friend: string;
}

@Controller("api/game")
export class GameApiController
{
    private readonly logger = new Logger("api-game-controller");

    public constructor(
        private readonly gameApiService: GameApiService,
        private readonly userService: UserService
    )
    {
        this.logger.error("instanciate controller for the Game api"
            + "id: " + this.gameApiService.getInstanceId());
        this.logger.verbose("Using the userService with id : "
            + this.userService.getUuidInstance());
    }

    @Get("/")
    getRoot()
    {
        return ({
            message: "the service is available but will be implemented asap"
        });
    }

    // debug
    @Get("/user-service")
    getDataFromUserService()
    {
        return (this.userService.getAllUserRaw());
    }

    // debug
    @Get("/instance/service/game")
    getGameServiceCopy()
    {
        return (this.gameApiService.getGameServiceCopy());
    }

    @Get("/invite/friends")
    // @UseGuards(UserAuthorizationGuard)
    inviteFriend(@Param("invited") friend: string)
    {

        console.log(friend);
        return ("hello");
    }
}
