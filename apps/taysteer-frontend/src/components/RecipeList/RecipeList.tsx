import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';

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
        <div key={recipe.id}>
          <img src={recipe.image} alt="avatar"/>
          <div>{recipe.title}</div>
          <div>{recipe.description}</div>
          <div>{recipe.rating}</div>
          <div>{recipe.ingredients}</div>
          <div>{recipe.steps}</div>
        </div>
      ))}
    </div>
  );
};
