import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { TaskList } from './tasklist.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shortDescription: string;

  @Column({type: "text"})
  longDescription: string;

  @Column({default: false})
  isCompleted: boolean

  @Column({type:"date"})
  dueDate: Date

  @CreateDateColumn()
  creationDate: Date

  @Index()
  @ManyToOne(() => TaskList, tasklist => tasklist.tasks, { onDelete: 'CASCADE' })
  taskList: TaskList;
}
