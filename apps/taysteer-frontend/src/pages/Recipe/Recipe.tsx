import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Error } from '../../components/error.animation/Error.animation';
import { Loading } from '../../components/loading.spinner/Loading.spinner';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.sass';

export const RecipePage: React.FC = () => {
  const { id } = useParams();

  const { recipe, loading, error } = useTypedSelector((state) => state.recipe);

  const { fetchRecipe } = useActions();

  useEffect(() => {
    if (!recipe && !loading && !error) fetchRecipe(String(id));
  });

  if (recipe) {
    return <div></div>;
  } else if (loading) {
    return <div><Loading/></div>;
  } else {
    return <div><Error/></div>;
  }
};