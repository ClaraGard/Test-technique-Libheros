import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskList } from '../entities/tasklist.entity';
import { CreateTaskListDto } from './tasklist.dto';

export interface TaskListResponse {
  success: boolean;
  taskList?: TaskList;
  message?: string;
}

export interface TaskListsResponse {
  success: boolean;
  taskLists?: TaskList[];
  message?: string;
}

@Injectable()
export class TaskListService {
  constructor(
    @InjectRepository(TaskList)
    private readonly taskListRepository: Repository<TaskList>,
  ) {}

  async getTaskListsForUser(userId: number): Promise<TaskListsResponse> {
    try {
      const taskLists = await this.taskListRepository.find({ where: { user: { id: userId } } });
      return { success: true, taskLists };
    } catch (error) {
      return { success: false, message: 'Error retrieving task lists.' };
    }
  }

  async getTaskListById(id: number, userId: number): Promise<TaskListResponse> {
    try {
      const taskList = await this.taskListRepository.findOne({ where: { id }, relations: ['user'] });
      if (!taskList || taskList.user.id !== userId) {
        return { success: false, message: 'Task list not found or access denied.' };
      }
      return { success: true, taskList };
    } catch (error) {
      return { success: false, message: 'Error retrieving task list.' };
    }
  }

  async createTaskList(createTaskListDto: CreateTaskListDto, userId: number): Promise<TaskListResponse> {
    const existingTaskList = await this.taskListRepository.findOne({
      where: {
        user: { id: userId },
        name: createTaskListDto.name,
      },
    });
    if (existingTaskList) {
      return { success: false, message: "A task list with the same name already exists." };
    }
    try {
      const taskList = this.taskListRepository.create({ ...createTaskListDto, user: { id: userId } });
      const savedTaskList = await this.taskListRepository.save(taskList);
      return { success: true, taskList: savedTaskList };
    } catch (error) {
      return { success: false, message: 'Error creating task list.' };
    }
  }

  async deleteTaskList(taskListId: number, userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const taskList = await this.getTaskListById(taskListId, userId);
      if (!taskList.success || !taskList.taskList) {
        return { success: false, message: 'Task list not found or access denied.' };
      }
      await this.taskListRepository.remove(taskList.taskList);
      return { success: true, message: 'Task list deleted successfully.' };
    } catch (error) {
      return { success: false, message: 'Error deleting task list.' };
    }
  }
}
