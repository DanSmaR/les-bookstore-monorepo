import { User } from '@domain/user/user.entity';

import { MinAddressDTO } from './min-address.dto';

export class MinUserDTO {
  id: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  ranking: number;
  phoneNumber: string;
  address: MinAddressDTO;
  lastOrder?: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    // TODO modify user status
    this.status = user.active ? 'Ativo' : 'Inativo';
    this.ranking = 5;
    this.phoneNumber = user.phone;
    // TODO refatorar addressess para logica de main address
    this.address = new MinAddressDTO(user.customerDetails.addresses[0]);
    
    // Handle case when user has no orders
    const mostRecentOrder = user.customerDetails.getMostRecentOrder();
    this.lastOrder = mostRecentOrder?.orderDate;
  }
}
