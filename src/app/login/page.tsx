import Form from "../components/form";
import SignOut from "../components/sign-out";

export default function Login() {
  return (
    <div>
      <div>
        <div>
          <h3>Sign In</h3>
          <p>Use your email and password to sign in</p>
        </div>
        <Form type="login" />
        <SignOut />
      </div>
    </div>
  );
}
