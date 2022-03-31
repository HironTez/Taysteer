import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import {
  Controller,
  Delete,
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
    return res
      .status(HttpStatus.OK)
      .send(recipes.map((recipe) => Recipe.toResponse(recipe)));
  }

  @Post()
  @UseGuards(CookieAuthGuard)
  async createRecipe(@Req() req: ExtendedRequest, @Res() res: Response) {
    const createdRecipe = await this.recipeService.addRecipe(
      req.parts(),
      req.user.id
    );
    return createdRecipe
      ? res.status(HttpStatus.CREATED).send(Recipe.toResponse(createdRecipe))
      : res.status(HttpStatus.BAD_REQUEST);
  }

  @Get('find')
  async findRecipes(
    @Res() res: Response,
    @Query('search') search: string,
    @Query('page') page: number
  ) {
    const recipes = await this.recipeService.getRecipesByTitle(search, page);
    return res
      .status(HttpStatus.OK)
      .send(recipes.map((recipe) => Recipe.toResponse(recipe)));
  }

  @Get('id')
  async getRecipe(
    @Res() res: Response,
    @Param('id') id: string,
    @Query('detailed') detailed = false
  ) {
    const recipe = await this.recipeService.getRecipeById(id);
    const result = detailed
      ? Recipe.toResponseDetailed(recipe)
      : Recipe.toResponse(recipe);
    return recipe
      ? res.status(HttpStatus.OK).send(result)
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Put('id')
  @UseGuards(CookieAuthGuard)
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

  @Delete('id')
  @UseGuards(CookieAuthGuard)
  async deleteRecipe(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') id: string
  ) {
    const hasAccess = await this.recipeService.hasAccess(req.user.id, id);
    if (!hasAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const deleted = await this.recipeService.deleteRecipe(id);
    return deleted
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.BAD_REQUEST).send();
  }
}
