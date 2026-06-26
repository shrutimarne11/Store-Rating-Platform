import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepository: Repository<Rating>,
  ) {}

  async upsertRating(
    userId: string,
    storeId: string,
    rating: number,
  ): Promise<Rating> {
    let existing = await this.ratingsRepository.findOne({
      where: { userId, storeId },
    });

    if (existing) {
      existing.rating = rating;
      return this.ratingsRepository.save(existing);
    }

    existing = this.ratingsRepository.create({ userId, storeId, rating });
    return this.ratingsRepository.save(existing);
  }

  async getUserRatingForStore(
    userId: string,
    storeId: string,
  ): Promise<number | null> {
    const rating = await this.ratingsRepository.findOne({
      where: { userId, storeId },
    });
    return rating?.rating ?? null;
  }

  async getStoreAverageRating(storeId: string): Promise<number | null> {
    const result = await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'avg')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne<{ avg: string | null }>();

    return result?.avg ? parseFloat(parseFloat(result.avg).toFixed(2)) : null;
  }

  async getRatingsForStore(storeId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async countRatings(): Promise<number> {
    return this.ratingsRepository.count();
  }

  async findById(id: string): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return rating;
  }
}
