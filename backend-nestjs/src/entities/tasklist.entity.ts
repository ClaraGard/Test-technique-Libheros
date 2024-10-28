import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index, Unique } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
@Unique(['user', 'name'])
export class TaskList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @ManyToOne(() => User, user => user.taskLists, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Task, task => task.taskList)
  tasks: Task[];
}
