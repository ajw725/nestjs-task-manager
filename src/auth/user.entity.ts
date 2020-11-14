import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { hash } from 'bcrypt';

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

  async validatePassword(testPassword: string): Promise<boolean> {
    const newHash = await hash(testPassword, this.salt);
    return newHash === this.password;
  }
}
