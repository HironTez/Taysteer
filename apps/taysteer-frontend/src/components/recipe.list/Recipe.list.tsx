import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.list.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useLocation } from 'react-router-dom';
import { horizontalScroll, horizontalScrollShadow } from '../../scripts/own.module';
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
  }, [page]);

  const location = useLocation();

  // When url changes
  useEffect(() => {
    clearRecipeList(); // Clear recipes
    fetchRecipes(1, userId); // Fetch new recipes
    // Re-run scripts
    horizontalScroll();
    horizontalScrollShadow();
  }, [location]);

  return (
    <div className="recipes">
      <div
        id="recipes-container"
        className="horizontal-scroll horizontal-scroll-shadow"
      >
        <InfiniteScroll // Set up infinite scroll
          dataLength={recipes.length}
          next={() => {
            setRecipePage(page + 1);
          }}
          hasMore={loading || (!end && !error)}
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
                alt="recipe food preview image"
              />
              <div className="title">{recipe.title}</div>
              <Rating rating={recipe.rating} />
              <div className="description">{recipe.description}</div>
              <div className="readMore">Read more</div>
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
