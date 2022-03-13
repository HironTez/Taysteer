import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepository } from 'typeorm';
import { User } from '../resources/users/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(login: string, password: string): Promise<any> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ login }); // Find user by login
    const verified = user && (await bcrypt.compare(password, user.password)); // Check password

    if (verified) {
      return User.toResponseMin(user);
    } else return null;
  }

  async login(user: any) {
    const verified = await this.validateUser(user.login, user.password); // Validate user
    const payload = { login: user.login, sub: verified?.id };
    return verified
      ? this.jwtService.sign(payload) // Return token if validated
      : false;
  }
}
