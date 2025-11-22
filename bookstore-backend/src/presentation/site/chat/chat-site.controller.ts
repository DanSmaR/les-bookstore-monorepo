import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from '@/domain/user/enums/role.enum';
import { Roles } from '@/infrastructure/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/infrastructure/auth/guards';
import { AuthenticatedRequest } from '@/presentation/auth/interfaces';

import { ChatSiteWebService } from './chat-site.webservice';
import { ChatConversationDTO } from './dtos/chat-conversation.dto';
import { ChatMessageResponseDTO } from './dtos/chat-message-response.dto';
import { SendMessageDTO } from './dtos/send-message.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('chat')
export class ChatSiteController {
  constructor(private readonly webService: ChatSiteWebService) {}

  @Get()
  public async getConversation(
    @Request() req: AuthenticatedRequest,
  ): Promise<ChatConversationDTO> {
    return this.webService.getConversation(req.user.userId);
  }

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  public async sendMessage(
    @Request() req: AuthenticatedRequest,
    @Body() dto: SendMessageDTO,
  ): Promise<ChatMessageResponseDTO> {
    return this.webService.sendMessage(req.user.userId, dto.message);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resetConversation(
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.webService.resetConversation(req.user.userId);
  }
}
