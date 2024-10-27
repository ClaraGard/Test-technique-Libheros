import { Controller, Get, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { TaskListService } from './tasklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasklist')
@UseGuards(JwtAuthGuard)
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Get()
  async getUserTaskLists(@Req() req) {
    return this.taskListService.getTaskListsForUser(req.user.userId);
  }

  @Get(':id')
  async getTaskListById(@Param('id') id: number, @Req() req) {
    const taskList = await this.taskListService.getTaskListById(id);

    if (taskList && taskList.user.id === req.user.userId) {
      return taskList;
    } else {
      throw new NotFoundException('Task List not found or access denied');
    }
  }
}
