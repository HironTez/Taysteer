import { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Account.sass';
import profileImage from '../../assets/images/profile.default.jpg';
import { Link, useLocation } from 'react-router-dom';
import $ from 'jquery';

export const Account: React.FC = () => {
  const { account, loading } = useTypedSelector(
    (state) => state.account
  );

  const { fetchAccount } = useActions();

  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      fetchAccount();
    }
  }, [location]);

  useEffect(() => {
    if (account) {
      $('.min-profile-container').addClass('active');
      $('.authorization-container').removeClass('active');
    } else {
      $('.min-profile-container').removeClass('active');
      $('.authorization-container').addClass('active');
    }
  }, [account]);

  return (
    <div className="account">
      <div className="min-profile-container">
        <Link className="profile" to="/profile">
          <img
            className="avatar"
            src={account?.image || profileImage}
            alt="avatar"
          />
        </Link>
      </div>
      <div className="authorization-container active">
        <Link className="authorization sign-up" to="/register">
          Sign up
        </Link>
        <Link className="authorization sign-in" to="/login">
          Log in
        </Link>
      </div>
    </div>
  );
};
