import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    // Find user by login
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username: login }, { email: login }] },
    });
    const verified = user && bcrypt.compareSync(password, user.password); // Check password

    if (verified) {
      return user;
    } else return null;
  }
}
