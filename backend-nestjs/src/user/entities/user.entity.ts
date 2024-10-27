import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TaskList } from './tasklist.entity';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  name: string; 

  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: 'text', nullable: true })
  token: string;

  @OneToMany(() => TaskList, taskList => taskList.user)
  taskLists: TaskList[];
}
