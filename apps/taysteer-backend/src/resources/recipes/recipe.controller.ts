import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard';
import { ExtendedRequest } from '../../typification/interfaces';
import { Response } from 'express';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async getRecipes(@Res() res: Response, @Query('page') page: number) {
    const recipes = await this.recipeService.getRecipes(page);
    return res.status(HttpStatus.OK).send(recipes);
  }

  @UseGuards(CookieAuthGuard)
  @Post()
  async createRecipe(@Req() req: ExtendedRequest, @Res() res: Response) {
    const createdRecipe = await this.recipeService.addRecipe(
      req.parts(),
      req.user.id
    );
    return createdRecipe
      ? res.status(HttpStatus.CREATED).send(Recipe.toResponse(createdRecipe))
      : res.status(HttpStatus.BAD_REQUEST);
  }

  @UseGuards(CookieAuthGuard)
  @Put('id')
  async updateRecipe(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const hasAccess = await this.recipeService.hasAccess(req.user.id, id);
    if (!hasAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const updatedRecipe = await this.recipeService.updateRecipe(
      req.parts(),
      id
    );
    return updatedRecipe
      ? res.status(HttpStatus.OK).send(Recipe.toResponse(updatedRecipe))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }
}
