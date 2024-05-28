import { getSessionUser } from "@/app/internal-actions/auth";
import { getComments, getCommentsCount } from "@/app/internal-actions/comment";
import { revalidatePage } from "@/app/internal-actions/url";
import { checkAccess } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { CommentSchemaT } from "@/app/schemas/comment";
import { CommentWithUser } from "@/types/Models";
import { ActionError } from "@/utils/dto";
import { User } from "@prisma/client";
import BaseComment from "./components/base-comment";
import EditComment from "./components/edit-comment";
import { resolveCreateComment } from "./resolvers";

const commentToEditIdVariable = variable<string>("commentToEditId");

type CommentProps = {
  comment: CommentWithUser;
  commentToEditId: string | undefined;
  sessionUser: User | null;
};

async function Comment({
  comment,
  commentToEditId,
  sessionUser,
}: CommentProps) {
  const viewerHasAccess = checkAccess(sessionUser, comment);
  return comment.id === commentToEditId && viewerHasAccess ? (
    <EditComment comment={comment} />
  ) : (
    <BaseComment comment={comment} />
  );
}

type CommentsProps = {
  recipeId: string;
};

const pageVariable = variable<number>("page");
const errorsCreateCommentVariable = variable<ActionError<CommentSchemaT>>(
  "errorsCreateComment",
);

export async function Comments({ recipeId }: CommentsProps) {
  const sessionUser = await getSessionUser();

  const page = pageVariable.get() ?? 1;
  const errors = errorsCreateCommentVariable.get() ?? {};
  const commentToEditId = commentToEditIdVariable.get();
  const comments = await getComments(recipeId, page);
  const commentsCount = await getCommentsCount(recipeId);
  const hasMoreComments = (comments?.length ?? 0) < commentsCount;

  const submitCreateComment = async (data: FormData) => {
    "use server";

    const sessionUser = await getSessionUser();
    if (sessionUser) {
      const result = await resolveCreateComment(data, recipeId, sessionUser.id);
      errorsCreateCommentVariable.set(
        result.success ? undefined : result.errors,
      );
    } else {
      errorsCreateCommentVariable.set({ global: "Forbidden" });
    }

    revalidatePage();
  };

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
    <div>
      {sessionUser && (
        <form action={submitCreateComment}>
          <input type="text" name="text" placeholder="Text" maxLength={1000} />
          {errors.text && <p>{errors.text}</p>}
          {errors.global && <p>{errors.global}</p>}
          <input type="submit" />
        </form>
      )}
      {comments ? (
        comments.map((comment) => (
          <Comment
            comment={comment}
            commentToEditId={commentToEditId}
            sessionUser={sessionUser}
            key={comment.id}
          />
        ))
      ) : (
        <span>Could not load comments</span>
      )}
      <form action={submitPagePrevious}>
        <input type="submit" value="Previous" disabled={page <= 1} />
      </form>
      Page: {page}
      <form action={submitPageNext}>
        <input type="submit" value="Next" disabled={!hasMoreComments} />
      </form>
    </div>
  );
}
