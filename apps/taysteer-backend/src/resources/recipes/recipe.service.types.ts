import { MultipartFile } from 'fastify-multipart';
import { RecipeDataDto } from './recipe.dto';
import { Recipe } from './recipe.model';

export type ValidateRecipeDataT = (recipe: RecipeDataDto) => boolean;
export type GetAllRecipesT = () => Promise<Array<Recipe>>;
export type GetRecipeByIdT = (id: string) => Promise<Recipe>;
export type GetRecipesByTitleT = (title: string) => Promise<Array<Recipe>>;
export type AddRecipeT = (form: AsyncIterableIterator<MultipartFile>, userId: string) => Promise<Recipe | false>;

export enum RecipeStringTypes {
  IMAGE = 'image',
  STEP_IMAGE = 'stepImage',
  IMAGE_FOLDER = 'recipe_images'
}