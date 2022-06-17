import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.list.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useLocation } from 'react-router-dom'
import { horizontalScroll } from '../../scripts/horizontal.scroll';
import { Loading } from '../loading.spinner/Loading.spinner';
import { End } from '../end.animation/End.animation';
import { Error } from '../error.animation/Error.animation';
import { Rating } from '../rating/Rating';

export const RecipeList: React.FC = () => {
  const { recipes, loading, error, end, page } = useTypedSelector(
    (state) => state.recipes
  );
  const { fetchRecipes, setRecipesPage } = useActions();

  useEffect(() => {
    if (!end) fetchRecipes(page); // Fetch recipes if it's a new page
  }, [page]);

  const location = useLocation();

  useEffect(() => {
    horizontalScroll() // Run the horizontal scroll script when the location changes
  }, [location])

  return (
    <div className="recipes">
      <div id="recipes-container" className="horizontal-scroll">
        <InfiniteScroll // Set up infinite scroll
          dataLength={recipes.length}
          next={() => {
            setRecipesPage(page + 1);
          }}
          hasMore={loading || (!end && !error)}
          loader={<Loading/>}
          endMessage={error ? <Error/> : <End/>}
          scrollableTarget="recipes-container"
        >
          {recipes.map((recipe) => ( // Format recipes
            <Link to={`/recipes/${recipe.id}`} key={recipe.id} className="recipe-min">
              <img className="image" src={recipe.image} alt="recipe food preview image" />
              <div className="title">{recipe.title}</div>
              <Rating rating={recipe.rating}/>
              <div className="description">{recipe.description}</div>
              <div className="readMore">Read more</div>
            </Link>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};
