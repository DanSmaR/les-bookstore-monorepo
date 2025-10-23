import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class DomainEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  public inactivate(): void {
    if (!this.active) {
      throw new Error('Entity is already inactive');
    }
    this.active = false;
  }

  public activate(): void {
    this.active = true;
  }

  public equals(other: DomainEntity): boolean {
    return this.id === other.id;
  }
}
