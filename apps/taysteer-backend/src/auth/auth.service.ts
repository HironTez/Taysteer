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
        const user = await userRepository.findOne({ login });
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        };
        return null;
    };

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return this.jwtService.sign(payload);
    };
};