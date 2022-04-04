import { MultipartFile } from 'fastify-multipart';
import { RecipeDataDto } from './recipe.dtos';
import { Recipe } from './recipe.model';
import { Comment } from './recipe.comment.model';

export type ValidateRecipeDataT = (recipe: RecipeDataDto) => boolean;
export type ValidateCommentT = (CommentText: string) => boolean;
export type HasRecipeAccessT = (userId: string, recipeId: string) => Promise<boolean>;
export type HasCommentAccessT = (userId: string, commentId: number) => Promise<boolean>;
export type GetRecipesT = (page: number) => Promise<Array<Recipe>>;
export type GetRecipeByIdT = (id: string) => Promise<Recipe>;
export type GetRecipesByTitleT = (title: string, page: number) => Promise<Array<Recipe>>;
export type AddRecipeT = (form: AsyncIterableIterator<MultipartFile>, userId: string) => Promise<Recipe | false>;
export type UpdateRecipeT = (form: AsyncIterableIterator<MultipartFile>, recipeId: string) => Promise<Recipe | false>;
export type DeleteRecipeT = (id: string) => Promise<number>;
export type RateRecipeT = (recipeId: string, raterId: string, rating: number) => Promise<Recipe | false>;
export type GetCommentsT = (recipeId: string, page: number) => Promise<Array<Comment>>;
export type GetCommentByIdT = (commentId: number) => Promise<Comment>;
export type GetCommentWithAnswersByIdT = (commentId: number, page: number) => Promise<Comment>;
export type AddRecipeCommentT = (commentText: string, userId: string, recipeId: string) => Promise<Comment | false>;
export type AddCommentCommentT = (commentText: string, userId: string, mainCommentId: number) => Promise<Comment | false>;
export type UpdateCommentT = (commentText: string, commentId: number) => Promise<Comment | false>;
export type DeleteCommentT = (commentId: number) => Promise<number>;

export enum RecipeStringTypes {
  IMAGE = 'image',
  STEP_IMAGE = 'stepImage',
  IMAGE_FOLDER = 'recipe_images',
  NOT_FOUND = 'not_found',
  USER = 'user',
  RATER = 'rater',
  RATERS = 'raters',
  RECIPE = 'recipe',
  COMMENTS = 'comments',
  CHILDCOMMENTS = 'childComments',
  MAINCOMMENT = 'mainComment'
}