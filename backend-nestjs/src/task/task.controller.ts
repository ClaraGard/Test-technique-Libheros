import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Task } from 'src/entities/task.entity';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasklist/:taskListId')
  async findTasksByTaskList(@Param('taskListId') taskListId: string, @Req() req): Promise<Task[]> {
    const userId = req.user.userId; 
    return this.taskService.findAllForTaskList(+taskListId, userId);
  }

  @Get(':taskId')
  async findOne(@Param('taskId') taskId: string, @Req() req): Promise<Task> {
    const userId = req.user.userId;
    return this.taskService.findOneForUser(+taskId, userId);
  }
}
