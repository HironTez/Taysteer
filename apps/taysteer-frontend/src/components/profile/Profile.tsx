import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Loading } from '../loading.spinner/Loading.spinner';
import { Error } from '../error.animation/Error.animation';
import profileImage from '../../assets/images/profile.default.jpg';
import './Profile.sass';
import { Rating } from '../rating/Rating';
import { RecipeList } from '../recipe.list/Recipe.list';
import dishIcon from '../../assets/images/dish.svg';
import { allowVerticalScroll } from '../../scripts/own.module';

export const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile, loading, error } = useTypedSelector(
    (state) => state.profile
  );
  const { fetchProfile } = useActions();

  const { account } = useTypedSelector((state) => state.account);

  useEffect(() => {
    if (!loading && !error) fetchProfile(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, userId]);

  useEffect(allowVerticalScroll, []);

  if (profile && !loading && !error) {
    return (
      <div className="profile-container">
        <div className="name">{profile.name || 'User'}</div>
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
