import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { urlToObject } from '../../scripts/own.module';
import { UploadRecipe } from '../upload.recipe/Upload.recipe';

export const EditRecipe: React.FC = () => {
  const { recipeId } = useParams();
  const { recipe, loading, error } = useTypedSelector((state) => state.recipe);
  const { fetchRecipe } = useActions();

  useEffect(() => {
    fetchRecipe(String(recipeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const [oldRecipe, setOldRecipe] = useState<RecipeT | null>(null);

  const setRecipeData = async () => {
    if (recipe) {
      const oldRecipeData: RecipeT = {
        title: recipe.title,
        description: recipe.description,
        image: await urlToObject(recipe.image),
        ingredients: recipe.ingredients,
        steps: await Promise.all(
          Object.keys(recipe.steps).map(async (stepKey, _index) => {
            const step = recipe.steps[stepKey];
            return {
              title: step.title,
              description: step.description,
              image: await urlToObject(step.image),
            };
          })
        ),
      };

      setOldRecipe(oldRecipeData);
    }
  };

  useEffect(() => {
    if (recipe && !loading && !error) {
      setRecipeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, loading, error]);

  return (
    <UploadRecipe
      oldRecipe={oldRecipe}
      oldRecipeId={recipeId}
      oldRecipeLoading={loading}
    />
  );
};
