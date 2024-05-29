import Confirm from "@/app/components/confirm";
import ProfilePicture from "@/app/components/profile-picture";
import { getSessionUser } from "@/app/internal-actions/auth";
import { deleteRecipe, getRecipe } from "@/app/internal-actions/recipe";
import { newUrl, revalidatePage } from "@/app/internal-actions/url";
import {
  addRecipeToFavorites,
  checkAccess,
  checkSessionAccess,
  getNameOfUser,
  removeRecipeFromFavorites,
} from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "./components/comments";
import Rating from "./components/rating";
import styles from "./recipe.module.css";

type RecipeProps = {
  params: { recipeId: string };
};

const deleteRecipeErrorVariable = variable<string | undefined>(
  "deleteRecipeError",
);
const ratingErrorVariable = variable<string | undefined>("ratingError");

export async function Recipe({ params: { recipeId } }: RecipeProps) {
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    notFound();
  }

  const viewer = await getSessionUser();
  const viewerHasAccess = checkAccess(viewer, recipe);
  const isFavoriteOfViewer = viewer?.favoriteRecipesIds.includes(recipeId);

  const nameOfUser = getNameOfUser(recipe.user);
  const pathEdit = newUrl("edit");

  const deleteRecipeError = deleteRecipeErrorVariable.get();

  const submitDelete = async () => {
    "use server";

    const viewerHasAccess = await checkSessionAccess(recipe);
    if (viewerHasAccess) {
      const result = await deleteRecipe(recipe.id);
      ratingErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      deleteRecipeErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  const submitAddToFavorites = async () => {
    "use server";
    const viewer = await getSessionUser();
    if (viewer) {
      const result = await addRecipeToFavorites(viewer.id, recipe.id);
      ratingErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      ratingErrorVariable.set("Forbidden");
    }
    revalidatePage();
  };
  const submitRemoveFromFavorites = async () => {
    "use server";
    const viewer = await getSessionUser();
    if (viewer) {
      const result = await removeRecipeFromFavorites(viewer.id, recipe.id);
      ratingErrorVariable.set(
        result.success ? undefined : result.errors.global,
      );
    } else {
      ratingErrorVariable.set("Forbidden");
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
          alt="main picture of the dish"
          loading="lazy"
        />
      </div>
      <span>Title: {recipe.title}</span>
      <span>Description: {recipe.description}</span>
      <div className={styles.profileImageContainer}>
        <ProfilePicture user={recipe.user} sizes="50px" />
      </div>
      <span>Author name: {nameOfUser}</span>
      <span>Author username: @{recipe.user?.username}</span>
      {viewer &&
        (isFavoriteOfViewer ? (
          <form action={submitRemoveFromFavorites}>
            <input type="submit" value="Remove from favorites" />
          </form>
        ) : (
          <form action={submitAddToFavorites}>
            <input type="submit" value="Add to favorites" />
          </form>
        ))}
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
              alt="step picture"
              loading="lazy"
            />
            ;
          </div>
        </div>
      ))}
      <Rating recipe={recipe} />
      <Comments recipeId={recipe.id} />
    </div>
  );
}
