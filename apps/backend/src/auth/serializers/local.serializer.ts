import { Injectable } from '@nestjs/common';
import { PassportSerializer } from './passport.serializer';
import { PrismaService } from '../../db/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  async serializeUser(user: User) {
    return user.id;
  }

  async deserializeUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user ?? false;
  }
}
