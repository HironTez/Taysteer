import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Recipe.list.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import $ from 'jquery';
import { useLocation } from 'react-router-dom'

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

// Horizontal scroll
const horizontalScroll = () => {
  const scrollableDivs = $('.horizontal-scroll');

  const easeFunction = (remainingScrollDistance: number) => {
    return remainingScrollDistance / 15 + 1;
  };

  uss.hrefSetup();

  scrollableDivs?.on('mousewheel', (event) => {
    const originalEvent = event.originalEvent as WheelEvent;
    if (
      originalEvent.deltaY !== 0 &&
      event.currentTarget.classList.contains('active')
    ) {
      event.stopPropagation();
      uss.scrollXBy(originalEvent.deltaY, event.currentTarget, null, false);
    }
  });

  scrollableDivs.each((_index, element) => {
    uss.setXStepLengthCalculator(easeFunction, element);
  });

  // Change the scroll direction relative to the screen width
  const processScrollDirection = () => {
    scrollableDivs.each((_index, element) => {
      if ($(window).width()! < 1000) {
        if (element.classList.contains('active'))
          element.classList.remove('active');
      } else {
        if (!element.classList.contains('active'))
          element.classList.add('active');
      }
    });
  };
  processScrollDirection();

  window.onresize = processScrollDirection;
};
