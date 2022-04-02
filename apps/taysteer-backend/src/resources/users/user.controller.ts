import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './user.service';
import { User } from './user.model';
import { ExtendedRequest } from '../../typification/interfaces';
import { UserStringTypes } from './user.service.types';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(CookieAuthGuard)
  async getUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('detailed') detailed = false
  ) {
    const user = await this.usersService.getUserById(
      id == 'me' ? req.user.id : id
    );
    const response = detailed
      ? User.toResponseDetailed(user)
      : User.toResponse(user);
    return user
      ? res.status(HttpStatus.OK).send(response)
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Post()
  async createUser(@Req() req: ExtendedRequest, @Res() res: Response) {
    // Create an account
    const createdUser = await this.usersService.addUser(req.parts());

    if (createdUser == UserStringTypes.CONFLICT)
      return res.status(HttpStatus.CONFLICT).send(); // Response if user already exist

    return createdUser && typeof createdUser != 'string'
      ? res.status(HttpStatus.CREATED).send(User.toResponse(createdUser))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Put()
  @UseGuards(CookieAuthGuard)
  async updateUserById(@Req() req: ExtendedRequest, @Res() res: Response, @Query('user_id') userId: string) {
    // Check access to an account
    const hasAccess = await this.usersService.checkAccess(
      req.user,
      userId || req.user.id,
      true
    );
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    // Update the account
    const updatedUser = await this.usersService.updateUser(
      userId || req.user.id,
      req.parts()
    );

    if (updatedUser == UserStringTypes.CONFLICT)
      return res.status(HttpStatus.CONFLICT).send(); // Response if user with new login already exist

    return updatedUser && typeof updatedUser != 'string'
      ? res.status(HttpStatus.OK).send(User.toResponse(updatedUser))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Delete()
  @UseGuards(CookieAuthGuard)
  async deleteUserById(@Req() req: ExtendedRequest, @Res() res: Response, @Query('user_id') userId: string) {
    const hasAccess = await this.usersService.checkAccess(
      req.user,
      userId || req.user.id,
      true
    );
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userDeleted = await this.usersService.deleteUser(userId || req.user.id); // Delete user
    return userDeleted
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('rating')
  @UseGuards(CookieAuthGuard)
  async getUsersByRating(@Res() res: Response, @Query('page') page: number) {
    const users = await this.usersService.getUsersByRating(page);
    const usersToResponse = users.map((user) => User.toResponse(user));
    return res.status(HttpStatus.OK).send(usersToResponse);
  }

  @Post(':id/rate')
  @UseGuards(CookieAuthGuard)
  async rateUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('rating') rating = 0
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, id, false);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = await this.usersService.getUserById(req.user.id);

    const ratedUser = await this.usersService.rateUser(
      id,
      req.user.id,
      Number(rating)
    );
    const userToResponse = ratedUser ? User.toResponse(ratedUser) : null;
    return ratedUser
      ? res.status(HttpStatus.OK).send(userToResponse)
      : userExists
      ? res.status(HttpStatus.BAD_REQUEST).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete('delete_image')
  @UseGuards(CookieAuthGuard)
  async deleteProfileImage(@Req() req: ExtendedRequest, @Res() res: Response) {
    const hasAccess = await this.usersService.checkAccess(
      req.user,
      req.user.id,
      true
    );
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = await this.usersService.getUserById(req.user.id);
    if (!userExists) return res.status(HttpStatus.NOT_FOUND).send();

    const userWithDeletedImage = await this.usersService.deleteUserImage(req.user.id);
    return userWithDeletedImage
      ? res.status(HttpStatus.OK).send(User.toResponse(userWithDeletedImage))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }
}
