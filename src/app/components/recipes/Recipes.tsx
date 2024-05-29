import { getRecipes, getRecipesCount } from "@/app/internal-actions/recipe";
import { newUrl, revalidatePage } from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import Image from "next/image";
import Link from "next/link";
import styles from "./recipes.module.css";

type Props = {
  userId?: string;
  favorites?: boolean;
};

const pageVariable = variable<number>("page");

export async function Recipes({ userId, favorites }: Props) {
  const page = pageVariable.get() ?? 1;
  const recipes = await getRecipes(page, userId, favorites);

  const recipesCount = await getRecipesCount(userId);
  const hasMoreRecipes = (recipes?.length ?? 0) < recipesCount;

  const submitPagePrevious = async () => {
    "use server";
    pageVariable.set(page - 1);
    revalidatePage();
  };
  const submitPageNext = async () => {
    "use server";
    pageVariable.set(page + 1);
    revalidatePage();
  };

  return (
    <>
      {recipes?.map((recipe) => (
        <Link href={newUrl(`/recipe/${recipe.id}`)} key={recipe.id}>
          <div className={styles.imageContainer}>
            <Image
              fill
              sizes="50px"
              src={`/image/${recipe.image?.id}`}
              alt="main picture of the dish"
              loading="lazy"
            />
          </div>
          <span>Title: {recipe.title}</span>
          <span>
            Description: {recipe.description.substring(0, 199)}
            {recipe.description.length > 199 && "..."}
          </span>
          <span>Rating: {recipe.rating.value}</span>
        </Link>
      ))}
      <form action={submitPagePrevious}>
        <input type="submit" value="Previous" disabled={page <= 1} />
      </form>
      Page: {page}
      <form action={submitPageNext}>
        <input type="submit" value="Next" disabled={!hasMoreRecipes} />
      </form>
    </>
  );
}
