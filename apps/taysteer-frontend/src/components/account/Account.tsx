import './Account.sass';

export const Account: React.FC = () => {
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
