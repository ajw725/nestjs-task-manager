import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async validatePassword(testPassword: string): Promise<boolean> {
    const newHash = await hash(testPassword, this.salt);
    return newHash === this.password;
  }
}
