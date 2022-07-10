import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Profile.sass';

export const Profile: React.FC = () => {
  const { userId } = useParams();
  const { profile, loading, error } = useTypedSelector(
    (state) => state.profile
  );
  const { fetchProfile } = useActions();

  useEffect(() => {
    if (!profile && !loading && !error) fetchProfile(userId!);
  });

  return <div>{profile}</div>;
};
