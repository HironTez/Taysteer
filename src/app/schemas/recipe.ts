import { Optional } from "@/types/Optional";
import { arrayConstructor } from "@/utils/array";
import { typeSafeObjectFromEntries } from "@/utils/object";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { description, image, string, title } from "./templates";

const createRecipeBase = z.object({
  title: title(),
  description: description(),
  image: image(),
});

const editRecipeBase = z.object({
  title: title(),
  description: description(),
  image: image().optional(),
});

type CreateRecipeBaseSchemaT = z.infer<typeof createRecipeBase>;
type EditRecipeBaseSchemaT = z.infer<typeof editRecipeBase>;

export type RecipeIngredientT = {
  amount: string;
  name: string;
  optional: boolean;
};

export type RecipeStepT = {
  id: string | undefined;
  title: string;
  description: string;
  image: File;
};

type RecipeStepOptionalImageT = Optional<RecipeStepT, "image">;

type IngredientsAndSchemaT = {
  ingredients: RecipeIngredientT[];
  steps: RecipeStepT[];
};

type IngredientsAndSchemaOptionalT = {
  ingredients: RecipeIngredientT[];
  steps: RecipeStepOptionalImageT[];
};

export type CreateRecipeDataT = CreateRecipeBaseSchemaT & IngredientsAndSchemaT;
export type EditRecipeDataT = EditRecipeBaseSchemaT &
  IngredientsAndSchemaOptionalT;

const idObject = z
  .string()
  .length(
    24,
    "Internal error. Try to reload page. Step id must be 24 characters long",
  );

const getIngredientsObjectSchema = (amount: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(amount, (i) => [
      [
        `ingredient_${i}_amount`,
        string(50, "ingredient amount", `(ingredient ${i + 1})`),
      ],
      [
        `ingredient_${i}_name`,
        string(250, "ingredient name", `(ingredient ${i + 1})`),
      ],
      [`ingredient_${i}_optional`, zfd.checkbox()],
    ]).flat(),
  );
};

const getCreateStepsObjectSchema = (amount: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(amount, (i) => {
      const suffix = `(step ${i + 1})`;
      return [
        [`step_${i}_title`, title("step", suffix)],
        [`step_${i}_description`, description("step", suffix)],
        [`step_${i}_image`, image("step", suffix)],
      ];
    }).flat(),
  );
};

const getEditStepsObjectSchema = (amount: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(amount, (i) => {
      const suffix = `(step ${i + 1})`;
      return [
        [`step_${i}_id`, zfd.text(idObject).optional()],
        [`step_${i}_title`, title("step", suffix)],
        [`step_${i}_description`, description("step", suffix)],
        [`step_${i}_image`, image("step", suffix).optional()],
      ];
    }).flat(),
  );
};

export const getRecipeCreateSchema = (
  ingredientsAmount: number,
  stepsAmount: number,
) => {
  const ingredientsObjectSchema = getIngredientsObjectSchema(ingredientsAmount);
  const stepsObjectSchema = getCreateStepsObjectSchema(stepsAmount);

  return zfd.formData(
    createRecipeBase
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export const getRecipeEditSchema = (
  ingredientsAmount: number,
  stepsAmount: number,
) => {
  const ingredientsObjectSchema = getIngredientsObjectSchema(ingredientsAmount);
  const stepsObjectSchema = getEditStepsObjectSchema(stepsAmount);

  return zfd.formData(
    editRecipeBase
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export type CreateRecipeSchemaRawT = ReturnType<typeof getRecipeCreateSchema>;
// type CreateRecipeSchemaT = z.infer<CreateRecipeSchemaRawT>;

export type EditRecipeSchemaRawT = ReturnType<typeof getRecipeEditSchema>;
type EditRecipeSchemaT = z.infer<EditRecipeSchemaRawT>;

export type RecipeSchemaT = EditRecipeSchemaT;
