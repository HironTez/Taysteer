interface Ingredient {
  count: number | null;
  name: string;
}

interface Step {
  title: string;
  description: string;
  image: File | null;
}

interface Recipe {
  title: string;
  description: string;
  image: File | null;
  ingredients: Ingredient[];
  steps: Step[];
}
