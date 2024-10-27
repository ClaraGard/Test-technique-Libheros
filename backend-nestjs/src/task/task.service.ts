import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private tasks = [];

  getTasksForList(taskListId: string) {
    return this.tasks.filter((task) => task.taskListId === taskListId);
  }

  createTask(taskListId: string, createTaskDto) {
    const newTask = { id: Date.now(), taskListId, ...createTaskDto };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updateTaskDto) {
    const taskIndex = this.tasks.findIndex((task) => task.id === +id);
    if (taskIndex > -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updateTaskDto };
      return this.tasks[taskIndex];
    }
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== +id);
    return { deleted: true };
  }
}
