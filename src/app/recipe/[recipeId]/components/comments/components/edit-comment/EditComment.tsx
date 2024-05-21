import { revalidatePage } from "@/app/internal-actions/url";
import { checkSessionAccess } from "@/app/internal-actions/user";
import { variable } from "@/app/internal-actions/variables";
import { CommentSchemaT } from "@/app/schemas/comment";
import { CommentWithUser } from "@/types/Models";
import { ActionError } from "@/utils/dto";
import { resolveEditComment } from "../../resolvers";

type EditCommentProps = {
  comment: CommentWithUser;
};

const commentToEditIdVariable = variable<string>("commentToEditId");
const errorsEditCommentVariable =
  variable<ActionError<CommentSchemaT>>("errorsEditComment");

export async function EditComment({ comment }: EditCommentProps) {
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
