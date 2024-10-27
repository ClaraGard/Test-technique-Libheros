import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Get(':taskListId')
  getTasks(@Param('taskListId') taskListId: string) {
    return this.tasksService.getTasksForList(taskListId);
  }

  @Post(':taskListId')
  createTask(@Param('taskListId') taskListId: string, @Body() createTaskDto) {
    return this.tasksService.createTask(taskListId, createTaskDto);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
