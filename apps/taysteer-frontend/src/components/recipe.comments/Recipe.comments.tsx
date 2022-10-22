import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NavLink, useLocation } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Error } from '../error.animation/Error.animation';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Rating } from '../rating/Rating';
import './Recipe.comments.sass';
import {
  confirmDialogElement,
  dateToTimeAgo,
  popup,
} from '../../scripts/own.module';
import { RecipeCommentT } from '../../types/entities';
import $ from 'jquery';
import profileImage from '../../assets/images/profile.default.jpg';

export const RecipeComments: React.FC<{
  recipeId: string;
  countOfComments: number;
}> = ({ recipeId, countOfComments }) => {
  const { comments, loading, error, page } = useTypedSelector(
    (state) => state.recipeComments
  );

  const { account } = useTypedSelector((state) => state.account);

  const {
    result: commentResult,
    loading: commentLoading,
    error: _commentError,
  } = useTypedSelector((state) => state.recipeComment);

  const {
    fetchRecipeComments,
    setRecipeCommentsPage,
    clearRecipeCommentsList,
    fetchRecipeCommentAnswers,
    fetchUploadRecipeComment,
    fetchDeleteRecipeComment,
  } = useActions();

  useEffect(() => {
    if ((comments?.length ?? 0) < countOfComments && page !== 1) {
      fetchRecipeComments(recipeId, page);
    } // Fetch comments if it's a new page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (commentResult) {
      window.location.reload();
    }
  }, [commentResult]);

  const location = useLocation();

  // When url changes
  useEffect(() => {
    clearRecipeCommentsList(); // Clear comments
    fetchRecipeComments(recipeId, 1); // Fetch new comments
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, recipeId]);

  const commentsToElements = (cms: RecipeCommentT[]) => {
    return cms?.map((comment, i) => (
      <div key={i} className="comment-container">
        <div className="comment">
          <NavLink to={`/profile/${comment.user.id}`}>
            <img
              className="profile-picture"
              src={comment.user.image || profileImage}
              alt="commentator's profile"
            ></img>
          </NavLink>

          <div className="content-wrapper">
            <div className="info">
              <div className="name">{comment.user.name || 'User'}</div>
              <Rating rating={comment.user.rating} />
              <div className="date">{dateToTimeAgo(comment.date)}</div>
              {comment.updated && <div className="edited">(edited)</div>}
            </div>
            <div className="text">{comment.text}</div>
          </div>
        </div>

        <div className="edit-comment-container hidden" id={`edit-comment-${i}`}>
          <input
            className="edit-comment"
            type="text"
            placeholder="Enter your comment here"
            maxLength={500}
          />
          <button
            className="submit orange"
            onClick={(e) => {
              confirmDialogElement(
                () => {
                  sendingCommentHandler(e, 'edit', comment.id.toString());
                },
                null,
                'Edit this comment?',
                'Edit',
                'Cancel'
              );
            }}
            type="button"
          >
            Publish
          </button>
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

        {/* Buttons */}
        <div className="additional-buttons">
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
          {account && (
            <button
              className="to-answer gray"
              onClick={(e: React.MouseEvent) => {
                $(`#new-comment-${i}.new-comment-container.hidden`).removeClass(
                  'hidden'
                );
                $(e.target).remove();
              }}
              type="button"
            >
              {'Write an answer ✎'}
            </button>
          )}
          {account && comment.user.id === account.id && (
            <button
              className="edit gray"
              onClick={(e) => {
                const comment = $($('.comment').get(i) as HTMLElement);
                const previousText = comment
                  .children('.content-wrapper')
                  .children('.text')
                  .text();
                const buttons = $(
                  $('.additional-buttons').get(i) as HTMLElement
                );
                comment.addClass('hidden');
                buttons.addClass('hidden');
                $(
                  `#edit-comment-${i}.edit-comment-container.hidden`
                ).removeClass('hidden');
                $(
                  `#edit-comment-${i}.edit-comment-container > .edit-comment`
                ).val(previousText);
              }}
              type="button"
            >
              {'Edit ✎'}
            </button>
          )}
          {account && comment.user.id === account.id && (
            <button
              className="delete red"
              onClick={() => {
                if (!loading) {
                  confirmDialogElement(
                    () => {
                      fetchDeleteRecipeComment(comment.id.toString());
                    },
                    null,
                    'Delete this comment? This action cannot be undone.',
                    'Delete',
                    'Cancel'
                  );
                }
              }}
              type="button"
            >
              {'Delete 🗑'}
            </button>
          )}
        </div>

        <div className="new-comment-container hidden" id={`new-comment-${i}`}>
          <input
            className="new-comment"
            type="text"
            placeholder="Enter your answer here"
            maxLength={500}
          />
          <button
            className="submit orange"
            onClick={(e) => {
              sendingCommentHandler(e, 'answer', comment.id.toString());
            }}
            type="button"
          >
            Publish
          </button>
        </div>
      </div>
    ));
  };

  const sendingCommentHandler = (
    event: React.FormEvent,
    action?: 'answer' | 'edit',
    commentId?: string
  ) => {
    if (!commentLoading) {
      const text = $(event.target).siblings('input').val()?.toString() ?? '';
      if (text.length <= 500 && text.length > 0)
        fetchUploadRecipeComment(
          action === 'edit'
            ? 'edit'
            : action === 'answer'
            ? 'answerComment'
            : 'commentRecipe',
          (action === 'answer' || action === 'edit') && commentId
            ? commentId
            : recipeId,
          text
        );
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
          <button
            className="submit orange"
            onClick={sendingCommentHandler}
            type="button"
          >
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
      {commentLoading && (
        <div className="loading-container">
          <Loading />
        </div>
      )}
    </div>
  );
};
