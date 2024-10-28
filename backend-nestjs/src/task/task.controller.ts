import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { TaskResponse, TasksResponse } from './task.service'; // Import the response interfaces

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('tasklist/:taskListId')
  async findTasksByTaskList(@Param('taskListId') taskListId: string, @Req() req): Promise<TasksResponse> {
    const userId = req.user.id;
    return this.taskService.findAllForTaskList(+taskListId, userId);
  }

  @Get(':taskId')
  async findOne(@Param('taskId') taskId: string, @Req() req): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.taskService.findOneForUser(+taskId, userId);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.taskService.createTask(createTaskDto, userId);
  }

  @Put(':taskId')
  async updateTask(@Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.taskService.updateTask(+taskId, updateTaskDto, userId);
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string, @Req() req): Promise<{ success: boolean; message?: string }> {
    const userId = req.user.id;
    return this.taskService.deleteTask(+taskId, userId);
  }
}
