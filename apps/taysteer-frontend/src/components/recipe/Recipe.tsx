import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.sass';
import { Rating } from '../rating/Rating';

export const Recipe: React.FC = () => {
  const { id } = useParams();
  const { recipe, loading, error } = useTypedSelector((state) => state.recipe);
  const { fetchRecipe } = useActions();

  useEffect(() => {
    if (!recipe && !loading && !error) fetchRecipe(String(id));
  });

  if (recipe && !loading && !error) {
    console.log(recipe);
    return (
      <div className="recipe-container">
        <img
          className="main-image"
          src={recipe.image}
          alt="photo of the dish"
        />
        <div className="title">
          <div className="text">{recipe.title}</div>
          <Rating rating={recipe.rating} />
        </div>
        <div className="description">{recipe.description}</div>

        <div className="ingredients">
          <div className="title">Ingredients:</div>
          <ul className="list">
            {recipe.ingredients.map((ingredient, index) => {
              return (
                <li key={`ingredient${index}`}>
                  {ingredient.count} {ingredient.name}{' '}
                  {ingredient.optional ? '(optional)' : ''}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="steps">
          <div className="title">Steps to make it</div>
          <ol className="list">
            {recipe.steps.map((step, index) => {
              return (
                <li className="step" key={`step-${index}`}>
                  <div className="title">{step.title}</div>
                  <img
                    src={step.image}
                    alt="A step of the recipe"
                    className="step-image"
                  />
                  <div className="description">{step.description}</div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="comments"></div>
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
