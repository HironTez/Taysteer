import { Comment } from './recipe.comment.model';
import { RecipeCommentDto } from './recipe.dtos';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import {
  Body,
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

  @Get(':recipeId')
  async getRecipe(@Res() res: Response, @Param('recipeId') recipeId: string) {
    const recipe = await this.recipeService.getRecipeById(recipeId);
    return recipe
      ? res.status(HttpStatus.OK).send(Recipe.toResponseDetailed(recipe))
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Put(':recipeId')
  @UseGuards(CookieAuthGuard)
  async updateRecipe(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('recipeId') recipeId: string
  ) {
    const hasRecipeAccess = await this.recipeService.hasRecipeAccess(
      req.user.id,
      recipeId
    );
    if (!hasRecipeAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const updatedRecipe = await this.recipeService.updateRecipe(
      req.parts(),
      recipeId
    );
    return updatedRecipe
      ? res.status(HttpStatus.OK).send(Recipe.toResponse(updatedRecipe))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Delete(':recipeId')
  @UseGuards(CookieAuthGuard)
  async deleteRecipe(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('recipeId') recipeId: string
  ) {
    const hasRecipeAccess = await this.recipeService.hasRecipeAccess(
      req.user.id,
      recipeId
    );
    if (!hasRecipeAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const deleted = await this.recipeService.deleteRecipe(recipeId);
    return deleted
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Post(':recipeId/rate')
  @UseGuards(CookieAuthGuard)
  async rateUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('recipeId') recipeId: string,
    @Query('rating') rating = 0
  ) {
    const hasRecipeAccess = !(await this.recipeService.hasRecipeAccess(
      req.user.id,
      recipeId
    ));
    if (!hasRecipeAccess) return res.status(HttpStatus.NOT_FOUND).send();

    const ratedRecipe = await this.recipeService.rateRecipe(
      recipeId,
      req.user.id,
      Number(rating)
    );
    return ratedRecipe
      ? res.status(HttpStatus.OK).send(Recipe.toResponse(ratedRecipe))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Get('comments/:commentId')
  async getComment(
    @Res() res: Response,
    @Param('commentId') commentId: number
  ) {
    const comment = await this.recipeService.getCommentById(commentId);
    return comment
      ? res.status(HttpStatus.OK).send(Comment.toResponse(comment))
      : res.status(HttpStatus.NOT_FOUND).send();
  }

  @Post(':recipeId/comments')
  @UseGuards(CookieAuthGuard)
  async commentRecipe(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('recipeId') recipeId: string,
    @Body() body: RecipeCommentDto
  ) {
    const createdComment = await this.recipeService.addRecipeComment(
      body.text,
      req.user.id,
      recipeId
    );
    return createdComment
      ? res.status(HttpStatus.CREATED).send(Comment.toResponse(createdComment))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Put('comments/:commentId')
  @UseGuards(CookieAuthGuard)
  async updateRecipeComment(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('commentId') commentId: number,
    @Body() body: RecipeCommentDto
  ) {
    const hasRecipeAccess = await this.recipeService.hasCommentAccess(
      req.user.id,
      commentId
    );
    if (!hasRecipeAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const updatedComment = await this.recipeService.updateComment(
      body.text,
      commentId
    );
    return updatedComment
      ? res.status(HttpStatus.OK).send(Comment.toResponse(updatedComment))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Delete('comments/:commentId')
  @UseGuards(CookieAuthGuard)
  async deleteRecipeComment(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('commentId') commentId: number
  ) {
    const hasRecipeAccess = await this.recipeService.hasCommentAccess(
      req.user.id,
      commentId
    );
    if (!hasRecipeAccess) return res.status(HttpStatus.NOT_FOUND).send();
    const deletedComment = await this.recipeService.deleteComment(commentId);
    return deletedComment
      ? res.status(HttpStatus.NO_CONTENT).send()
      : res.status(HttpStatus.BAD_REQUEST).send();
  }

  @Post('comments/:commentId')
  @UseGuards(CookieAuthGuard)
  async answerRecipeComment(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('commentId') commentId: number,
    @Body() body: RecipeCommentDto
  ) {
    const createdComment = await this.recipeService.addCommentComment(
      body.text,
      req.user.id,
      commentId
    );
    return createdComment
      ? res.status(HttpStatus.CREATED).send(Comment.toResponse(createdComment))
      : res.status(HttpStatus.BAD_REQUEST).send();
  }
}
