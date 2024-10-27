import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // Optional: ensure the password has a minimum length
  password: string;

  @IsString()
  name: string; // Add other fields as required
}
