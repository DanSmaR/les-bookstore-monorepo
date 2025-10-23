import { AddressPurpose } from '@domain/user/enums/address-purpose.enum';
import { AddressType } from '@domain/user/enums/address-type.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DomainEntity } from '../domain.entity';
import { CustomerDetails } from './customer-details.entity';

@Entity('tb_addresses')
export class Address extends DomainEntity {
  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @Column({ type: 'enum', enum: AddressPurpose })
  purpose: AddressPurpose;

  @Column()
  addressName: string;

  @Column()
  postalCode: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @ManyToOne(
    () => CustomerDetails,
    (customerDetails) => customerDetails.addresses,
  )
  @JoinColumn()
  customerDetails: CustomerDetails;

  constructor(props: {
    type: AddressType;
    purpose: AddressPurpose;
    addressName: string;
    postalCode: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  }) {
    super();
    if (props) {
      this.type = props.type;
      this.purpose = props.purpose;
      this.addressName = props.addressName;
      this.postalCode = props.postalCode;
      this.street = props.street;
      this.number = props.number;
      this.complement = props.complement;
      this.district = props.district;
      this.city = props.city;
      this.state = props.state;
    }
  }

  public override equals(other: Address): boolean {
    if (!(other instanceof Address)) return false;
    return (
      this.type === other.type &&
      this.addressName === other.addressName &&
      this.postalCode === other.postalCode &&
      this.street === other.street &&
      this.number === other.number &&
      this.complement === other.complement &&
      this.district === other.district &&
      this.city === other.city &&
      this.state === other.state
    );
  }

  public update(props: {
    type: AddressType;
    purpose: AddressPurpose;
    addressName: string;
    postalCode: string;
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
  }) {
    this.type = props.type;
    this.purpose = props.purpose;
    this.addressName = props.addressName;
    this.postalCode = props.postalCode;
    this.street = props.street;
    this.number = props.number;
    this.complement = props.complement;
    this.district = props.district;
    this.city = props.city;
    this.state = props.state;
  }
}
