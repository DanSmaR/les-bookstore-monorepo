import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DecimalColumn } from '../decorators/decimal-column.decorator';
import { DomainEntity } from '../domain.entity';
import { InvalidInitializationException } from '../exceptions/invalid-initialization.exception';
import { User } from '../user/user.entity';
import { TicketNature } from './enums/ticket-nature.enum';
import { TicketStatus } from './enums/ticket-status.enum';
import { TicketType } from './enums/ticket-type.enum';

@Entity('tb_tickets')
export class Ticket extends DomainEntity {
  @Column()
  code: string;

  @DecimalColumn()
  value: number;

  @Column({
    type: 'enum',
    enum: TicketType,
  })
  type: TicketType;

  @Column({
    type: 'enum',
    enum: TicketNature,
  })
  nature: TicketNature;

  @Column({ nullable: true })
  validUntil?: Date;

  @Column({ nullable: true })
  description?: string;

  @DecimalColumn({ nullable: true })
  maxDiscount?: number;

  // Para cupons de troca: ligado a um pedido/troca específico
  @Column({ nullable: true })
  originOrderId?: string;

  // Dono do cupom (obrigatório para cupons de troca, opcional para promocionais)
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({ nullable: true, name: 'owner_id' })
  ownerId?: string;

  // Status do cupom
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status: TicketStatus;

  constructor(props: {
    code: string;
    value: number;
    type: TicketType;
    nature: TicketNature;
    validUntil?: Date;
    description?: string;
    maxDiscount?: number;
    originOrderId?: string;
    ownerId?: string;
    status?: TicketStatus;
  }) {
    super();
    if (props) {
      this.code = props.code;
      this.value = this.validateValue(props.value, props.type);
      this.type = props.type;
      this.nature = props.nature;
      this.validUntil = props.validUntil;
      this.description = props.description;
      this.maxDiscount = props.maxDiscount;
      this.originOrderId = props.originOrderId;
      this.ownerId = props.ownerId;
      this.status = props.status || TicketStatus.ACTIVE;
    }
  }

  private validateValue(value: number, type: TicketType): number {
    switch (type) {
      case TicketType.PERCENTAGE:
        if (value < 0 || value > 100) {
          throw new InvalidInitializationException(
            'Percentage ticket value must be between 0 and 100',
          );
        }
        break;
      case TicketType.RAW:
        if (value < 0) {
          throw new InvalidInitializationException(
            'Raw ticket value must be greater than or equal to 0',
          );
        }
        break;
      default:
        throw new InvalidInitializationException('Invalid ticket type');
    }
    return value;
  }

  public applyTicket(value: number): number {
    let discount: number;
    switch (this.type) {
      case TicketType.PERCENTAGE:
        discount = (value * this.value) / 100;
        break;
      case TicketType.RAW: {
        // Cupom de troca usa o valor integral (uso único)
        discount = this.value;
        break;
      }
    }
    return this.maxDiscount ? Math.min(discount, this.maxDiscount) : discount;
  }

  public isValid(): boolean {
    // Validar expiração
    if (this.validUntil && this.validUntil < new Date()) {
      return false;
    }

    // Validar status - cupom deve estar ativo
    if (
      this.status === TicketStatus.USED ||
      this.status === TicketStatus.EXPIRED
    ) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se o cupom pode ser usado por um usuário específico
   */
  public canBeUsedBy(userId: string): boolean {
    // Cupons promocionais (sem dono) podem ser usados por qualquer um
    if (this.nature === TicketNature.PROMOTIONAL && !this.ownerId) {
      return true;
    }

    // Cupons de troca só podem ser usados pelo dono
    if (this.nature === TicketNature.EXCHANGE) {
      return this.ownerId === userId;
    }

    // Cupons promocionais com dono específico
    return this.ownerId === userId;
  }

  /**
   * Verifica se é um cupom pessoal (tem dono)
   */
  public isPersonal(): boolean {
    return !!this.ownerId;
  }
}
