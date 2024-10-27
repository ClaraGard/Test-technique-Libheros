import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      return { success: false, message: 'Email already in use' }; 
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const token = this.generateToken(newUser);
    newUser.token = token.access_token;
    await this.usersService.updateToken(newUser.id, token.access_token);
    return { success: true, token: token.access_token }; 
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
      return { success: false,  message: 'Incorrect credentials' };
    }
    const token = this.generateToken(user);
    user.token = token.access_token;
    await this.usersService.updateToken(user.id, token.access_token);
    return { success: true, token: token.access_token }; 
  }

  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '24h',
      }),    
    };
  }
}
