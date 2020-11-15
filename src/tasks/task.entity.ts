import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  JoinColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // can't find any other way to have the user id included in the query response
  @Column()
  user_id: number;
}
