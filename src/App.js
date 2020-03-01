import React, { useState, useContext } from "react";

import logo from "./logo.svg";
import "./App.css";

import { useSignIn } from "./hooks/auth";
import UserContext from "./context/UserContext";
import "./index.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useContext(UserContext); // if user -> redirect to ...

  const { signingIn, withEmailAndPassword, error } = useSignIn();

  const login = () => {
    withEmailAndPassword(email, password);
    // history.push("/projects");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        {user && <div>You are already logged in.</div>}

        {!user && (
          <div>
            <div>Login user here</div>
            <div className="flex">
              <input
                onChange={(e: any) => setEmail(e.target.value)}
                value={email}
                placeholder="choose email"
              />
              <input
                onChange={(e: any) => setPassword(e.target.value)}
                value={password}
                placeholder="choose password"
                type="password"
              />
              <button onClick={login} loading={signingIn}>
                Login
              </button>
            </div>
          </div>
        )}
        <div className="flex">{error && <div>{error}</div>}</div>
      </div>
    </div>
  );
}

export default App;
