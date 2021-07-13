import React, { useState } from 'react';
import client from './feathers';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  function updateField(cb) {
    return ev => {
      cb(ev.target.value);
    };
  }

  function login() {
    return client
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .catch(err => setError(err));
  }

  function signup() {
    return client
      .service('users')
      .create({ email, password })
      .then(() => login());
  }

  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
            <fieldset>
              <input
                className="block"
                type="email"
                name="email"
                placeholder="email"
                onChange={updateField(setEmail)}
              />
            </fieldset>

            <fieldset>
              <input
                className="block"
                type="password"
                name="password"
                placeholder="password"
                onChange={updateField(setPassword)}
              />
            </fieldset>

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => login()}
            >
              Log in
            </button>

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => signup()}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
