import { authGuard } from "@/app/internal-actions/auth";
import { revalidatePage } from "@/app/internal-actions/url";
import { ACCEPTED_IMAGE_TYPES } from "@/app/schemas/constants";
import {
  CreateRecipeSchemaT,
  getCreateRecipeSchema,
} from "@/app/schemas/recipe";
import { ActionError } from "@/utils/dto";
import { redirect } from "next/navigation";
import { resolveCreateRecipe } from "./resolvers";

const acceptedImageTypes = ACCEPTED_IMAGE_TYPES.join(", ");

let errors: ActionError<CreateRecipeSchemaT> = {};

let ingredientKeys = [1, 2];
let stepsKeys = [1, 2];

export async function NewRecipe() {
  const sessionUser = await authGuard();

  const submitAddIngredient = async () => {
    "use server";
    ingredientKeys.push((ingredientKeys.at(-1) ?? 0) + 1);
    revalidatePage();
  };
  const submitRemoveIngredient = async (data: FormData) => {
    "use server";
    const keyToRemove = data.get("key");
    ingredientKeys = ingredientKeys.filter(
      (ingredientKey) => ingredientKey.toString() !== keyToRemove,
    );
    revalidatePage();
  };
  const submitAddStep = async () => {
    "use server";
    stepsKeys.push((stepsKeys.at(-1) ?? 0) + 1);
    revalidatePage();
  };
  const submitRemoveStep = async (data: FormData) => {
    "use server";
    const keyToRemove = data.get("key");
    stepsKeys = stepsKeys.filter(
      (stepKey) => stepKey.toString() !== keyToRemove,
    );
    revalidatePage();
  };
  const submit = async (data: FormData) => {
    "use server";

    const createRecipeSchema = getCreateRecipeSchema(
      ingredientKeys.length,
      stepsKeys.length,
    );

    const result = await resolveCreateRecipe(
      data,
      sessionUser,
      createRecipeSchema,
    );
    if (result.success) {
      redirect(`/recipe/${result.data.recipe.id}`);
    } else {
      errors = result.errors;
      revalidatePage();
    }
  };

  return (
    <div>
      <form id="add_ingredient" action={submitAddIngredient} />
      {ingredientKeys.map((key) => (
        <form
          id={`remove_ingredient_${key}`}
          action={submitRemoveIngredient}
          key={key}
        >
          <input type="hidden" name="key" value={key} readOnly />
        </form>
      ))}
      {stepsKeys.map((key) => (
        <form id={`remove_step_${key}`} action={submitRemoveStep} key={key}>
          <input type="hidden" name="key" value={key} readOnly />
        </form>
      ))}
      <form id="add_step" action={submitAddStep} />
      <form action={submit}>
        <label>
          <input type="file" name="image" accept={acceptedImageTypes} />
          Image
        </label>
        {errors.image}
        <input type="text" name="title" placeholder="Title" />
        {errors.title}
        <input type="text" name="description" placeholder="Description" />
        {errors.description}
        <span>Ingredients</span>
        {ingredientKeys.map((key, i) => (
          <div key={key}>
            <input
              type="text"
              name={`ingredient_${i}_count`}
              placeholder="Count"
            />
            {errors[`ingredient_${i}_count`]}
            <input
              type="text"
              name={`ingredient_${i}_name`}
              placeholder="Name"
            />
            {errors[`ingredient_${i}_name`]}
            <label>
              <input type="checkbox" name={`ingredient_${i}_optional`} />
              Optional
            </label>
            {errors[`ingredient_${i}_optional`]}
            <input
              type="submit"
              value="Remove"
              form={`remove_ingredient_${key}`}
            />
          </div>
        ))}
        <span>Steps</span>
        {stepsKeys.map((key, i) => (
          <div key={key}>
            <input type="text" name={`step_${i}_title`} placeholder="Title" />
            {errors[`step_${i}_title`]}
            <input
              type="text"
              name={`step_${i}_description`}
              placeholder="Description"
            />
            {errors[`step_${i}_description`]}
            <label>
              <input
                type="file"
                name={`step_${i}_image`}
                accept={acceptedImageTypes}
              />
              Image
            </label>
            {errors[`step_${i}_image`]}
            <input type="submit" value="Remove" form={`remove_step_${key}`} />
          </div>
        ))}
        <input type="submit" value="Add ingredient" form="add_ingredient" />
        <input type="submit" value="Add step" form="add_step" />
        <input type="submit" />
      </form>
    </div>
  );
}

// TODO: length limitations & mark required fields
