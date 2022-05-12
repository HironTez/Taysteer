import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './RecipeList.styles.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import $ from 'jquery';

const horizontalScrollScript = () => {
  const scrollableDiv = document.querySelector(
    '#recipes-container.horizontal-scroll'
  ) as HTMLElement;

  const easeFunction = (remainingScrollDistance: number) => {
    return remainingScrollDistance / 15 + 1;
  };

  uss.hrefSetup();

  scrollableDiv?.addEventListener(
    'wheel',
    (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault();
        event.stopPropagation();
        uss.scrollXBy(event.deltaY, scrollableDiv, null, false);
      }
    },
    { passive: false }
  );

  uss.setXStepLengthCalculator(easeFunction, scrollableDiv);
};

export const RecipeList: React.FC = () => {
  const { recipes, loading, error, end, page } = useTypedSelector(
    (state) => state.recipe
  );
  const { fetchRecipes, setRecipesPage } = useActions();

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

  window.onload = horizontalScrollScript;
  
  return (
    <div id="recipes-container" className="horizontal-scroll">
      <InfiniteScroll
        dataLength={recipes.length}
        next={() => {
          setRecipesPage(page + 1);
        }}
        hasMore={loading || (!end && !error)}
        loader={<h1>Loading...</h1>}
        endMessage={error ? <h1>Error!</h1> : <h1>The end</h1>}
        scrollableTarget="recipes-container"
      >
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-min">
            <img className="image" src={recipe.image} alt="avatar" />
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
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
