import { useEffect } from 'react';
import { useActions } from '../../hooks/useAction';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import './Account.sass';

export const Account: React.FC = () => {
  const { account, loading, error } = useTypedSelector(
    (state) => state.account
  );

  const { fetchAccount } = useActions();

  useEffect(() => {
    if (Object.keys(account).length === 0 && !loading && !error) fetchAccount();
  });

  setTimeout(() => {
    
    console.log(account);
  }, 2000);

  return (
    <div className="account">
      <a className="sign-up" href="/register">
        Sign up
      </a>
      <a className="sign-in" href="/login">
        Log in
      </a>
    </div>
  );
};
