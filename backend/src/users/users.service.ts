import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { ListQueryDto } from '../common/dto/list-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { ownedStore: { ratings: true } },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  async findUsersWithFilters(
    query: ListQueryDto,
    roles?: UserRole[],
  ): Promise<User[]> {
    const qb = this.usersRepository.createQueryBuilder('user');

    if (roles?.length) {
      qb.andWhere('user.role IN (:...roles)', { roles });
    }

    if (query.name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${query.name}%` });
    }
    if (query.email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${query.email}%` });
    }
    if (query.address) {
      qb.andWhere('user.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }
    if (query.role) {
      qb.andWhere('user.role = :role', { role: query.role });
    }

    const sortBy = query.sortBy || 'name';
    const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortOrder =
      query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    qb.orderBy(`user.${sortField}`, sortOrder);
    return qb.getMany();
  }

  async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.usersRepository.count({ where: { role } });
  }
}
