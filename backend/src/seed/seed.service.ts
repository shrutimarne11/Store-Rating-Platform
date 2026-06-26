import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminName = this.configService.get<string>('ADMIN_NAME');

    if (!adminEmail || !adminPassword || !adminName) {
      return;
    }

    const existing = await this.usersService.findByEmail(adminEmail);
    if (existing) {
      this.logger.log('Admin user already exists');
      return;
    }

    await this.usersService.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      address: '123 Admin Headquarters, Platform City, PC 10001',
      role: UserRole.SYSTEM_ADMIN,
    });

    this.logger.log(`Default admin created: ${adminEmail}`);
  }
}
