import Confirm from "@/app/components/confirm";
import ProfilePicture from "@/app/components/profile-picture";
import { deleteRecipe, getRecipe } from "@/app/internal-actions/recipe";
import { getUrl, revalidatePage } from "@/app/internal-actions/url";
import { checkSessionAccess, getNameOfUser } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { urlAddToPath } from "@/utils/url";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "./components/comments";
import styles from "./recipe.module.css";

type RecipeProps = {
  params: { recipeId: string };
};

const deleteRecipeErrorVariable = variable<string | undefined>(
  "deleteRecipeError",
);

export async function Recipe({ params: { recipeId } }: RecipeProps) {
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    notFound();
  }

  const viewerHasAccess = await checkSessionAccess(recipe);

  const nameOfUser = getNameOfUser(recipe.user);
  const pathEdit = urlAddToPath(getUrl(), "edit");

  const deleteRecipeError = deleteRecipeErrorVariable.get();

  const submitDelete = async () => {
    "use server";

    if (viewerHasAccess) {
      const result = await deleteRecipe(recipe.id);
      if (!result.success) deleteRecipeErrorVariable.set(result.errors.global);
    } else {
      deleteRecipeErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <Image
          fill
          sizes="50%"
          src={`/image/${recipe.image?.id}`}
          alt="Main picture of"
        />
      </div>
      <span>Title: {recipe.title}</span>
      <span>Description: {recipe.description}</span>
      <div className={styles.imageContainer}>
        <ProfilePicture user={recipe.user} />
      </div>
      <span>Author name: {nameOfUser}</span>
      <span>Author username: @{recipe.user?.username}</span>
      {viewerHasAccess && (
        <>
          <Link href={pathEdit}>Edit</Link>
          <Confirm
            buttonText="Delete"
            confirmText="Confirm deletion"
            onConfirm={submitDelete}
          >
            Do you actually want to delete this recipe? This action cannot be
            undone
            {deleteRecipeError}
          </Confirm>
        </>
      )}
      <span>Ingredients</span>
      {recipe.ingredients.map((ingredient, i) => (
        <div key={i}>
          <span>Amount: {ingredient.amount}</span>
          <span>Name: {ingredient.name}</span>
          <span>Optional: {ingredient.optional}</span>
        </div>
      ))}
      <span>Steps</span>
      {recipe.steps.map((step, i) => (
        <div key={i}>
          <span>Title: {step.title}</span>
          <span>Description: {step.description}</span>
          <div className={styles.imageContainer}>
            <Image
              fill
              sizes="50%"
              src={`/image/${step.image?.id}`}
              alt="Profile picture"
            />
            ;
          </div>
        </div>
      ))}
      <span>Rating: {recipe.rating}</span>
      <Comments recipe={recipe} />
    </div>
  );
}
