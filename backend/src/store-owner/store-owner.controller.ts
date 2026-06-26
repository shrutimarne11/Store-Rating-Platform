import { Controller, Get, UseGuards } from '@nestjs/common';
import { StoreOwnerService } from './store-owner.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('store-owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STORE_OWNER)
export class StoreOwnerController {
  constructor(private readonly storeOwnerService: StoreOwnerService) {}

  @Get('dashboard')
  getDashboard(@CurrentUser() user: User) {
    return this.storeOwnerService.getDashboard(user.id);
  }
}
