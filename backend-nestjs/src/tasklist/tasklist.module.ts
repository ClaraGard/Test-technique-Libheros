import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskListController } from './tasklist.controller';
import { TaskListService } from './tasklist.service';
import { TaskList } from '../entities/tasklist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [TaskListController],
  providers: [TaskListService],
  exports: [TaskListService], // Ensure it's exported if used in other modules
})
export class TasklistModule {}
