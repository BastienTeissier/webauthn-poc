import { IsString } from 'class-validator';

export default class CreateUserDto {
  @IsString() readonly email!: string;
}
