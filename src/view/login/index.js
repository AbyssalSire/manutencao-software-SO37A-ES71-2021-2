import 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';
import './login.css';

function Login() {
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [msgTipo, setMsgTipo] = useState();
  const dispatch = useDispatch();
  const [carregando, setCarregando] = useState(0);

  function validarEmailInput(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      alert('Formato de e-mail incorreto');
      return false;
    }

    return true;
  }

  function autenticar() {
    setCarregando(1);

    if (!validarEmailInput(email)) {
      setCarregando(0);

      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email, senha)
      .then((resultado) => {
        setMsgTipo('ok');
        setCarregando(0);
        setTimeout(() => {
          dispatch({ type: 'LOGIN', usuarioEmail: email });
        }, 10);
      })
      .catch((erro) => {
        setMsgTipo('erro');
        setCarregando(0);
      });
  }

  useEffect(() => {
    switch (msgTipo) {
      case 'erro':
        alert(
          'Não foi possivel completar a operação, por favor tente mais tarde'
        );
        break;
      default:
    }
  }, [msgTipo]);

  return (
    <body>
      <NavBar />
      <form
        className="form-signin mx-auto text-center"
        action="../paginas/index.html">
        <div className="login-content container p-3 my-3 bg-dark text-white">
          {useSelector((state) => state.usuarioLogado) > 0 ? (
            <Redirect to="/"></Redirect>
          ) : null}
          <h1 className="d-flex justify-content-center  mb-3">Login</h1>
          <div className="form-group row d-flex justify-content-center">
            <div className="col-xs-4  mb-3">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control mx-auto"
                placeholder="Email institucional"
                id="inputEmail"
              />
            </div>
          </div>
          <div className="form-group row d-flex justify-content-center">
            <div className="col-xs-4 mb-3">
              <label>Password</label>
              <input
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                className="form-control mx-auto"
                placeholder="Coloque sua senha"
                id="inputPassword"
              />
            </div>
          </div>
          <div className="text-center mb-3">
            {carregando ? (
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              <button
                className="btn btn-login"
                type="button"
                onClick={autenticar}>
                Entrar
              </button>
            )}
          </div>
        </div>
      </form>
    </body>
  );
}

export default Login;
