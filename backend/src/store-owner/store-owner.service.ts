import { Injectable, NotFoundException } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';

@Injectable()
export class StoreOwnerService {
  constructor(
    private readonly storesService: StoresService,
    private readonly ratingsService: RatingsService,
  ) {}

  async getDashboard(ownerId: string) {
    const store = await this.storesService.findByOwnerId(ownerId);
    if (!store) {
      throw new NotFoundException('No store assigned to this owner');
    }

    const averageRating = await this.ratingsService.getStoreAverageRating(
      store.id,
    );
    const ratings = await this.ratingsService.getRatingsForStore(store.id);

    return {
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
      },
      raters: ratings.map((r) => ({
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
        rating: r.rating,
        submittedAt: r.createdAt,
      })),
    };
  }
}
