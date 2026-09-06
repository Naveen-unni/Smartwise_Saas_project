// project-member.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { Membership } from './membership.entity';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @Column({ name: 'project_id' })
  projectId!: string;

  @ManyToOne(() => Membership, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'membership_id' })
  membership!: Membership;

  @Column({ name: 'membership_id' })
  membershipId!: string;

  @Column({ default: 'member' })
  role!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}