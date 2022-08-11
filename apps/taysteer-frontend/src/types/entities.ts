export interface RecipeT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
}

export interface UserT {
  id: string;
  name: string;
  login: string;
  image: string;
  rating: number;
}

export interface RecipeDetailedT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  ratingsCount: number;
  user: UserT;
  ingredients: Array<RecipeIngredientT>;
  steps: { [type: string]: RecipeStepT };
  countOfComments: number;
}

interface RecipeIngredientT {
  count: number;
  name: string;
  optional: boolean;
}

interface RecipeStepT {
  title: string;
  description: string;
  image: string;
}

export interface ProfileDetailedT {
  id: string;
  name: string;
  login: string;
  image: string;
  description: string;
  rating: number;
  ratingsCount: number;
  recipes: Array<RecipeT>;
  countOfRecipes: number;
}
