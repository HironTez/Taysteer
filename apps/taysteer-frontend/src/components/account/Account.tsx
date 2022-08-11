import { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Account.sass';
import profileImage from '../../assets/images/profile.default.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { popup } from '../../scripts/own.module';

export const Account: React.FC = () => {
  const { account, loading } = useTypedSelector((state) => state.account);

  const { fetchAccount } = useActions();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update auth status
    if (!loading) {
      fetchAccount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Change active html element
  useEffect(() => {
    $('.account > *').removeClass('active');
    if (location.pathname === '/profile') {
      $('.deauthorization-container').addClass('active');
    } else if (account) {
      $('.min-profile-container').addClass('active');
    } else {
      $('.authorization-container').addClass('active');
    }
  }, [account, location]);

  const logOut = () => {
    $.ajax({ url: '/api/logout', method: 'POST' })
      .done(() => {
        fetchAccount();
        navigate('/');
      })
      .fail(() => {
        popup('Error on logout. Please try again later.', 'error');
      });
  };

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
      <div className="deauthorization-container">
        <button className="logout" onClick={logOut}>Log out</button>
      </div>
    </div>
  );
};
