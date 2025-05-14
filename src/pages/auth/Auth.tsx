import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginReq, registerReq } from "../../redux/auth/authThunk";
import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import Card from "../../UI/card/Card";
import Loader from "../../UI/loader/Loader";
import "./_auth.scss";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    location: string
  ) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string | null;
    const username = formData.get("username") as string | null;

    if (repeatPassword) {
      if (password !== repeatPassword) {
        alert("Passwords don't match");
        return;
      }
    }

    try {
      setIsLoading(true);

      if (location === "/login") {
        await dispatch(loginReq(email, password));
      } else if (location === "/register") {
        const displayName = username as string;
        await dispatch(registerReq(email, password, displayName));
      }
      navigate("/");
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const authUrl = location.pathname;

  return isLoading ? (
    <Loader />
  ) : (
    <Card classNames={["auth-card"]}>
      <h2 className="auth-title">SF-Chat</h2>
      <h3 className="auth-subtitle">
        {`${authUrl === "/register" ? "Register" : "Login"}`}
      </h3>
      <form
        className="auth-form"
        onSubmit={(e) => {
          handleSubmit(e, authUrl);
        }}
      >
        <input type="email" name="email" placeholder="e-Mail" required />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <br />
        {authUrl === "/register" && (
          <>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              required
            />
            <br />
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <br />
          </>
        )}
        <button type="submit" className="auth-button">
          {authUrl === "/register" ? "Register" : "Login"}
        </button>
        <p>
          {`${authUrl === "/register" ? "Already registerd?" : "No Account?"}`}{" "}
          <Link
            className="register-link"
            to={`${authUrl !== "/register" ? "/register" : "/login"}`}
          >
            {authUrl !== "/register" ? "Register now" : "Back to Login"}
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default Auth;
