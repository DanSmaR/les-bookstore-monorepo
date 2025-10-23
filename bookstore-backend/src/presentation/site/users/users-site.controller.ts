import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '@presentation/auth/interfaces/authenticated-request.interface';
import { AddressDTO, UserDTO } from '@presentation/common/users/dtos';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { CardDTO } from '@/presentation/common/users/dtos/card.dto';

import { CreateCardDTO } from './dtos';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { CreateAddressDTO } from './dtos/create-address.dto';
import { UpdateAddressDTO } from './dtos/update-address.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersSiteWebService } from './users-site.webservice';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('me')
export class UsersSiteController {
  constructor(private readonly usersWebService: UsersSiteWebService) {}

  @Get()
  public async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserDTO> {
    return await this.usersWebService.getProfile(req.user.userId);
  }

  @Put('password')
  public async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDTO,
  ): Promise<void> {
    await this.usersWebService.changePassword(req.user.userId, body);
  }

  @Put()
  public async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateUserDTO,
  ): Promise<UserDTO> {
    return await this.usersWebService.updateProfile(req.user.userId, body);
  }

  @Delete()
  public async deactivateAccount(
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.usersWebService.deactivateAccount(req.user.userId);
  }

  // Address management endpoints
  @Get('addresses')
  public async getAddresses(
    @Request() req: AuthenticatedRequest,
  ): Promise<AddressDTO[]> {
    return await this.usersWebService.getAddresses(req.user.userId);
  }

  @Post('addresses')
  public async createAddress(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateAddressDTO,
  ): Promise<AddressDTO> {
    return await this.usersWebService.createAddress(req.user.userId, body);
  }

  @Put('addresses/:addressId')
  public async updateAddress(
    @Request() req: AuthenticatedRequest,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDTO,
  ): Promise<AddressDTO> {
    return await this.usersWebService.updateAddress(
      req.user.userId,
      addressId,
      body,
    );
  }

  @Delete('addresses/:addressId')
  public async deleteAddress(
    @Request() req: AuthenticatedRequest,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    await this.usersWebService.deleteAddress(req.user.userId, addressId);
  }

  @Get('cards')
  public async getCards(
    @Request() req: AuthenticatedRequest,
  ): Promise<CardDTO[]> {
    return await this.usersWebService.getCards(req.user.userId);
  }

  @Post('cards')
  public async addCard(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateCardDTO,
  ): Promise<CardDTO> {
    return await this.usersWebService.addCard(req.user.userId, body);
  }

  @Delete('cards/:cardId')
  public async removeCard(
    @Request() req: AuthenticatedRequest,
    @Param('cardId') cardId: string,
  ): Promise<void> {
    await this.usersWebService.removeCard(req.user.userId, cardId);
  }
}
