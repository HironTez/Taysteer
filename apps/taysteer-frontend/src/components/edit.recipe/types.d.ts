interface Ingredient {
  count: number;
  name: string;
}

interface Step {
  title: string;
  description: string;
  image: File;
}

interface Recipe {
  title: string;
  description: string;
  image: File;
  ingredients: Ingredient[];
  steps: Step[];
}
