import { RecipeCommentT } from '../../types/entities';
import {
  RecipeCommentsActions,
  RecipeCommentsActionTypes,
  RecipeCommentsState,
} from '../../types/recipe.comments';

const initialState: RecipeCommentsState = {
  comments: [],
  loading: false,
  error: null,
  page: 1,
};

const searchComment = (
  commentToSearch: RecipeCommentT,
  commentList: RecipeCommentT[],
  callback: (comment: RecipeCommentT) => RecipeCommentT
): RecipeCommentT[] =>
  commentList.map((comment) =>
    comment.id === commentToSearch.id
      ? callback(comment)
      : comment.childComments
      ? {
          ...comment,
          childComments: searchComment(
            commentToSearch,
            comment.childComments,
            callback
          ),
        }
      : comment
  );

const concatChildComments = (
  oldCommentChildren: RecipeCommentT[],
  newCommentChildren: RecipeCommentT[]
): RecipeCommentT[] => {
  const newList = oldCommentChildren
    ? oldCommentChildren.concat(newCommentChildren)
    : newCommentChildren;
  return newList.map((childComment) => {
    const newChildComment = newCommentChildren.filter(
      (comment) => comment.id === childComment.id
    )[0];

    return newChildComment?.childComments
      ? {
          ...childComment,
          ...{
            childComments: concatChildComments(
              childComment.childComments,
              newChildComment.childComments
            ),
          },
        }
      : childComment;
  });
};

export const recipeCommentsReducer = (
  state: RecipeCommentsState = initialState,
  action: RecipeCommentsActions
): RecipeCommentsState => {
  switch (action.type) {
    case RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS:
      return { ...state, loading: true, error: null };
    case RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: state.comments.some((item) => action.payload.includes(item))
          ? state.comments.concat(action.payload)
          : action.payload,
        loading: false,
        error: null,
      };
    case RecipeCommentsActionTypes.FETCH_RECIPE_COMMENTS_ERROR:
      return { ...state, loading: false, error: action.payload };
    case RecipeCommentsActionTypes.CLEAR_RECIPE_COMMENT_LIST:
      state.comments = [];
      return { ...state, comments: [], page: 1 };
    case RecipeCommentsActionTypes.SET_RECIPE_COMMENTS_PAGE:
      return { ...state, page: action.payload };
    case RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS:
      return { ...state, loading: true, error: null };
    case RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_SUCCESS:
      return {
        ...state,
        comments: searchComment(action.payload, state.comments, (comment) => {
          return {
            ...comment,
            ...{
              childComments: concatChildComments(
                comment.childComments,
                action.payload.childComments
              ),
              page: action.payload.page,
            },
          };
        }),
        loading: false,
      };
    case RecipeCommentsActionTypes.FETCH_COMMENT_ANSWERS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
