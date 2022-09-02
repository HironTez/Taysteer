import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NavLink, useLocation } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Rating } from '../rating/Rating';
import './Recipe.comments.sass';
import { dateToTimeAgo } from '../../scripts/own.module';
import { RecipeCommentT } from '../../types/entities';

export const RecipeComments: React.FC<{
  recipeId: string;
  countOfComments: number;
}> = ({ recipeId, countOfComments }) => {
  const { comments, loading, error, page } = useTypedSelector(
    (state) => state.recipeComments
  );

  const {
    fetchRecipeComments,
    setRecipeCommentsPage,
    clearRecipeCommentsList,
    fetchRecipeCommentAnswers,
  } = useActions();

  useEffect(() => {
    if ((comments?.length ?? 0) < countOfComments && page !== 1) {
      fetchRecipeComments(recipeId, page);
    } // Fetch comments if it's a new page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const location = useLocation();

  // When url changes
  useEffect(() => {
    clearRecipeCommentsList(); // Clear recipes
    fetchRecipeComments(recipeId, 1); // Fetch new recipes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, recipeId]);

  const commentsToElements = (cms: RecipeCommentT[]) => {
    return cms?.map((comment, i) => (
      <div key={i} className="comment-container">
        <div className="comment">
          <NavLink to={`/profile/${comment.user.id}`}>
            <img
              className="profile-picture"
              src={comment.user.image}
              alt="commentator's profile"
            ></img>
          </NavLink>

          <div className="content-wrapper">
            <div className="info">
              <div className="name">{comment.user.name}</div>
              <Rating rating={comment.user.rating} />
              <div className="date">{dateToTimeAgo(comment.date)}</div>
              {comment.updated && <div className="edited">(edited)</div>}
            </div>
            <div className="text">{comment.text}</div>
          </div>
        </div>

        {/* Answers */}
        {Boolean(comment.childComments?.length) && (
          <div className="child-comments-container">
            <div className="vertical-line"></div>
            <div className="child-comments">
              {commentsToElements(comment.childComments)}
            </div>
          </div>
        )}

        {/* Button show more */}
        {comment.countOfChildComments >
          (comment.childComments?.length ?? 0) && (
          <button
            className="answers"
            onClick={() => {
              fetchRecipeCommentAnswers(
                String(comment.id),
                (comment.page ?? 0) + 1
              );
            }}
          >
            {comment.childComments?.length ?? 0
              ? 'View more 🠇'
              : 'View answers 🠇'}
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="recipe-comments-container">
      <div className="title">Comments</div>
      <InfiniteScroll // Set up infinite scroll
        dataLength={comments?.length ?? 0}
        next={() => {
          setRecipeCommentsPage(page + 1);
        }}
        hasMore={
          loading || ((comments?.length ?? 0) < countOfComments && !error)
        }
        loader={<Loading />}
        endMessage={error ? <Error /> : null}
      >
        {commentsToElements(comments)}
      </InfiniteScroll>
    </div>
  );
};
