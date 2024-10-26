import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { TaskList } from './tasklist.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shortDescription: string;

  @Column({type: "text"})
  longDescription: string;

  @Index()
  @ManyToOne(() => TaskList, tasklist => tasklist.tasks, { onDelete: 'CASCADE' })
  taskList: TaskList;
}
