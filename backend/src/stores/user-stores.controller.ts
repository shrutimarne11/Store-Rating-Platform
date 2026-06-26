import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { StoreSearchDto, SubmitRatingDto } from '../auth/dto/auth.dto';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.NORMAL_USER)
export class UserStoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly ratingsService: RatingsService,
  ) {}

  @Get()
  async listStores(@Query() query: StoreSearchDto, @CurrentUser() user: User) {
    const stores = await this.storesService.findStoresWithFilters(query);

    const storesWithUserRating = await Promise.all(
      stores.map(async (store) => {
        const userRating = await this.ratingsService.getUserRatingForStore(
          user.id,
          store.id,
        );
        return {
          ...store,
          userRating,
        };
      }),
    );

    return storesWithUserRating;
  }

  @Post(':id/ratings')
  submitRating(
    @Param('id') storeId: string,
    @Body() dto: SubmitRatingDto,
    @CurrentUser() user: User,
  ) {
    return this.ratingsService.upsertRating(user.id, storeId, dto.rating);
  }

  @Put(':id/ratings')
  updateRating(
    @Param('id') storeId: string,
    @Body() dto: SubmitRatingDto,
    @CurrentUser() user: User,
  ) {
    return this.ratingsService.upsertRating(user.id, storeId, dto.rating);
  }
}
