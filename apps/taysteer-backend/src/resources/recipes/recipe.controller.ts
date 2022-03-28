import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import {
  Controller,
  HttpStatus,
  Post,
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

  @UseGuards(CookieAuthGuard)
  @Post()
  async createUser(@Req() req: ExtendedRequest, @Res() res: Response) {
    const createdRecipe = await this.recipeService.addRecipe(
      req.parts(),
      req.user.id
    )
    console.log(createdRecipe);
    return createdRecipe
      ? res.status(HttpStatus.CREATED).send(Recipe.toResponse(createdRecipe))
      : res.status(HttpStatus.BAD_REQUEST);
  }
}
