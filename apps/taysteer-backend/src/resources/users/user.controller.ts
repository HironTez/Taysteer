import { Controller, Res, Get, Post, Put, Delete, Param, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserDataDto } from './dto/user-data.dto';
import { UsersService } from './user.service';
import { User } from './user.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {
        const admin = new User({login: 'admin', password: 'admin'});
        this.usersService.addUser(admin);
    };

    @Get()
    async getAllUsers(@Res() res: Response) {
        const users = await this.usersService.getAllUsers();
        return res.status(HttpStatus.OK).send(users.map(User.toResponse));
    };

    @Get(':id')
    async getUserById(@Res() res: Response, @Param('id') id: string) {
        const user = await this.usersService.getById(id);
        return user ? res.status(HttpStatus.OK).send(User.toResponse(user)) : res.status(HttpStatus.NOT_FOUND).send();
    };

    @Post()
    async createUser(@Res() res: Response, @Body() body: UserDataDto) {
        const newUser = new User(body);
        const userCreated = await this.usersService.addUser(newUser);
        return userCreated ? res.status(HttpStatus.CREATED).send(User.toResponse(newUser)) : res.status(HttpStatus.BAD_REQUEST).send();
    };

    @Put(':id')
    async updateUserById(@Res() res: Response, @Param('id') id: string, @Body() body: UserDataDto) {
        const newUser = new User(body);
        const userUpdated = await this.usersService.updateUser(id, newUser);
        return userUpdated ? res.status(HttpStatus.OK).send(userUpdated) : res.status(HttpStatus.BAD_REQUEST).send();
    };

    @Delete(':id')
    async deleteUserById(@Res() res: Response, @Param('id') id: string) {
        const userExists = Boolean(await this.usersService.getById(id));
        if (userExists) this.usersService.deleteUser(id); // Delete user
        return userExists ? res.status(HttpStatus.NO_CONTENT).send() : res.status(HttpStatus.NOT_FOUND).send();
    };

};