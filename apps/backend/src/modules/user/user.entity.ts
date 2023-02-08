import BaseEntity from '@helpers/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Authenticator } from './authenticator.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 100, select: false, nullable: true })
  password!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 100, nullable: true })
  currentChallenge!: string;

  @Column({ type: 'varchar', array: true })
  roles!: string[];

  @OneToMany('Authenticator', 'user')
  authenticators!: Authenticator[];
}
