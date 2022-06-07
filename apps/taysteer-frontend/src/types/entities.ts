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
  steps: Array<RecipeStepT>,
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