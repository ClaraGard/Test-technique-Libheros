import { Injectable } from '@nestjs/common';

@Injectable()
export class TasklistService {
  private taskLists = [];

  getAllTaskLists() {
    return this.taskLists;
  }

  createTaskList(createTaskListDto) {
    const newTaskList = { id: Date.now(), ...createTaskListDto };
    this.taskLists.push(newTaskList);
    return newTaskList;
  }

  deleteTaskList(id: string) {
    this.taskLists = this.taskLists.filter((taskList) => taskList.id !== +id);
    return { deleted: true };
  }
}
