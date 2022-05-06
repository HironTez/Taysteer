import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './RecipeList.sass';

export const RecipeList: React.FC = () => {
  const { recipes, loading, error } = useTypedSelector((state) => state.recipe);
  const { fetchRecipes } = useActions();

  useEffect(() => {
    fetchRecipes();
  }, []); 

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id} className='recipe-min'>
          <img className='image' src={recipe.image} alt="avatar"/>
          <div className='title'>{recipe.title}</div>
          <div className={`rating rating-${recipe.rating}`}>
            <span className='rating-star 1'></span>
            <span className='rating-star 2'></span>
            <span className='rating-star 3'></span>
            <span className='rating-star 4'></span>
            <span className='rating-star 5'></span>
          </div>
          <div className='description'>{recipe.description}</div>
          <div className='readMore'>Read more</div>
        </div>
      ))}
    </div>
  );
};
