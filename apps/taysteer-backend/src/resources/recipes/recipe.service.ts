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
  HasRecipeAccessT,
  DeleteRecipeT,
  AddRecipeCommentT,
  ValidateCommentT,
  HasCommentAccessT,
  GetCommentByIdT,
  DeleteCommentT,
  UpdateCommentT,
  AddCommentCommentT,
  RateRecipeT,
  GetCommentsT,
  GetCommentWithAnswersByIdT,
} from './recipe.service.types';
import { Recipe } from './recipe.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeRating } from './recipe.rating.model';
import { RecipeDataDto } from './recipe.dtos';
import { deleteImage, uploadImage } from '../../utils/image.uploader';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeRating)
    private readonly recipeRatingsRepository: Repository<RecipeRating>,
    @InjectRepository(Comment)
    private readonly recipeCommentsRepository: Repository<Comment>,
    private readonly usersService: UsersService
  ) {}

  validateRecipeData: ValidateRecipeDataT = (recipe: RecipeDataDto) => {
    if (
      recipe.title.length > 50 ||
      recipe.description.length > 500 ||
      !recipe.image
    )
      return false;
    for (const ingredient of recipe.ingredients) {
      if (
        ingredient.count > 1_000_000 ||
        ingredient.count < 0 ||
        ingredient.name.length > 100
      )
        return false;
    }
    for (const stepKey of Object.keys(recipe.steps)) {
      const step = recipe.steps[stepKey];
      if (
        step.title?.length > 100 ||
        step.description?.length > 500 ||
        !step.image
      )
        return false;
    }
    return true;
  };

  validateComment: ValidateCommentT = (commentText) =>
    commentText.length <= 500;

  hasRecipeAccess: HasRecipeAccessT = async (userId, recipeId) => {
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

  hasCommentAccess: HasCommentAccessT = async (userId, commentId) => {
    const userIsOwner = await this.recipeCommentsRepository.findOne(commentId, {
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

  getRecipeById: GetRecipeByIdT = (id) =>
    this.recipeRepository.findOne(id, {
      relations: [RecipeStringTypes.USER, RecipeStringTypes.RATERS],
    });

  getRecipesByTitle: GetRecipesByTitleT = (title, page = 1) =>
    this.recipeRepository.find({
      where: { title: Like(`%${title}%`) },
      order: { rating: 'DESC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });

  addRecipe: AddRecipeT = async (form, userId) => {
    try {
      const recipeData = new RecipeDataDto(); // Create the object for recipe data
      // Add user to recipe
      const user = await this.usersService.getUserById(userId);
      if (!user) return false;
      recipeData.user = user;

      // Extract form data
      for await (const part of form) {
        // Insert field if it's a field
        if (part['value']) {
          try {
            // Get steps
            if (part.fieldname === 'steps') {
              const newData = JSON.parse(part['value']);
              for (const stepKey of Object.keys(recipeData.steps)) {
                const oldStep = recipeData.steps[stepKey];
                if (oldStep.image) {
                  newData[stepKey].image = oldStep.image;
                }
              }

              recipeData[part.fieldname] = newData;
            } else {
              // Get other data
              recipeData[part.fieldname] = JSON.parse(part['value']);
            }
          } catch {
            try {
              recipeData[part.fieldname] = JSON.parse(part['value']);
            } catch {
              recipeData[part.fieldname] = part['value'];
            }
          }
        }
        // Upload if it's a file
        else if (part.file) {
          const isMainImage = part.fieldname == RecipeStringTypes.IMAGE;
          const isStepImage = part.fieldname.includes(
            RecipeStringTypes.STEP_IMAGE
          );

          // Calculate image id
          let id = '1';
          if (isStepImage) {
            // Get image id
            id = String(Number(part.fieldname.replace(RecipeStringTypes.STEP_IMAGE, '')) - 1);
            // Check id
            if (Number(id) < 0) return false;
            else if (!recipeData.steps || !recipeData.steps[id]) {
              if (!recipeData.steps) recipeData.steps = {};
              recipeData.steps[id] = { title: '', description: '', image: '' };
            }
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
        }
      }

      // Validate data
      if (!this.validateRecipeData(recipeData)) return false;

      // Create recipe
      const recipe = this.recipeRepository.create(new Recipe(recipeData));

      // Save recipe
      return await this.recipeRepository.save(recipe);
    } catch {
      return false;
    }
  };

  updateRecipe: UpdateRecipeT = async (form, recipeId) => {
    try {
      const recipe = await this.recipeRepository.findOne(recipeId);

      // Extract form data
      const recipeData = new RecipeDataDto();
      for await (const part of form) {
        // Insert field if it's a field
        if (part['value']) {
          try {
            // Get steps
            if (part.fieldname === 'steps') {
              const newData = JSON.parse(part['value']);
              for (const stepKey of Object.keys(recipeData.steps)) {
                const oldStep = recipeData.steps[stepKey];
                if (oldStep.image) {
                  newData[stepKey].image = oldStep.image;
                }
              }

              recipeData[part.fieldname] = newData;
            } else {
              // Get other data
              recipeData[part.fieldname] = JSON.parse(`[${part['value']}]`);
            }
          } catch {
            try {
              recipeData[part.fieldname] = JSON.parse(part['value']);
            } catch {
              recipeData[part.fieldname] = part['value'];
            }
          }
        }
        // Upload if it's a file
        else if (part.file) {
          const isMainImage = part.fieldname == RecipeStringTypes.IMAGE;
          const isStepImage = part.fieldname.includes(
            RecipeStringTypes.STEP_IMAGE
          );

          // Calculate image id
          let id = '1';
          if (isStepImage) {
            // Get image id
            id = part.fieldname.replace(RecipeStringTypes.STEP_IMAGE, '');
            // Check id
            if (Number(id) < 1) return false;
            else if (!recipeData.steps || !recipeData.steps[id]) {
              if (!recipeData.steps) recipeData.steps = {};
              recipeData.steps[id] = { title: '', description: '', image: '' };
            }
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
        }
      }

      // Validate data
      if (!this.validateRecipeData(recipeData)) return false;

      // Delete old images from the server
      const images = [
        recipe.image,
        ...Object.keys(recipe.steps).map((key) => recipe.steps[key].image),
      ];
      images.forEach((image) => deleteImage(image));

      const newRecipe = new Recipe({ ...recipeData, ...{ update: true } });

      // Save recipe
      return await this.recipeRepository.save({
        ...recipe,
        ...newRecipe,
      });
    } catch {
      return false;
    }
  };

  deleteRecipe: DeleteRecipeT = async (id) => {
    // Get the recipe
    const recipe = await this.getRecipeById(id);

    // Delete images
    const images = [
      recipe.image,
      ...Object.keys(recipe.steps).map((key) => recipe.steps[key].image),
    ];
    images.forEach((image) => deleteImage(image));

    // Delete the recipe
    const deleteResult = await this.recipeRepository.delete(id);
    return deleteResult.affected;
  };

  rateRecipe: RateRecipeT = async (recipeId, raterId, rating) => {
    // Validate data
    if (!rating) return false;
    else if (rating > 5) rating = 5;

    // Get the user with relations
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) return false;

    const user = await this.usersService.getUserById(raterId);

    // Try to find the rating
    const findingResult = await this.recipeRatingsRepository.findOne(
      {
        rater: user,
        recipe: recipe,
      },
      {
        relations: [RecipeStringTypes.RATER, RecipeStringTypes.RECIPE],
      }
    );
    // Create a new rater if not found
    const ratingObject =
      findingResult || this.recipeRatingsRepository.create(new RecipeRating());
    ratingObject.rater = user;
    ratingObject.rating = rating;

    // Save the rater
    await this.recipeRatingsRepository.save(ratingObject);

    let new_ratings_count = recipe.ratingsCount,
      new_ratings_sum = recipe.ratingsSum - recipe.rating + rating,
      new_rating = Math.round(rating);

    // If it's the first rating
    // Calculate the rating
    if (!findingResult) {
      new_ratings_count = recipe.ratingsCount + 1;
      new_ratings_sum = recipe.ratingsSum + rating;
      recipe.raters.push(ratingObject);
    }
    // If it's the update of the rating
    else {
      new_rating = Math.round(new_ratings_sum / new_ratings_count);
    }

    // Update the user
    return this.recipeRepository.save({
      ...recipe,
      ...{
        ratingsCount: new_ratings_count,
        ratingsSum: new_ratings_sum,
        rating: new_rating,
        raters: recipe.raters,
      },
    });
  };

  getComments: GetCommentsT = async (recipeId, page = 1) => {
    const recipe = await this.getRecipeById(recipeId);
    return this.recipeCommentsRepository.find({
      relations: [RecipeStringTypes.RECIPE, RecipeStringTypes.USER],
      where: { recipe: recipe },
      order: { date: 'DESC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
  };

  getCommentById: GetCommentByIdT = (id) =>
    this.recipeCommentsRepository.findOne(id, {
      relations: [RecipeStringTypes.USER, RecipeStringTypes.RECIPE],
    });

  getCommentWithAnswersById: GetCommentWithAnswersByIdT = async (id, page) => {
    const mainComment = await this.getCommentById(id); // Get main comment
    // Get the page of child comments
    const childComments = await this.recipeCommentsRepository.find({
      where: { mainComment: mainComment },
      relations: [RecipeStringTypes.MAINCOMMENT, RecipeStringTypes.USER],
      order: { date: 'ASC' },
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
    mainComment.childComments = childComments;
    return mainComment;
  };

  addRecipeComment: AddRecipeCommentT = async (
    commentText,
    userId,
    recipeId
  ) => {
    if (!this.validateComment(commentText)) return false; // Validate comment

    // Get recipe and user
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) return false;
    const user = await this.usersService.getUserById(userId);

    // Create the comment
    const comment = this.recipeCommentsRepository.create(
      new Comment({ text: commentText })
    );
    // Set relatives
    comment.user = user;
    comment.recipe = recipe;

    // Save the comment
    return this.recipeCommentsRepository.save(comment);
  };

  addCommentComment: AddCommentCommentT = async (
    commentText,
    userId,
    mainCommentId
  ) => {
    if (!this.validateComment(commentText)) return false; // Validate comment

    // Get recipe and user
    const mainComment = await this.getCommentById(mainCommentId);
    if (!mainComment) return false;
    const user = await this.usersService.getUserById(userId);

    // Create the comment
    const comment = this.recipeCommentsRepository.create(
      new Comment({ text: commentText })
    );
    // Set relatives
    comment.user = user;
    comment.mainComment = mainComment;

    // Save the comment
    return this.recipeCommentsRepository.save(comment);
  };

  updateComment: UpdateCommentT = async (commentText, commentId) => {
    const comment = await this.getCommentById(commentId); // Get the comment
    if (!this.validateComment(commentText)) return false; // Validate
    // Save
    return this.recipeCommentsRepository.save({
      ...comment,
      ...{
        text: commentText,
        updated: true,
      },
    });
  };

  deleteComment: DeleteCommentT = async (commentId) => {
    const deleteResult = await this.recipeCommentsRepository.delete(commentId); // Delete the comment
    return deleteResult.affected; // Return a result
  };
}
