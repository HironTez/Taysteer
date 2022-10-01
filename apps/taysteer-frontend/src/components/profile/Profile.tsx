import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Error } from '../error.animation/Error.animation';
import profileImage from '../../assets/images/profile.default.jpg';
import './Profile.sass';
import { Rating } from '../rating/Rating';
import { RecipeList } from '../recipe.list/Recipe.list';
import dishIcon from '../../assets/images/dish.svg';
import {
  allowVerticalScroll,
  confirmDialogElement,
} from '../../scripts/own.module';
import deleteIcon from '../../assets/images/navigation/delete.svg';

export const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile, loading, error } = useTypedSelector(
    (state) => state.profile
  );
  const { fetchProfile } = useActions();

  const navigate = useNavigate();

  const {
    success: deleteProfileSuccess,
    loading: deleteProfileLoading,
    error: _deleteProfileError,
  } = useTypedSelector((state) => state.deleteProfile);
  const { fetchDeleteProfile, deleteProfileHandled } = useActions();

  const { account } = useTypedSelector((state) => state.account);

  useEffect(() => {
    if (!loading && !error) fetchProfile(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, userId]);

  useEffect(allowVerticalScroll, []);

  const deleteProfileHandler = () => {
    if (!deleteProfileLoading && !deleteProfileSuccess && profile?.id) {
      confirmDialogElement(
        () => {
          fetchDeleteProfile(profile.id);
        },
        () => {},
        'Delete your profile? All recipes will also be deleted. This action cannot be undone.',
        'Delete',
        'Cancel'
      );
    }
  };

  useEffect(() => {
    if (deleteProfileSuccess) {
      deleteProfileHandled();
      navigate('/');
    }
  }, [deleteProfileSuccess, deleteProfileHandled]);

  if (profile && !loading && !error) {
    return (
      <div className="profile-container">
        <div className="name">
          {profile.name || 'User'}
          {(profile.id === account?.id || account?.login === 'admin') && (
            <div>
              {/* <NavLink to="./edit" className="edit-link">
                <img src={editIcon} alt="edit" className="edit-icon" />
              </NavLink> */}
              <button
                className="delete-button icon-button"
                onClick={deleteProfileHandler}
              >
                <img src={deleteIcon} alt="delete" className="delete-icon" />
              </button>
            </div>
          )}
        </div>
        <div className={`login ${profile.login === 'admin' ? 'admin' : ''}`}>
          @{profile.login}
        </div>
        <div className="description">{profile.description}</div>
        <img
          className="avatar"
          src={profile.image || profileImage}
          alt="profile-avatar"
        ></img>
        <div className="rating-container">
          <Rating rating={profile.rating} />
        </div>
        <div className="count-of-recipes">
          {profile.countOfRecipes}{' '}
          {`recipe${profile.countOfRecipes !== 1 ? 's' : ''}\xa0`}
          <img src={dishIcon} alt="dish" className="symbolIcon" />
        </div>
        <div className="recipes-container">
          <RecipeList userId={profile.id} />
        </div>
      </div>
    );
  } else if (loading) {
    return (
      <div className="profile-container">
        <Loading />
      </div>
    );
  } else {
    return (
      <div className="profile-container">
        <Error />
      </div>
    );
  }
};
