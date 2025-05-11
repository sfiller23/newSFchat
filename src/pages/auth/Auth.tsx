import { type BaseSyntheticEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImgPreviewButton from "../../components/common/imgPreviewButton/ImgPreviewButton";
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
    e: BaseSyntheticEvent | Event,
    location: string
  ) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const repeatPassword = e.target[2].value;

    if (repeatPassword) {
      if (password !== repeatPassword) {
        alert("Passwords don't match");
        return;
      }
    }

    try {
      let displayName: string = "";

      setIsLoading(true);

      if (location === "/login") {
        await dispatch(loginReq(email, password));
      } else if (location === "/register") {
        displayName = e.target[3].value;
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
            <ImgPreviewButton />
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
