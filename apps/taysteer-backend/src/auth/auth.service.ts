import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../resources/users/user.model';
import { UserMinT } from '../resources/users/user.types';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDataDto } from '../typification/dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async validateUser(login: string, password: string): Promise<UserMinT | null> {
    const user = await this.userRepository.findOne({ login }); // Find user by login
    const verified = user && (await bcrypt.compare(password, user.password)); // Check password

    if (verified) {
      return User.toResponseMin(user);
    } else return null;
  }

  async login(user: LoginDataDto) {
    const verified = await this.validateUser(user.login, user.password); // Validate user
    return Boolean(verified);
  }
}
