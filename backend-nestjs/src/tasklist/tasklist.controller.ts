import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TaskListService } from './tasklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskListDto } from './tasklist.dto';

@Controller('tasklist')
@UseGuards(JwtAuthGuard)
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Get()
  async getUserTaskLists(@Req() req) {
    return this.taskListService.getTaskListsForUser(req.user.id);
  }

  @Get(':id')
  async getTaskListById(@Param('id') id: number, @Req() req) {
    return this.taskListService.getTaskListById(id, req.user.id);
  }

  @Post()
  async createTaskList(@Body() createTaskListDto: CreateTaskListDto, @Req() req) {
    return this.taskListService.createTaskList(createTaskListDto, req.user.id);
  }

  @Delete(':id')
  async deleteTaskList(@Param('id') taskListId: number, @Req() req) {
    return this.taskListService.deleteTaskList(taskListId, req.user.id);
  }
}
