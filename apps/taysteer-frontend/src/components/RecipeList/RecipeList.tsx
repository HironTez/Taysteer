import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './RecipeList.styles.sass';
import InfiniteScroll from 'react-infinite-scroll-component';
import $ from 'jquery';

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
    <div id="recipes-container" className="horizontal-scroll active">
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

const horizontalScrollScript = () => {
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

  $(window).on('resize', processScrollDirection);
};
