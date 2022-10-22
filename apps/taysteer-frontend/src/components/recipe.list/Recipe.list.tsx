import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.list.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useLocation } from 'react-router-dom';
import {
  horizontalScrollDirection,
} from '../../scripts/own.module';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Error } from '../error.animation/Error.animation';
import { Rating } from '../rating/Rating';

export const RecipeList: React.FC<{ userId?: string }> = ({ userId }) => {
  const { recipes, loading, error, end, page } = useTypedSelector(
    (state) => state.recipes
  );
  const { fetchRecipes, setRecipePage, clearRecipeList } = useActions();

  useEffect(() => {
    if (!end && page !== 1) fetchRecipes(page, userId); // Fetch recipes if it's a new page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const location = useLocation();

  // When url changes
  useEffect(() => {
    clearRecipeList(); // Clear recipes
    fetchRecipes(1, userId); // Fetch new recipes
    // Re-run scripts
    horizontalScrollDirection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, userId]);

  return loading ? (
    <Loading />
  ) : (
    <div className="recipes">
      <div
        id="recipes-container"
        className={`horizontal-scroll horizontal-scroll-shadow ${
          window.innerWidth >= 1000 ? 'active' : ''
        }`}
        onWheel={(event) => {
          if (
            event.deltaY !== 0 &&
            event.currentTarget.classList.contains('active')
          ) {
            event.stopPropagation();
            uss.scrollXBy(event.deltaY, event.currentTarget, null, false);
          }
        }}
      >
        <InfiniteScroll // Set up infinite scroll
          dataLength={recipes.length}
          next={() => {
            setRecipePage(page + 1);
          }}
          hasMore={!end}
          loader={<Loading />}
          endMessage={error ? <Error /> : null}
          scrollableTarget="recipes-container"
        >
          {/* Format recipes */}
          {recipes.map((recipe) => (
            <Link
              to={`/recipes/${recipe.id}`}
              key={recipe.id}
              className="recipe-min"
            >
              <img
                className="image"
                src={recipe.image}
                alt="recipe food preview"
              />
              <div className="recipe-min-section second">
                <div className="title">{recipe.title}</div>
                <div className="description">{recipe.description}</div>
              </div>
              <div className="recipe-min-section third">
                <Rating rating={recipe.rating} />
                <div className="readMore">Read more</div>
              </div>
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
