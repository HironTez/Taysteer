import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NavLink, useLocation } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Rating } from '../rating/Rating';
import './Recipe.comments.sass';
import {
  dateToTimeAgo,
  horizontalScrollShadow,
  popup,
} from '../../scripts/own.module';
import { RecipeCommentT } from '../../types/entities';
import $ from 'jquery';

export const RecipeComments: React.FC<{
  recipeId: string;
  countOfComments: number;
}> = ({ recipeId, countOfComments }) => {
  const { comments, loading, error, page } = useTypedSelector(
    (state) => state.recipeComments
  );

  const { account } = useTypedSelector((state) => state.account);

  const {
    resultComment,
    loading: commentUploadingLoading,
    error: _commentUploadingError,
  } = useTypedSelector((state) => state.uploadRecipeComment);

  const {
    fetchRecipeComments,
    setRecipeCommentsPage,
    clearRecipeCommentsList,
    fetchRecipeCommentAnswers,
    fetchUploadRecipeComment,
  } = useActions();

  useEffect(() => {
    if ((comments?.length ?? 0) < countOfComments && page !== 1) {
      fetchRecipeComments(recipeId, page);
    } // Fetch comments if it's a new page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (resultComment) {
      window.location.reload();
    }
  }, [resultComment]);

  const location = useLocation();

  // When url changes
  useEffect(() => {
    clearRecipeCommentsList(); // Clear recipes
    fetchRecipeComments(recipeId, 1); // Fetch new recipes

    horizontalScrollShadow();
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
            className="answers gray"
            onClick={() => {
              if (!loading)
                fetchRecipeCommentAnswers(
                  String(comment.id),
                  (comment.page ?? 0) + 1
                );
            }}
            type="button"
          >
            {comment.childComments?.length ?? 0
              ? 'View more 🠇'
              : 'View answers 🠇'}
          </button>
        )}
      </div>
    ));
  };

  const sendingCommentHandler = () => {
    if (!commentUploadingLoading) {
      const text = $('.new-comment').val()?.toString() ?? '';
      if (text.length <= 500)
        fetchUploadRecipeComment('recipe', recipeId, text);
      else {
        popup('Error', 'error');
      }
    }
  };

  return (
    <div className="recipe-comments-container">
      {(account || Boolean(comments?.length)) && (
        <div className="title">Comments</div>
      )}
      {account && (
        <div className="new-comment-container">
          <input
            className="new-comment"
            type="text"
            placeholder="Enter your comment here"
            maxLength={500}
          />
          <button className="submit orange" onClick={sendingCommentHandler} type="button">
            Publish
          </button>
        </div>
      )}
      {account && Boolean(!comments?.length) && (
        <div className="no-comments">No comments yet</div>
      )}
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
      {commentUploadingLoading && (
        <div className="loading-container">
          <Loading />
        </div>
      )}
    </div>
  );
};
