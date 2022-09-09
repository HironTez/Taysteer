import { useEffect, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.sass';
import { Rating } from '../rating/Rating';
import {
  allowVerticalScroll,
  scrollToElem,
  popup,
} from '../../scripts/own.module';
import $ from 'jquery';
import editIcon from '../../assets/images/navigation/edit-icon.svg';
import { Rate } from '../rate/Rate';
import { RecipeComments } from '../recipe.comments/Recipe.comments';

export const Recipe: React.FC = () => {
  // Get the recipe
  const { recipeId } = useParams();
  const { recipe, loading, error } = useTypedSelector((state) => state.recipe);
  const { fetchRecipe } = useActions();
  const location = useLocation();

  const { account } = useTypedSelector((state) => state.account);

  useEffect(() => {
    if (!loading && !error) fetchRecipe(String(recipeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, recipeId, location]);

  useEffect(allowVerticalScroll, []);

  // Rate a recipe
  const [myRating, setMyRating] = useState(0);

  const { loading: recipeRatingLoading, error: recipeRatingError } =
    useTypedSelector((state) => state.rateRecipe);

  const { fetchRateRecipe } = useActions();

  useEffect(() => {
    if (myRating !== 0 && !recipeRatingLoading && !recipeRatingError) {
      fetchRateRecipe(recipe?.id ?? '', myRating);
    } else if (recipeRatingError) {
      setMyRating(0);
      popup(recipeRatingError, 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myRating, recipeRatingError]);

  if (recipe && !loading && !error) {
    return (
      <div className="recipe-container">
        <img className="main-image" src={recipe.image} alt="The dish" />
        <div className="title">
          <div className="text">
            {recipe.title}
            {(recipe.user.id === account?.id ||
              account?.login === 'admin') && (
              <NavLink to="./edit" className="edit-link">
                <img src={editIcon} alt="edit" className="edit-icon" />
              </NavLink>
            )}
          </div>
          <Rating rating={recipe.rating} />
        </div>
        <div className="description">
          {recipe.description}
          <NavLink className="author" to={`/profile/${recipe.user.id}`}>
            {recipe.user.image && (
              <img
                src={recipe.user.image}
                alt="authors profile"
                className="profile-picture"
              />
            )}
            <div className="name">{recipe.user.name}</div>
            <div className="username">@{recipe.user.login}</div>
            <Rating rating={recipe.user.rating} />
          </NavLink>
          {recipe.description.length < 180 && window.innerWidth > 1150 && (
            <div>
              <br />
              <button
                className="scrollToNext"
                onClick={() => {
                  scrollToElem($('div.ingredients').get(0) as HTMLElement);
                }}
              >
                Jump to recipe
              </button>
            </div>
          )}
        </div>

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
            {Object.keys(recipe.steps).map((stepKey, index) => {
              const step = recipe.steps[stepKey];
              return (
                <li className="step" key={`step-${index}`}>
                  <div className="title">{step.title}</div>
                  <div className="description">{step.description}</div>
                  <img
                    src={step.image}
                    alt="A step of the recipe"
                    className="step-image"
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {recipe.user.id !== account?.id && (
          <div className="rate-recipe">
            Rate this recipe:
            <Rate rating={myRating} setRating={setMyRating} />
          </div>
        )}

        <div className="comments">
          <RecipeComments
            recipeId={recipe.id}
            countOfComments={recipe.countOfComments}
          />
        </div>
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
