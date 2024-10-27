import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from '../entities/tasklist.entity';

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async getTaskListsForUser(userId: number): Promise<TaskList[]> {
    return this.taskListRepository.find({ where: { user: { id: userId } } });
  }

  async getTaskListById(id: number): Promise<TaskList> {
    const taskList = await this.taskListRepository.findOne({ where: { id }, relations: ['user'] });

    if (!taskList) {
      throw new NotFoundException('Task List not found');
    }
    return taskList;
  }
}
