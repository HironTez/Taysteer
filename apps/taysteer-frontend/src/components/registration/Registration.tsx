import './Registration.sass';

export const Registration: React.FC = () => {
  return (
    <div className="form-container">
      <div className="title">Sign up</div>
      <iframe name="dummy-frame" className="dummy-frame"></iframe>
      <form action="/api/users" method="post" encType="multipart/form-data" target="dummy-frame">
        <label>
          Name
          <input type="text" name="name" placeholder="Type your name"/>
        </label>
        <label>
          Login
          <input type="text" name="login" placeholder="Type your login"/>
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Type your password"/>
        </label>
        <label>
          Repeat your password
          <input type="password" name="re-password" placeholder="Re-type the password"/>
        </label>
        <input type="submit" value="Sign up"/>
      </form>
    </div>
  );
};