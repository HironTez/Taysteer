import { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Account.sass';
import profileImage from '../../assets/images/profile.default.jpg';

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
        <a className="profile" href="/profile">
          <img
            className="avatar"
            src={account.image || profileImage}
            alt="avatar"
          />
        </a>
      </div>
    );
  } else {
    return (
      <div className="account">
        <a className="authorization sign-up" href="/register">
          Sign up
        </a>
        <a className="authorization sign-in" href="/login">
          Log in
        </a>
      </div>
    );
  }
};
