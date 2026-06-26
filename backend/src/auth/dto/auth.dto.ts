import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';
import {
  IsStrongPassword,
  IsValidName,
} from '../../common/validators/custom-validators';
import { ListQueryDto } from '../../common/dto/list-query.dto';

export class RegisterDto {
  @IsValidName()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsStrongPassword()
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  currentPassword: string;

  @IsStrongPassword()
  newPassword: string;
}

export class CreateUserDto {
  @IsValidName()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateStoreDto {
  @IsValidName()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(400)
  address: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  owner?: CreateUserDto;
}

export class SubmitRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class StoreSearchDto extends ListQueryDto {}
