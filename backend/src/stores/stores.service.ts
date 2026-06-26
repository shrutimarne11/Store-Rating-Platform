import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { ListQueryDto } from '../common/dto/list-query.dto';

export interface StoreWithRating {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number | null;
  ratingCount: number;
}

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
  ) {}

  async create(data: {
    name: string;
    email: string;
    address: string;
    ownerId?: string;
  }): Promise<Store> {
    const store = this.storesRepository.create(data);
    return this.storesRepository.save(store);
  }

  async findById(id: string): Promise<Store | null> {
    return this.storesRepository.findOne({
      where: { id },
      relations: { owner: true, ratings: { user: true } },
    });
  }

  async findByOwnerId(ownerId: string): Promise<Store | null> {
    return this.storesRepository.findOne({
      where: { ownerId },
      relations: { ratings: { user: true } },
    });
  }

  async assignOwner(storeId: string, ownerId: string): Promise<Store> {
    const store = await this.findById(storeId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    store.ownerId = ownerId;
    return this.storesRepository.save(store);
  }

  async findStoresWithFilters(query: ListQueryDto): Promise<StoreWithRating[]> {
    const qb = this.storesRepository
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'rating')
      .select([
        'store.id AS id',
        'store.name AS name',
        'store.email AS email',
        'store.address AS address',
        'AVG(rating.rating) AS "averageRating"',
        'COUNT(rating.id) AS "ratingCount"',
      ])
      .groupBy('store.id');

    if (query.name) {
      qb.andWhere('store.name ILIKE :name', { name: `%${query.name}%` });
    }
    if (query.email) {
      qb.andWhere('store.email ILIKE :email', { email: `%${query.email}%` });
    }
    if (query.address) {
      qb.andWhere('store.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }

    const sortBy = query.sortBy || 'name';
    const allowedSortFields = ['name', 'email', 'address'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder =
      query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`store.${sortField}`, sortOrder);

    const raw = await qb.getRawMany<{
      id: string;
      name: string;
      email: string;
      address: string;
      averageRating: string | null;
      ratingCount: string;
    }>();

    return raw.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      address: row.address,
      averageRating: row.averageRating
        ? parseFloat(parseFloat(row.averageRating).toFixed(2))
        : null,
      ratingCount: parseInt(row.ratingCount, 10) || 0,
    }));
  }

  async countStores(): Promise<number> {
    return this.storesRepository.count();
  }
}
