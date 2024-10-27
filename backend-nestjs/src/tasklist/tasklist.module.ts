import { Module } from '@nestjs/common';
import { TasklistController } from './tasklist.controller';
import { TasklistService } from './tasklist.service';

@Module({
  controllers: [TasklistController],
  providers: [TasklistService],
})
export class TasklistModule {}
