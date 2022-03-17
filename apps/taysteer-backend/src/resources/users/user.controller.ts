import { MultipartFile } from './../../typification/interfaces';
import {
  Controller,
  Req,
  Res,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './user.service';
import { User } from './user.model';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserT } from './user.type';
import { ExtendedRequest } from '../../typification/interfaces';
import { UploadGuard } from '../../middleware/guards/upload.guard';
import { File } from '../../decorators/file.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    const admin = new User({ login: 'admin', password: 'admin' });
    this.usersService.addUser(admin);
  }

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    return res.status(HttpStatus.OK).send(users.map(User.toResponse));
  }

  @Get(':id')
  async getUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('detailed') detailed: boolean = false
  ) {
    const user = await this.usersService.getById(id == 'me' ? req.user.id : id);
    const response = detailed
      ? User.toResponseDetailed(user)
      : User.toResponse(user);
    return user
      ? res.status(HttpStatus.OK).send(response)
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Post()
  async createUser(@Res() res: Response, @Body() body: UserT) {
    const newUser = new User(body);
    const userCreated = await this.usersService.addUser(newUser);
    return userCreated
      ? res.status(HttpStatus.CREATED).send(User.toResponse(newUser))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Put(':id')
  async updateUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UserT
  ) {
    // Check access to an account
    const hasAccess = await this.usersService.checkAccess(req.user, id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    // Update the account
    const updatedUser = await this.usersService.updateUser(id, body);
    return updatedUser
      ? res.status(HttpStatus.OK).send(User.toResponse(updatedUser))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Delete(':id')
  async deleteUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = Boolean(await this.usersService.getById(id));
    if (userExists) this.usersService.deleteUser(id); // Delete user
    return userExists
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('rating')
  async getUsersByRating(@Res() res: Response, @Query('number') num: number) {
    const users = await this.usersService.getUsersByRating(num);
    const usersToResponse = users.map((user) => User.toResponse(user));
    return res.status(HttpStatus.OK).send(usersToResponse);
  }

  @Post(':id/rate')
  async rateUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('rating') rating: number = 0
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, id, false);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const ratedUser = await this.usersService.rateUser(id, Number(rating));
    const userToResponse = ratedUser ? User.toResponse(ratedUser) : null;
    return ratedUser
      ? res.status(HttpStatus.OK).send(userToResponse)
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Post(':id/change_image')
  @UseGuards(UploadGuard)
  async changeProfileImage(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @File() file: MultipartFile
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const uploaded = await this.usersService.changeUserImage(id, file.file);
    const userToResponse = User.toResponse(await this.usersService.getById(id));
    return uploaded
      ? res.status(HttpStatus.OK).send(userToResponse)
      : res.status(HttpStatus.BAD_REQUEST).send();
  }
}
