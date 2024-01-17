import ProfilePicture from "@/app/components/profile-picture";
import { getComments } from "@/app/internal-actions/comment";
import { revalidatePage } from "@/app/internal-actions/url";
import { getNameOfUser } from "@/app/internal-actions/user";
import { Prisma } from "@prisma/client";
import styles from "./comments.module.css";

type RecipeWithUser = Prisma.RecipeGetPayload<{
  include: { user: { include: { image: { select: { id: true } } } } };
}>;

type CommentsProps = {
  recipe: RecipeWithUser;
};

export async function Comments({ recipe }: CommentsProps) {
  let page = 1;

  const comments = await getComments(recipe, page);

  const submitLoadMore = async () => {
    "use server";
    page++;
    revalidatePage();
  };

  return (
    <div>
      {comments.map((comment, i) => (
        <div key={i}>
          <div className={styles.imageContainer}>
            <ProfilePicture user={recipe.user} />
          </div>
          <span>Name: {getNameOfUser(comment.user)}</span>
          <span>Username: @{comment.user?.username}</span>
          <span>Created at: {comment.createdAt.toUTCString()}</span>
          <span>Text: {comment.text}</span>
        </div>
      ))}
      <form action={submitLoadMore}>
        <input type="submit" value="Load more comments" />
      </form>
    </div>
  );
}
