import { UsersService } from './../users/user.service';
import { Comment } from './recipe.comment.model';
import {
  AddRecipeT,
  GetAllRecipesT,
  GetRecipeByIdT,
  GetRecipesByTitleT,
  RecipeStringTypes,
  ValidateRecipeDataT,
} from './recipe.service.types';
import { Recipe } from './recipe.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeRaterT } from './recipe.types';
import { RecipeRater } from './recipe.rater.model';
import { RecipeDataDto } from './recipe.dto';
import { uploadImage } from '../../utils/image.uploader';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeRater)
    private readonly recipeRatersRepository: Repository<RecipeRaterT>,
    @InjectRepository(Comment)
    private readonly recipeCommentsRepository: Repository<RecipeRaterT>,
    private readonly usersService: UsersService
  ) {}

  validateRecipeData: ValidateRecipeDataT = (recipe: RecipeDataDto) => {
    if (recipe.title.length > 50 || recipe.description.length > 500)
      return false;
    for (const ingredient of recipe.ingredients) {
      if (
        ingredient.count > 1_000_000 ||
        ingredient.count < 1 ||
        ingredient.name.length > 100
      )
        return false;
    }
    for (const step of recipe.steps) {
      if (step.title.length > 100 || step.description.length > 500)
        return false;
    }
    return true;
  };

  getAllRecipes: GetAllRecipesT = () => this.recipeRepository.find();

  getRecipeById: GetRecipeByIdT = (id) => this.recipeRepository.findOne(id);

  getRecipesByTitle: GetRecipesByTitleT = (title) =>
    this.recipeRepository.find({ title: Like(`%${title}%`) });

  addRecipe: AddRecipeT = async (form, userId) => {
    const user = await this.usersService.getUserById(userId);
    if (!user) return false;
    const recipe = this.recipeRepository.create();
    recipe.user = user;

    // Extract form data
    for await (const part of form) {
      // Insert field if it's a field
      if (part['value']) {
        try {
          recipe[part.fieldname] = JSON.parse(`[${part['value']}]`);
        } catch {
          recipe[part.fieldname] = part['value'];
        }
      }
      // Upload if it's a file
      else if (part.file) {
        const isMainImage = part.fieldname == RecipeStringTypes.IMAGE;
        const isStepImage = part.fieldname.includes(
          RecipeStringTypes.STEP_IMAGE
        );
        // Calculate image id
        let id = 0;
        if (isStepImage) {
          id = Number(
            part.fieldname.replace(`${RecipeStringTypes.STEP_IMAGE}`, '')
          ) - 1;
          if (id < 0) return false;
          else if (
            !recipe.steps[id] ||
            recipe.steps[id] == recipe.steps[-1]
          ) return false;
        } else if (!isMainImage) return false; // Skip if it's not supported image
        // Upload image
        const uploadedResponse = await uploadImage(
          part.file,
          RecipeStringTypes.IMAGE_FOLDER
        );
        // Save link
        if (uploadedResponse) {
          if (isMainImage) recipe.image = uploadedResponse;
          else if (isStepImage)
            recipe.steps[id].image = uploadedResponse;
        }
      } else return false;
    }

    // Validate data
    if (!this.validateRecipeData(recipe)) return false;

    // Save recipe
    return await this.recipeRepository.save(recipe);
  };
}
