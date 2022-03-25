import {
  AddRecipeT,
  GetAllRecipesT,
  GetRecipeByIdT,
  GetRecipesByTitleT,
  ValidateRecipeDataT,
} from './recipe.service.types';
import { Recipe } from './recipe.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeRaterT, RecipeT } from './recipe.types';
import { RecipeRater } from './recipe.rater.model';
import { RecipeDataDto } from './recipe.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<RecipeT>,
    @InjectRepository(RecipeRater)
    private recipeRatersRepository: Repository<RecipeRaterT>,
    @InjectRepository(Comment)
    private recipeCommentsRepository: Repository<RecipeRaterT>
  ) {}

  validateRecipeData: ValidateRecipeDataT = (recipe: RecipeDataDto) => {
    if (
      recipe.title.length > 50 ||
      recipe.description.length > 500
    ) return false;
    else return true;
  }

  getAllRecipes: GetAllRecipesT = () => this.recipeRepository.find();

  getRecipeById: GetRecipeByIdT = (id) => this.recipeRepository.findOne(id);

  getRecipesByTitle: GetRecipesByTitleT = (title) =>
    this.recipeRepository.find({ title: Like(`%${title}%`) });
}
