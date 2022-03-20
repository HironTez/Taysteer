interface RecipeT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
  ratings_count: number;
  ratings_sum: number;
  raters: RecipeRaterT[];
}

interface RecipeToResponseT {
  id: string;
  title: string;
  image: string;
  description: string;
  rating: number;
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

interface RecipeRaterT {
  id: number;
  raterId: string;
  rating: number;
  user: RecipeT;
}

interface CommentT {
  id: number;
  commentatorId: string;
  text: string;
}

export {
  RecipeT,
  RecipeToResponseT,
  RecipeRaterT,
  RecipeIngredientT,
  RecipeStepT,
  CommentT,
};
