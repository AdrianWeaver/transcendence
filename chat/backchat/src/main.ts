import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { disconnect } from 'process';
// import { ValidationPipe } from './user/validation-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const http = require('http').Server(app);
  // const cors = require('cors');

  // app.use(cors());
  // const socketIO = require('socket.io')(http, {
  //   cors: {
  //     origin: "http://localhost:3000"
  //   }
  // })
  // socketIO.on('connection', (socket) => {
  //   console.log(`${socket.id} user just connected`);
  //   socket.on('disconnected', () => {
  //     console.log('A user disconnected');
  //   })
  // })
  app.setGlobalPrefix('backchat')
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
