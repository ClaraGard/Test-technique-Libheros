import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { TaskList } from 'src/entities/tasklist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
  ) {}

  async findAllForTaskList(taskListId: number, userId: number): Promise<Task[]> {
    const taskList = await this.taskListRepository.findOne({
      where: { id: taskListId, user: { id: userId } },
    });

    if (!taskList) {
      throw new UnauthorizedException('You do not have access to this task list.');
    }

    return this.tasksRepository.find({
      where: { taskList: { id: taskListId } },
    });
  }

  async findOneForUser(taskId: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['taskList'],
    });

    if (!task || task.taskList.user.id !== userId) {
      throw new UnauthorizedException('You do not have access to this task.');
    }

    return task;
  }
}
