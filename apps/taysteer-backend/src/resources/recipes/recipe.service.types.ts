import { RecipeDataDto } from './recipe.dto';
import { RecipeT } from "./recipe.types";

export type ValidateRecipeDataT = (recipe: RecipeDataDto) => boolean;
export type GetAllRecipesT = () => Promise<Array<RecipeT>>;
export type GetRecipeByIdT = (id: string) => Promise<RecipeT>;
export type GetRecipesByTitleT = (title: string) => Promise<Array<RecipeT>>;
export type AddRecipeT = (recipeData: RecipeDataDto, files?: AsyncIterableIterator<NodeJS.ReadableStream>) => Promise<RecipeT | false>;