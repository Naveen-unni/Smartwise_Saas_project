

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Tenant } from './tentant.entity';
import { User } from '../../auth/entities/user.entity';

export enum MembershipRole {
  OWNER='owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('memberships')
@Unique(['userId', 'tenantId'])
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId!: string;

  @Column({
    type: 'text',
    
    default: MembershipRole.MEMBER,
  })
  role!: MembershipRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;
}