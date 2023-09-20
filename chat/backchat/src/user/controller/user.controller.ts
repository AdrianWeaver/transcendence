import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../service/user-service/user.service';
import { of, Observable, switchMap } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserI } from '../model/user.interface';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService, //no readonly
        private userHelperService: UserHelperService
    ){}

    @Post()
    create(@Body() createUserDto: CreateUserDto ): Promise<UserI> {
        const user: UserI = this.userHelperService.createUserDtoToEntity(createUserDto)
        return this.userService.create(user)
    }

    @Get()
    findAll() {

    }

    @Post()
    login() {
        
    }

}
