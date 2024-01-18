import ProfilePicture from "@/app/components/profile-picture";
import { getSessionUser } from "@/app/internal-actions/auth";
import { getComments, getCommentsCount } from "@/app/internal-actions/comment";
import { revalidatePage } from "@/app/internal-actions/url";
import { getNameOfUser } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { CreateCommentSchemaT } from "@/app/schemas/comment";
import { ActionError } from "@/utils/dto";
import { Prisma } from "@prisma/client";
import styles from "./comments.module.css";
import { resolveCreateComment } from "./resolvers";

type RecipeWithUser = Prisma.RecipeGetPayload<{
  include: { user: { include: { image: { select: { id: true } } } } };
}>;

type CommentsProps = {
  recipe: RecipeWithUser;
};

const pageVariable = variable<number>("page");
const errorsVariable = variable<ActionError<CreateCommentSchemaT>>("errors");

export async function Comments({ recipe }: CommentsProps) {
  const sessionUser = await getSessionUser();

  const page = pageVariable.get() ?? 1;
  const errors = errorsVariable.get() ?? {};
  const comments = await getComments(recipe, page);
  const commentsCount = await getCommentsCount(recipe);
  const hasMoreComments = comments.length < commentsCount;

  const submitCreateComment = async (data: FormData) => {
    "use server";

    if (sessionUser) {
      const result = await resolveCreateComment(data, recipe, sessionUser);
      if (result.success) {
      } else {
        errorsVariable.set(result.errors);
      }
      revalidatePage();
    }
  };

  const submitLoadMore = async () => {
    "use server";
    pageVariable.set(page + 1);
    revalidatePage();
  };

  return (
    <div>
      {sessionUser && (
        <form action={submitCreateComment}>
          <input type="text" name="text" placeholder="Text" />
          {errors.text && <p>{errors.text}</p>}
          {errors.global && <p>{errors.global}</p>}
          <input type="submit" />
        </form>
      )}
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
      {hasMoreComments && (
        <form action={submitLoadMore}>
          <input type="submit" value="Load more" />
        </form>
      )}
    </div>
  );
}
