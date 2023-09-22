import { HttpException, Injectable, HttpStatus, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { UserEntity } from 'src/user/model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { IsNumberString } from 'class-validator';
import { promises } from 'fs';


@Injectable()
export class UserService {

    constructor (
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async create(newUser: UserI): Promise<UserI> {
        if (await this.emailExists(newUser.email) === false) {
            console.log("hey")
            return this.userRepository.save(newUser)
        } else {
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }
    }

    private findOne(id: number): Observable<UserI> {
        return from(this.userRepository.findOneBy({id}))
    }

    private async emailExists(email: string): Promise<boolean> {
        const user: UserI = await this.userRepository.findOneBy({email})
        if (user) {
            return true;
        } else {
            return false;
        }
    }
}