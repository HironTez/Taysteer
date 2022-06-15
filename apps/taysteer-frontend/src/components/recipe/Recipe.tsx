import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.sass';

export const Recipe: React.FC = () => {
  const { id } = useParams();

  const { recipe, loading, error } = useTypedSelector((state) => state.recipe);

  const { fetchRecipe } = useActions();

  useEffect(() => {
    if (!recipe && !loading && !error) fetchRecipe(String(id));
  });

  if (recipe && !loading && !error) {
    return (
      <div className="recipe-container">
        <img src={recipe.image} alt="photo of the dish" />
      </div>
    );
  } else if (loading) {
    return (
      <div className="recipe-container">
        <Loading />
      </div>
    );
  } else {
    return (
      <div className="recipe-container">
        <Error />
      </div>
    );
  }
};