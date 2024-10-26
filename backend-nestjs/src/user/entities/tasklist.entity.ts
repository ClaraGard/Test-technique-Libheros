import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity()
export class TaskList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Index()
  @ManyToOne(() => User, user => user.taskLists, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Task, task => task.taskList)
  tasks: Task[];
}
