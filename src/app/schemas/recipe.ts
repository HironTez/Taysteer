import { Optional } from "@/types/Optional";
import { arrayConstructor } from "@/utils/array";
import { typeSafeObjectFromEntries } from "@/utils/object";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { image, imageOptional } from "./constants";

const createRecipeBase = z.object({
  title: zfd.text(
    z.string().max(50, "Title can be maximal 50 characters long"),
  ),
  description: zfd.text(
    z.string().max(500, "Description can be maximal 500 characters long"),
  ),
  image,
});

const editRecipeBase = z.object({
  title: zfd.text(
    z.string().max(50, "Title can be maximal 50 characters long"),
  ),
  description: zfd.text(
    z.string().max(500, "Description can be maximal 500 characters long"),
  ),
  image: imageOptional,
});

type CreateRecipeBaseSchemaT = z.infer<typeof createRecipeBase>;
type EditRecipeBaseSchemaT = z.infer<typeof editRecipeBase>;

export type RecipeIngredientT = {
  count: string;
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

const getIngredientsObjectSchema = (count: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(count, (i) => [
      [
        `ingredient_${i}_count`,
        zfd.text(
          z
            .string()
            .max(50, "Ingredient count can be maximal 50 characters long"),
        ),
      ],
      [
        `ingredient_${i}_name`,
        zfd.text(
          z
            .string()
            .max(250, "Ingredient name can be maximal 250 characters long"),
        ),
      ],
      [`ingredient_${i}_optional`, zfd.checkbox()],
    ]).flat(),
  );
};

const getCreateStepsObjectSchema = (count: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(count, (i) => [
      [
        `step_${i}_title`,
        zfd.text(
          z
            .string()
            .max(
              50,
              `Step title can be maximal 50 characters long (step ${i + 1})`,
            ),
        ),
      ],
      [
        `step_${i}_description`,
        zfd.text(
          z
            .string()
            .max(
              500,
              `Step description can be maximal 500 characters long (step ${i + 1})`,
            ),
        ),
      ],
      [`step_${i}_image`, image],
    ]).flat(),
  );
};

const getEditStepsObjectSchema = (count: number) => {
  return typeSafeObjectFromEntries(
    arrayConstructor(count, (i) => [
      [`step_${i}_id`, zfd.text(idObject.optional())],
      [
        `step_${i}_title`,
        zfd.text(
          z
            .string()
            .max(
              50,
              `Step title can be maximal 50 characters long (step ${i + 1})`,
            ),
        ),
      ],
      [
        `step_${i}_description`,
        zfd.text(
          z
            .string()
            .max(
              500,
              `Step description can be maximal 500 characters long (step ${i + 1})`,
            ),
        ),
      ],
      [`step_${i}_image`, imageOptional],
    ]).flat(),
  );
};

export const getRecipeCreateSchema = (
  ingredientsCount: number,
  stepsCount: number,
) => {
  const ingredientsObjectSchema = getIngredientsObjectSchema(ingredientsCount);
  const stepsObjectSchema = getCreateStepsObjectSchema(stepsCount);

  return zfd.formData(
    createRecipeBase
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export const getRecipeEditSchema = (
  ingredientsCount: number,
  stepsCount: number,
) => {
  const ingredientsObjectSchema = getIngredientsObjectSchema(ingredientsCount);
  const stepsObjectSchema = getEditStepsObjectSchema(stepsCount);

  return zfd.formData(
    editRecipeBase
      .merge(z.object(ingredientsObjectSchema))
      .merge(z.object(stepsObjectSchema)),
  );
};

export type CreateRecipeSchemaRawT = ReturnType<typeof getRecipeCreateSchema>;
type CreateRecipeSchemaT = z.infer<CreateRecipeSchemaRawT>;

export type EditRecipeSchemaRawT = ReturnType<typeof getRecipeEditSchema>;
type EditRecipeSchemaT = z.infer<EditRecipeSchemaRawT>;

export type RecipeSchemaT = CreateRecipeSchemaT | EditRecipeSchemaT;
