import Confirm from "@/app/components/confirm";
import ProfilePicture from "@/app/components/profile-picture";
import { getSessionUser } from "@/app/internal-actions/auth";
import {
  deleteComment,
  getComments,
  getCommentsCount,
} from "@/app/internal-actions/comment";
import { revalidatePage } from "@/app/internal-actions/url";
import {
  checkAccess,
  checkSessionAccess,
  getNameOfUser,
} from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { CommentSchemaT } from "@/app/schemas/comment";
import { CommentWithUser } from "@/types/Models";
import { ActionError } from "@/utils/dto";
import { User } from "@prisma/client";
import styles from "./comments.module.css";
import { resolveCreateComment, resolveEditComment } from "./resolvers";

type BaseCommentProps = {
  comment: CommentWithUser;
};

const commentToEditIdVariable = variable<string>("commentToEditId");
const commentDeleteErrorVariable = variable<string>("commentDeleteError");

async function BaseComment({ comment }: BaseCommentProps) {
  const viewerHasAccess = await checkSessionAccess(comment);

  const commentDeleteError = commentDeleteErrorVariable.get();

  const submitStartEditing = async () => {
    "use server";

    commentToEditIdVariable.set(comment.id);
    revalidatePage();
  };

  const submitDelete = async () => {
    "use server";

    const viewerHasAccess = await checkSessionAccess(comment);
    if (viewerHasAccess) {
      const result = await deleteComment(comment.id);
      if (result.success) {
        commentDeleteErrorVariable.delete();
      } else {
        commentDeleteErrorVariable.set(result.errors.global);
      }
    } else {
      commentDeleteErrorVariable.set("Forbidden");
    }

    revalidatePage();
  };

  return (
    <div>
      <div className={styles.imageContainer}>
        <ProfilePicture user={comment.user} />
      </div>
      <span>Name: {getNameOfUser(comment.user)}</span>
      <span>Username: @{comment.user?.username}</span>
      <span>Created at: {comment.createdAt.toUTCString()}</span>
      <span>Text: {comment.text}</span>
      {viewerHasAccess && (
        <>
          <form action={submitStartEditing}>
            <input type="submit" value="Edit" />
          </form>
          <Confirm
            buttonText="Delete"
            confirmText="Confirm deletion"
            onConfirm={submitDelete}
          >
            Do you actually want to delete this comment? This action cannot be
            undone
            {commentDeleteError}
          </Confirm>
        </>
      )}
    </div>
  );
}

type EditCommentProps = {
  comment: CommentWithUser;
};

const errorsEditCommentVariable =
  variable<ActionError<CommentSchemaT>>("errorsEditComment");

async function EditComment({ comment }: EditCommentProps) {
  const errors = errorsEditCommentVariable.get() ?? {};

  const submitCancel = async () => {
    "use server";

    commentToEditIdVariable.delete();
    revalidatePage();
  };

  const submitEditComment = async (data: FormData) => {
    "use server";

    const viewerHasAccess = await checkSessionAccess(comment);
    if (viewerHasAccess) {
      const result = await resolveEditComment(data, comment.id);
      if (result.success) {
        errorsEditCommentVariable.delete();
      } else {
        errorsEditCommentVariable.set(result.errors);
      }
    }

    commentToEditIdVariable.delete();
    revalidatePage();
  };

  return (
    <>
      <form action={submitEditComment}>
        <input
          type="text"
          name="text"
          defaultValue={comment.text}
          placeholder="Text"
        />
        {errors.text && <p>{errors.text}</p>}
        {errors.global && <p>{errors.global}</p>}
        <input type="submit" />
      </form>
      <form action={submitCancel}>
        <input type="submit" value="Cancel" />
      </form>
    </>
  );
}

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
  if (comment.id === commentToEditId && viewerHasAccess) {
    return <EditComment comment={comment} />;
  } else {
    return <BaseComment comment={comment} />;
  }
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
      if (result.success) {
        errorsCreateCommentVariable.delete();
      } else {
        errorsCreateCommentVariable.set(result.errors);
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
      {hasMoreComments && (
        <form action={submitLoadMore}>
          <input type="submit" value="Load more" />
        </form>
      )}
    </div>
  );
}
