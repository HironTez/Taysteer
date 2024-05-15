import UploadRecipe from "../../new/page";

type EditByIdProps = {
  params: { recipeId: string };
};

export default function EditRecipe({ params: { recipeId } }: EditByIdProps) {
  return <UploadRecipe edit={{ recipeId }} />;
}
