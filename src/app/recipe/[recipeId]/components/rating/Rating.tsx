import { getSessionUser } from "@/app/internal-actions/auth";
import { getRating, getRatingByUser } from "@/app/internal-actions/rating";
import { revalidatePage } from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import { RatingSchemaT } from "@/app/schemas/rating";
import { arrayConstructor } from "@/utils/array";
import { ActionError } from "@/utils/dto";
import { resolveUploadRating } from "./resolvers";

type Props = {
  recipeId: string;
};

const errorsCreateVariable = variable<ActionError<RatingSchemaT>>("errorRate");

export async function Rating({ recipeId }: Props) {
  const { rating, count } = await getRating(recipeId);
  const sessionUser = await getSessionUser();
  const userRating =
    sessionUser && (await getRatingByUser(recipeId, sessionUser.id));

  const errorCreate = errorsCreateVariable.get() ?? {};

  const submitRating = async (data: FormData) => {
    "use server";

    const sessionUser = await getSessionUser();
    if (sessionUser) {
      const result = await resolveUploadRating(data, recipeId, sessionUser.id);
      if (result.success) {
        errorsCreateVariable.delete();
      } else {
        errorsCreateVariable.set(result.errors);
      }
    }

    revalidatePage();
  };

  return (
    <>
      <span>
        Rating: {rating} ({count})
      </span>

      {sessionUser && (
        <>
          <form action={submitRating}>
            {arrayConstructor(5, (i) => (
              <button type="submit" name="value" value={i + 1} key={i}>
                {userRating && i < userRating ? "★" : "☆"}
              </button>
            ))}
            {errorCreate.value && <p>{errorCreate.value}</p>}
            {errorCreate.global && <p>{errorCreate.global}</p>}
          </form>
        </>
      )}
    </>
  );
}
