import { UsersService } from './../users/user.service';
import { Comment } from './recipe.comment.model';
import {
  AddRecipeT,
  GetRecipesT,
  GetRecipeByIdT,
  GetRecipesByTitleT,
  RecipeStringTypes,
  UpdateRecipeT,
  ValidateRecipeDataT,
  HasAccessT,
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

  hasAccess: HasAccessT = async (userId, recipeId) => {
    const userIsOwner = await this.recipeRepository.findOne(recipeId, {
      relations: [RecipeStringTypes.USER],
      where: {
        user: {
          id: userId,
        },
      },
    });
    return Boolean(userIsOwner);
  };

  getRecipes: GetRecipesT = (page = 1) =>
    this.recipeRepository.find({
      order: { rating: 'DESC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });

  getRecipeById: GetRecipeByIdT = (id) => this.recipeRepository.findOne(id);

  getRecipesByTitle: GetRecipesByTitleT = (title) =>
    this.recipeRepository.find({ title: Like(`%${title}%`) });

  addRecipe: AddRecipeT = async (form, userId) => {
    const recipeData = new RecipeDataDto();
    // Add user to recipe
    const user = await this.usersService.getUserById(userId);
    if (!user) return false;
    recipeData.user = user;

    // Extract form data
    for await (const part of form) {
      // Insert field if it's a field
      if (part['value']) {
        try {
          recipeData[part.fieldname] = JSON.parse(`[${part['value']}]`);
        } catch {
          recipeData[part.fieldname] = part['value'];
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
          // Get image id
          id =
            Number(part.fieldname.replace(RecipeStringTypes.STEP_IMAGE, '')) -
            1;
          // Check id
          if (id < 0) return false;
          else if (
            !recipeData.steps[id] ||
            recipeData.steps[id] == recipeData.steps[-1]
          )
            return false;
        } else if (!isMainImage) return false; // Exit if it's not supported image

        // Upload image
        const uploadedResponse = await uploadImage(
          part.file,
          RecipeStringTypes.IMAGE_FOLDER
        );
        // Save link
        if (uploadedResponse) {
          if (isMainImage) recipeData.image = uploadedResponse;
          else if (isStepImage) recipeData.steps[id].image = uploadedResponse;
        }
      } else return false;
    }

    // Validate data
    if (!this.validateRecipeData(recipeData)) return false;

    // Create recipe
    const recipe = this.recipeRepository.create(new Recipe(recipeData));

    // Save recipe
    return await this.recipeRepository.save(recipe);
  };

  updateRecipe: UpdateRecipeT = async (form, recipeId) => {
    const recipe = await this.recipeRepository.findOne(recipeId);

    // Extract form data
    const recipeData = new RecipeDataDto();
    for await (const part of form) {
      // Insert field if it's a field
      if (part['value']) {
        try {
          recipeData[part.fieldname] = JSON.parse(`[${part['value']}]`);
        } catch {
          recipeData[part.fieldname] = part['value'];
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
          // Get image id
          id =
            Number(part.fieldname.replace(RecipeStringTypes.STEP_IMAGE, '')) -
            1;
          // Check id
          if (id < 0) return false;
          else if (
            !recipeData.steps[id] ||
            recipeData.steps[id] == recipeData.steps[-1]
          )
            return false;
        } else if (!isMainImage) return false; // Exit if it's not supported image

        // Upload image
        const uploadedResponse = await uploadImage(
          part.file,
          RecipeStringTypes.IMAGE_FOLDER
        );
        // Save link
        if (uploadedResponse) {
          if (isMainImage) recipeData.image = uploadedResponse;
          else if (isStepImage) recipeData.steps[id].image = uploadedResponse;
        }
      } else return false;
    }

    // Validate data
    if (!this.validateRecipeData(recipeData)) return false;

    const newRecipe = new Recipe({ ...recipeData, ...{ update: true } });

    // Save recipe
    return await this.recipeRepository.save({
      ...recipe,
      ...newRecipe,
    });
  };
}
