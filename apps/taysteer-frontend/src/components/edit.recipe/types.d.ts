interface IngredientT {
  count: number;
  name: string;
}

interface StepT {
  title: string;
  description: string;
  image: File;
}

interface RecipeT {
  title: string;
  description: string;
  image: File;
  ingredients: IngredientT[];
  steps: StepT[];
}
