import Confirm from "@/app/components/confirm";
import ProfilePicture from "@/app/components/profile-picture";
import { deleteComment } from "@/app/internal-actions/comment";
import { revalidatePage } from "@/app/internal-actions/url";
import { checkSessionAccess, getNameOfUser } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { CommentWithUser } from "@/types/Models";
import styles from "./base-comment.module.css";

type BaseCommentProps = {
  comment: CommentWithUser;
};

const commentToEditIdVariable = variable<string>("commentToEditId");
const commentDeleteErrorVariable = variable<string>("commentDeleteError");

export async function BaseComment({ comment }: BaseCommentProps) {
  const viewerHasAccess = await checkSessionAccess(comment);

  const commentDeleteError = commentDeleteErrorVariable.get();

  const submitStartCommentEditing = async () => {
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
        <ProfilePicture user={comment.user} sizes="50px" />
      </div>
      <span>Name: {getNameOfUser(comment.user)}</span>
      <span>Username: @{comment.user?.username}</span>
      <span>Created at: {comment.createdAt.toUTCString()}</span>
      <span>Text: {comment.text}</span>
      {viewerHasAccess && (
        <>
          <form action={submitStartCommentEditing}>
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
