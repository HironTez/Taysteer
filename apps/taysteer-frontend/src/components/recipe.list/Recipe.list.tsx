import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.list.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom'
import { horizontalScroll } from '../../scripts/horizontal.scroll';

export const RecipeList: React.FC = () => {
  const { recipes, loading, error, end, page } = useTypedSelector(
    (state) => state.recipe
  );
  const { fetchRecipes, setRecipesPage } = useActions();

  useEffect(() => {
    if (recipes.length < page * 10) fetchRecipes(page); // Fetch recipes if it's a new page
  }, [page]);

  const location = useLocation();

  useEffect(() => {
    horizontalScroll() // Run the horizontal scroll script when the location changes
  }, [location])

  return (
    <section className="recipes">
      <div id="recipes-container" className="horizontal-scroll">
        <InfiniteScroll // Set up infinite scroll
          dataLength={recipes.length}
          next={() => {
            setRecipesPage(page + 1);
          }}
          hasMore={loading || (!end && !error)}
          loader={<h1>Loading...</h1>}
          endMessage={error ? <h1>Error!</h1> : <h1>The end</h1>}
          scrollableTarget="recipes-container"
        >
          {recipes.map((recipe) => ( // key={recipe.id} // Format recipes
            <a href={`/recipes/${recipe.id}`} key={Math.random()} className="recipe-min">
              <img className="image" src={recipe.image} alt="recipe food preview image" />
              <div className="title">{recipe.title}</div>
              <div className={`rating rating-${recipe.rating}`}>
                <span className="rating-star 1"></span>
                <span className="rating-star 2"></span>
                <span className="rating-star 3"></span>
                <span className="rating-star 4"></span>
                <span className="rating-star 5"></span>
              </div>
              <div className="description">{recipe.description}</div>
              <div className="readMore">Read more</div>
            </a>
          ))}
        </InfiniteScroll>
      </div>
    </section>
  );
};
