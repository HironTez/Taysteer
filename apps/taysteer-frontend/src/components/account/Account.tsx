import { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Account.sass';
import profileImage from '../../assets/images/profile.default.jpg';
import { Link } from 'react-router-dom';

export const Account: React.FC = () => {
  const { account, loading, error } = useTypedSelector(
    (state) => state.account
  );

  const { fetchAccount } = useActions();

  useEffect(() => {
    if (!account && !loading && !error) fetchAccount();
  });

  console.log(account);
  if (account) {
    return (
      <div className="account">
        <Link className="profile" to="/profile">
          <img
            className="avatar"
            src={account.image || profileImage}
            alt="avatar"
          /></Link>
      </div>
    );
  } else {
    return (
      <div className="account">
        <Link className="authorization sign-up" to="/register">
          Sign up
        </Link>
        <Link className="authorization sign-in" to="/login">
          Log in
        </Link>
      </div>
    );
  }
};
