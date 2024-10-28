import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskList } from 'src/entities/tasklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskList]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], 
})
export class TaskModule {}
