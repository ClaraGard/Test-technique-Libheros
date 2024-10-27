import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TasklistService } from './tasklist.service';

@Controller('tasklists')
export class TasklistController {
  constructor(private readonly tasklistsService: TasklistService) {}

  @Get()
  getAllTaskLists() {
    return this.tasklistsService.getAllTaskLists();
  }

  @Post()
  createTaskList(@Body() createTaskListDto) {
    return this.tasklistsService.createTaskList(createTaskListDto);
  }

  @Delete(':id')
  deleteTaskList(@Param('id') id: string) {
    return this.tasklistsService.deleteTaskList(id);
  }
}
