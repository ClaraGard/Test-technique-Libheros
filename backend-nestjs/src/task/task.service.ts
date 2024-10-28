import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { TaskList } from 'src/entities/tasklist.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

export interface TaskResponse {
  success: boolean;
  task?: Task;
  message?: string;
}

export interface TasksResponse {
  success: boolean;
  tasks?: Task[];
  message?: string;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskList)
    private taskListRepository: Repository<TaskList>,
  ) {}

  async findAllForTaskList(taskListId: number, userId: number): Promise<TasksResponse> {
    try {
      const taskList = await this.taskListRepository.findOne({
        where: { id: taskListId, user: { id: userId } },
      });

      if (!taskList) {
        return { success: false, message: 'Unauthorized request.' };
      }

      const tasks = await this.tasksRepository.find({
        where: { taskList: { id: taskListId } },
      });

      return { success: true, tasks };
    } catch (error) {
      return { success: false, message: 'Error retrieving tasks.' };
    }
  }

  async findOneForUser(taskId: number, userId: number): Promise<TaskResponse> {
    try {
      const task = await this.tasksRepository.findOne({
        where: { id: taskId },
        relations: ['taskList', 'taskList.user'],
      });

      if (!task || task.taskList.user.id !== userId) {
        return { success: false, message: 'Unauthorized request.' };
      }

      return { success: true, task };
    } catch (error) {
      return { success: false, message: 'Error retrieving task.' };
    }
  }

  async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<TaskResponse> {
    try {
      const taskList = await this.taskListRepository.findOne({
        where: { id: createTaskDto.taskListId, user: { id: userId } },
      });

      if (!taskList) {
        return { success: false, message: 'TaskList could not be found or created.' };
      }

      const newTask = this.tasksRepository.create({ ...createTaskDto, taskList });
      const savedTask = await this.tasksRepository.save(newTask);
      
      return { success: true, task: savedTask };
    } catch (error) {
      return { success: false, message: 'Error creating task.' };
    }
  }

  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<TaskResponse> {
    try {
      const taskResponse = await this.findOneForUser(taskId, userId);

      if (!taskResponse.success) {
        return { success: false, message: 'Unauthorized request or task not found.' };
      }

      const updatedTask = Object.assign(taskResponse.task, updateTaskDto);
      const savedTask = await this.tasksRepository.save(updatedTask);

      return { success: true, task: savedTask };
    } catch (error) {
      return { success: false, message: 'Error updating task.' };
    }
  }

  async deleteTask(taskId: number, userId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const taskResponse = await this.findOneForUser(taskId, userId);

      if (!taskResponse.success) {
        return { success: false, message: 'Unauthorized request or task not found.' };
      }

      await this.tasksRepository.remove(taskResponse.task);
      return { success: true, message: 'Task successfully deleted.' };
    } catch (error) {
      return { success: false, message: 'Error deleting task.' };
    }
  }
}
