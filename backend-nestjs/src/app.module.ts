import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { dataSourceOption } from 'db/data-source';
import { User } from './user/entities/user.entity';
import { TaskList } from './user/entities/tasklist.entity';
import { Task } from './user/entities/task.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOption),
    UserModule,
    TypeOrmModule.forFeature([User, TaskList, Task]),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
