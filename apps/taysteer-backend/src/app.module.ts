import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionOptions } from './ormconfig';
import { UserModule } from './resources/users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(connectionOptions), UserModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { };