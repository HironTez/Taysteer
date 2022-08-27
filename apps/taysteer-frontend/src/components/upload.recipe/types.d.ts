interface NewIngredientT {
  count: number | null;
  name: string;
}

interface NewStepT {
  title: string;
  description: string;
  image: File | null;
}

interface NewRecipeT {
  title: string;
  description: string;
  image: File | null;
  ingredients: NewIngredientT[];
  steps: NewStepT[];
}
