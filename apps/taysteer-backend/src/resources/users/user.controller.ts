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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ExtendedRequest } from '../../typification/interfaces';
import { FormGuard } from '../../middleware/guards/form.guard';
import { FormData } from '../../decorators/file.decorator';
import { UserDataDto } from './user.dto';
import { deleteImage } from '../../utils/image.uploader';
import { UserStringTypes } from './user.service.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.getAllUsers();
    return res.status(HttpStatus.OK).send(users.map(User.toResponse));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(FormGuard)
  async createUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @FormData() formData: UserDataDto
  ) {
    const userExists = await this.usersService.getByLogin(formData.login); // Check if user don't exists
    const createdUser = await this.usersService.addUser(formData, req.fileStreams); // Create an account
    return createdUser
      ? res.status(HttpStatus.CREATED).send(User.toResponse(createdUser))
      : userExists
      ? res.status(HttpStatus.CONFLICT).send()
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @FormData() formData: UserDataDto
  ) {
    // Check access to an account
    const hasAccess = await this.usersService.checkAccess(req.user, req.user.id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = await this.usersService.getById(formData.id); // Check if user exists

    // Update the account
    const updatedUser = await this.usersService.updateUser(req.user.id, formData, req.fileStreams);
    return updatedUser
      ? res.status(HttpStatus.OK).send(User.toResponse(updatedUser))
      : userExists
      ? res.status(HttpStatus.BAD_REQUEST).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUserById(
    @Req() req: ExtendedRequest,
    @Res() res: Response
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, req.user.id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userDeleted = await this.usersService.deleteUser(req.user.id); // Delete user
    // if (userDeleted) res.removeHeader('Authorization');
    return userDeleted
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Get('rating')
  @UseGuards(JwtAuthGuard)
  async getUsersByRating(
    @Res() res: Response,
    @Query('number') num: number = 10
  ) {
    const users = await this.usersService.getUsersByRating(num);
    const usersToResponse = users.map((user) => User.toResponse(user));
    return res.status(HttpStatus.OK).send(usersToResponse);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  async rateUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('rating') rating: number = 0
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, id, false);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = await this.usersService.getById(req.user.id);

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

  @Post('delete_image')
  @UseGuards(JwtAuthGuard)
  async deleteProfileImage(
    @Req() req: ExtendedRequest,
    @Res() res: Response
  ) {
    const hasAccess = await this.usersService.checkAccess(req.user, req.user.id, true);
    if (!hasAccess) return res.status(HttpStatus.FORBIDDEN).send();

    const userExists = await this.usersService.getById(req.user.id);

    const deleted = await deleteImage(req.user.id, UserStringTypes.IMAGES_FOLDER);
    const userToResponse = User.toResponse(await this.usersService.getById(req.user.id));
    return deleted
      ? res.status(HttpStatus.OK).send(userToResponse)
      ? userExists
      : res.status(HttpStatus.BAD_REQUEST).send()
      : res.status(HttpStatus.NOT_FOUND).send();
  }
}
