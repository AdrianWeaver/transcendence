import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserService } from './service/user-service/user.service';
import { UserHelperService } from './service/user-helper/user-helper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService]
})

export class UserModule {}
