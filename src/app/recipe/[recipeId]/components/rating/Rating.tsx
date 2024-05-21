import { getSessionUser } from "@/app/internal-actions/auth";
import {
  deleteRating,
  getRating,
  getRatingByUser,
} from "@/app/internal-actions/rating";
import { revalidatePage } from "@/app/internal-actions/url";
import { variable } from "@/app/internal-actions/variables";
import { RatingSchemaT } from "@/app/schemas/rating";
import { arrayConstructor } from "@/utils/array";
import { ActionError } from "@/utils/dto";
import { resolveUploadRating } from "./resolvers";

type Props = {
  recipeId: string;
};

const errorsCreateVariable =
  variable<ActionError<RatingSchemaT>>("errorsCreateRating");
const errorDeleteVariable = variable<string>("errorDeleteRating");

export async function Rating({ recipeId }: Props) {
  const { rating, count } = await getRating(recipeId);
  const sessionUser = await getSessionUser();
  const userRating =
    sessionUser && (await getRatingByUser(recipeId, sessionUser.id));

  const errorsCreate = errorsCreateVariable.get() ?? {};
  const errorDelete = errorDeleteVariable.get();

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
    } else {
      errorsCreateVariable.set({ global: "Forbidden" });
    }

    revalidatePage();
  };

  const submitDeleteRating = async () => {
    "use server";

    const sessionUser = await getSessionUser();
    if (sessionUser) {
      const result = await deleteRating(recipeId, sessionUser.id);
      if (result.success) {
        errorDeleteVariable.delete();
      } else {
        errorDeleteVariable.set(result.errors.global);
      }
    } else {
      errorDeleteVariable.set("Forbidden");
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
          {userRating && (
            <form action={submitDeleteRating}>
              <input type="submit" value="Delete rating" />
              {errorDelete && <p>{errorDelete}</p>}
            </form>
          )}
          <form action={submitRating}>
            {arrayConstructor(5, (i) => (
              <button type="submit" name="value" value={i + 1} key={i}>
                {userRating && i < userRating ? "★" : "☆"}
              </button>
            ))}
            {errorsCreate.value && <p>{errorsCreate.value}</p>}
            {errorsCreate.global && <p>{errorsCreate.global}</p>}
          </form>
        </>
      )}
    </>
  );
}
