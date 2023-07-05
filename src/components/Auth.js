import React, { useContext } from "react";

import Card from "./UI/Card";
import "./Auth.css";
import { AuthContext } from "../context/auth-context";

const Auth = (props) => {
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    authContext.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Just Click me!</button>
      </Card>
    </div>
  );
};

export default Auth;
