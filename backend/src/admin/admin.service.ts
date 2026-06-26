import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { UserRole } from '../common/enums/user-role.enum';
import { ListQueryDto } from '../common/dto/list-query.dto';
import { CreateStoreDto, CreateUserDto } from '../auth/dto/auth.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly ratingsService: RatingsService,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.usersService.countUsers(),
      this.storesService.countStores(),
      this.ratingsService.countRatings(),
    ]);

    return { totalUsers, totalStores, totalRatings };
  }

  async listUsers(query: ListQueryDto) {
    const roles = query.role
      ? [query.role as UserRole]
      : [UserRole.NORMAL_USER, UserRole.SYSTEM_ADMIN];

    const users = await this.usersService.findUsersWithFilters(query, roles);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    }));
  }

  async getUserDetails(id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result: Record<string, unknown> = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    if (user.role === UserRole.STORE_OWNER && user.ownedStore) {
      const averageRating = await this.ratingsService.getStoreAverageRating(
        user.ownedStore.id,
      );
      result.storeRating = averageRating;
      result.storeName = user.ownedStore.name;
    }

    return result;
  }

  async createUser(dto: CreateUserDto) {
    if (
      dto.role !== UserRole.NORMAL_USER &&
      dto.role !== UserRole.SYSTEM_ADMIN &&
      dto.role !== UserRole.STORE_OWNER
    ) {
      throw new BadRequestException('Invalid role for user creation');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create(dto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
  }

  async listStores(query: ListQueryDto) {
    return this.storesService.findStoresWithFilters(query);
  }

  async createStore(dto: CreateStoreDto) {
    let ownerId = dto.ownerId;

    if (dto.owner) {
      const owner = await this.createUser({
        ...dto.owner,
        role: UserRole.STORE_OWNER,
      });
      ownerId = owner.id as string;
    }

    const store = await this.storesService.create({
      name: dto.name,
      email: dto.email,
      address: dto.address,
      ownerId,
    });

    if (ownerId) {
      await this.storesService.assignOwner(store.id, ownerId);
    }

    const averageRating = await this.ratingsService.getStoreAverageRating(
      store.id,
    );

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating,
    };
  }
}
