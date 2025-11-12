import { Order } from '@/domain/order/order.entity';
import { Gender } from '@/domain/user/enums/gender.enum';
import { User } from '@/domain/user/user.entity';
import { OrderDTO } from '@/presentation/common/order/dtos/order.dto';
import { AddressDTO } from '@/presentation/common/users/dtos';

export class CustomerDTO {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  gender: Gender;
  birthDate: Date;
  addresses: AddressDTO[];
  recentOrders: OrderDTO[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;

  constructor(user: User, recentOrders: Order[]) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.cpf = user.cpf;
    this.phone = user.phone;
    this.gender = user.gender;
    this.birthDate = user.birthDate;
    this.addresses = user.customerDetails.addresses.map(
      (address) => new AddressDTO(address),
    );
    this.recentOrders = recentOrders.map((order) => new OrderDTO(order));
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.active = user.active;
  }
}
