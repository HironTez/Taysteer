import { authGuard } from "@/app/internal-actions/auth";
import { getRecipe } from "@/app/internal-actions/recipe";
import { revalidatePage } from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import { ACCEPTED_IMAGE_TYPES } from "@/app/schemas/constants";
import { RecipeSchemaT, getRecipeSchema } from "@/app/schemas/recipe";
import { ActionError } from "@/utils/dto";
import { notFound, redirect } from "next/navigation";
import { resolveCreateRecipe } from "./resolvers";

const acceptedImageTypes = ACCEPTED_IMAGE_TYPES.join(", ");

const errorsVariable = variable<ActionError<RecipeSchemaT>>("errors");

type KeysList = { lastId: number; keys: string[] };

const ingredientsKeysVariable = variable<KeysList>("ingredientKeys");
const stepsKeysVariable = variable<KeysList>("stepKeys");

type UploadRecipeProps = {
  edit?: {
    recipeId: string;
  };
};

export async function UploadRecipe(props: UploadRecipeProps) {
  const recipeId = props.edit?.recipeId;

  const sessionUser = await authGuard();
  const oldRecipe = recipeId ? await getRecipe(recipeId) : undefined;
  if (recipeId && !oldRecipe) notFound();

  const errors = errorsVariable.get() ?? {};
  const ingredientsKeys =
    ingredientsKeysVariable.get() ??
    (oldRecipe
      ? {
          lastId: oldRecipe.ingredients.length - 1,
          keys: oldRecipe.ingredients.map((_, i) => i.toString()),
        }
      : { lastId: 1, keys: ["0", "1"] });
  const stepsKeys =
    stepsKeysVariable.get() ??
    (oldRecipe
      ? {
          lastId: oldRecipe.steps.length - 1,
          keys: oldRecipe.steps.map((s) => s.id),
        }
      : { lastId: 1, keys: ["0", "1"] });

  const submitAddIngredient = async () => {
    "use server";
    const newId = ingredientsKeys.lastId + 1;
    ingredientsKeysVariable.set({
      lastId: newId,
      keys: [...ingredientsKeys.keys, newId.toString()],
    });
    revalidatePage();
  };
  const submitRemoveIngredient = async (data: FormData) => {
    "use server";
    const keyToRemove = data.get("key");
    ingredientsKeysVariable.set({
      ...ingredientsKeys,
      keys: [...ingredientsKeys.keys].filter(
        (ingredientsKey) => ingredientsKey !== keyToRemove,
      ),
    });
    revalidatePage();
  };
  const submitAddStep = async () => {
    "use server";
    const newId = stepsKeys.lastId + 1;
    stepsKeysVariable.set({
      lastId: newId,
      keys: [...stepsKeys.keys, newId.toString()],
    });
    revalidatePage();
  };
  const submitRemoveStep = async (data: FormData) => {
    "use server";
    const keyToRemove = data.get("key");
    stepsKeysVariable.set({
      ...stepsKeys,
      keys: [...stepsKeys.keys].filter((stepsKey) => stepsKey !== keyToRemove),
    });
    revalidatePage();
  };
  const submit = async (data: FormData) => {
    "use server";

    const recipeSchema = getRecipeSchema(
      ingredientsKeys.keys.length,
      stepsKeys.keys.length,
      false,
    );

    const result = await resolveCreateRecipe(data, sessionUser, recipeSchema);
    if (result.success) {
      redirect(`/recipe/${result.data.recipe.id}`);
    } else {
      errorsVariable.set(result.errors);
      revalidatePage();
    }
  };

  return (
    <div>
      <form id="add_ingredient" action={submitAddIngredient} />
      {ingredientsKeys.keys.map((key) => (
        <form
          id={`remove_ingredient_${key}`}
          action={submitRemoveIngredient}
          key={key}
        >
          <input type="hidden" name="key" value={key} readOnly />
        </form>
      ))}
      {stepsKeys.keys.map((key) => (
        <form id={`remove_step_${key}`} action={submitRemoveStep} key={key}>
          <input type="hidden" name="key" value={key} readOnly />
        </form>
      ))}
      <form id="add_step" action={submitAddStep} />
      <form action={submit}>
        <label>
          <input
            type="file"
            name="image"
            accept={acceptedImageTypes}
            required
          />
          Image
        </label>
        {errors.image}
        <input
          type="text"
          name="title"
          placeholder="Title"
          defaultValue={oldRecipe?.title}
          required
          max={50}
        />
        {errors.title}
        <input
          type="text"
          name="description"
          placeholder="Description"
          defaultValue={oldRecipe?.description}
          required
          max={500}
        />
        {errors.description}
        <span>Ingredients</span>
        {ingredientsKeys.keys.map((key, i) => {
          const oldIngredient = oldRecipe?.ingredients.at(Number(key));
          return (
            <div key={key}>
              <input
                type="text"
                name={`ingredient_${i}_count`}
                placeholder="Count"
                defaultValue={oldIngredient?.count}
                required
                max={50}
              />
              {errors[`ingredient_${i}_count`]}
              <input
                type="text"
                name={`ingredient_${i}_name`}
                placeholder="Name"
                defaultValue={oldIngredient?.name}
                required
                max={250}
              />
              {errors[`ingredient_${i}_name`]}
              <label>
                <input
                  type="checkbox"
                  name={`ingredient_${i}_optional`}
                  defaultChecked={oldIngredient?.optional}
                />
                Optional
              </label>
              {errors[`ingredient_${i}_optional`]}
              <input
                type="submit"
                value="Remove"
                form={`remove_ingredient_${key}`}
              />
            </div>
          );
        })}
        <input type="submit" value="Add ingredient" form="add_ingredient" />
        <span>Steps</span>
        {stepsKeys.keys.map((key, i) => {
          const oldStep = oldRecipe?.steps.find((step) => step.id === key);
          return (
            <div key={key}>
              <input
                type="text"
                name={`step_${i}_title`}
                placeholder="Title"
                defaultValue={oldStep?.title}
                required
                max={50}
              />
              {errors[`step_${i}_title`]}
              <input
                type="text"
                name={`step_${i}_description`}
                placeholder="Description"
                defaultValue={oldStep?.description}
                required
                max={500}
              />
              {errors[`step_${i}_description`]}
              <label>
                <input
                  type="file"
                  name={`step_${i}_image`}
                  accept={acceptedImageTypes}
                  required
                />
                Image
              </label>
              {errors[`step_${i}_image`]}
              <input type="submit" value="Remove" form={`remove_step_${key}`} />
            </div>
          );
        })}
        <input type="submit" value="Add step" form="add_step" />
        <input type="submit" />
      </form>
    </div>
  );
}
