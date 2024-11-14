import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor(){
    console.log("variable entorno: ", process.env.MONGO_URI);
  }
}
