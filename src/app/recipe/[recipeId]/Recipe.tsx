import ProfilePicture from "@/app/components/profile-picture";
import { getRecipe } from "@/app/internal-actions/recipe";
import { getNameOfUser } from "@/app/internal-actions/user";
import Image from "next/image";
import { notFound } from "next/navigation";
import Comments from "./components/comments";
import styles from "./recipe.module.css";

type RecipeProps = {
  params: { recipeId: string };
};

export async function Recipe({ params: { recipeId } }: RecipeProps) {
  const recipe = await getRecipe(recipeId);
  if (!recipe) {
    notFound();
  }

  const nameOfUser = getNameOfUser(recipe.user);

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
      <span>Ingredients</span>
      {recipe.ingredients.map((ingredient, i) => (
        <div key={i}>
          <span>Count: {ingredient.count}</span>
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
