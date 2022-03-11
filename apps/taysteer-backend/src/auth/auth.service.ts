import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepository } from 'typeorm';
import { User } from '../resources/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) { };

  async validateUser(login: string, password: string): Promise<any> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ login }); // Find user by login
    return user && await bcrypt.compare(password, user.password); // Check password
  };

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return await this.validateUser(user.login, user.password) ? this.jwtService.sign(payload) : false; // Validate user and return token if validated
  };
};