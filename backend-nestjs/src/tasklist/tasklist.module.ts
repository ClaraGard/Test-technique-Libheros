import { Module } from '@nestjs/common';
import { TaskListController } from './tasklist.controller';
import { TaskListService } from './tasklist.service';

@Module({
  controllers: [TaskListController],
  providers: [TaskListService],
})
export class TasklistModule {}
