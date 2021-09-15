import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./LoginScreen.css";

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      history.push("/");
    }
  }, [history]);

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      );
      localStorage.setItem("authToken", data.token);
      history.push("/");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={submitHandler} className="login-screen__form">
        <h3 className="login-screen__title">Register</h3>
        {error && <span className="error-message">{error}</span>}
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="text"
            required
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={emailChangeHandler}
            tabIndex={1}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password :</label>
          <input
            type="password"
            required
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={passwordChangeHandler}
            tabIndex={2}
          />
          <Link
            to="/forgotPassword"
            className="login-screen__forgotpassword"
            tabIndex={4}
          >
            forgot password?
          </Link>
        </div>
        <button type="submit" className="btn btn-primary" tabIndex={3}>
          Login
        </button>

        <span className="login-screen__subtext">
          Don't have an account ? <Link to="/register">Signup</Link>
        </span>
      </form>
    </div>
  );
};

export default LoginScreen;
