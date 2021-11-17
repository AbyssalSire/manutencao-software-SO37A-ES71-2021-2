import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navbar';
import './cadastro_autorizado.css';

function Cadastro_autorizado() {
  const [msgTipo, setMsgTipo] = useState();

  const [nome, setNome] = useState();
  const [funcao, setFuncao] = useState();
  const [dadosExtras, setDadosExtras] = useState();
  const [telefone, setTelefone] = useState();
  const [emailCadastrado, setEmailCadastrado] = useState();
  const [avatar, setAvatar] = useState();
  const [carregando, setCarregando] = useState(0);

  const storage = firebase.storage();
  const db = firebase.firestore();

  const validarCampoTexto = (valor) => {
    const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return regex.test(valor);
  };

  function validarEmailInput(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      throw new Error('Email inválido');
    }
  }

  function validarTelefoneInput(telefone) {
    const regex =
      /^[\+]?([0-9]{2,3})?[(]?([0-9]{2})[)]?[ ]?([0-9]{4,5})([0-9]{4})$/;
    if (!regex.test(telefone)) {
      throw new Error('Telefone inválido');
    }
  }

  function validarImagem(event) {
    const arquivo = event.target.files[0];
    const nome = arquivo.name;
    const extensoesPermitidas = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (extensoesPermitidas.exec(nome)) {
      setAvatar(arquivo);
    } else if (event.target.value !== '') {
      setMsgTipo('arqInv');
      event.target.value = '';
    }
  }

  function cadastrar() {
    setCarregando(1);

    try {
      validarEmailInput(emailCadastrado);
      validarTelefoneInput(telefone);
    } catch (e) {
      alert(e.message);
      setCarregando(0);
      return;
    }

    if (!validarCampoTexto(nome)) {
      alert('Há caracteres inválidos nos campos');
      setCarregando(0);

      return;
    }

    storage
      .ref(`imagens/${avatar.name}`)
      .put(avatar)
      .then(() => {
        db.collection('usuariosCadastrados')
          .add({
            nome: nome,
            funcao: funcao,
            dadosExtras: dadosExtras,
            telefone: telefone,
            emailCadastrado: emailCadastrado,
            avatar: avatar.name,
            dataCadastrado: new Date(),
          })
          .then(() => {
            setMsgTipo('ok');
            setCarregando(0);
          })
          .catch(() => {
            setMsgTipo('erro');
            setCarregando(0);
          });
      });
  }

  useEffect(() => {
    switch (msgTipo) {
      case 'ok':
        alert('Pessoa autorizada cadastrado com sucesso');
        break;
      case 'erro':
        alert(
          'Não foi possivel completar a operação, por favor tente mais tarde'
        );
        break;
      case 'arqInv':
        alert('Tipo de arquivo invalido');
        break;
      default:
    }
  }, [msgTipo]);

  return (
    <body>
      <NavBar />
      <div className="container p-3 my-3 bg-dark text-white mx-auto text-center cadastro-content">
        <h1>Cadastro de novo usuário autorizado </h1>

        <form action="../paginas/index.html">
          <div className="form-group">
            <label for="enunciado">Nome:</label>
            <br />
            <input
              onChange={(e) => setNome(e.target.value)}
              type="text"
              className="form-control mx-auto"
              id="pessoa-resp"
              name="pessoa-rest"
            />
            <br />
          </div>
          <div className="form-group">
            <label for="enunciado">Função da pessoa: </label>
            <select
              onChange={(e) => setFuncao(e.target.value)}
              name="func-pessoa"
              className="form-control mx-auto"
              id="func-pessoa">
              <option disabled selected value>
                -- Selecione a função da pessoa --
              </option>
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="servidor">Servidor</option>
              <option value="pessoa-de-fora">Pessoa de fora da UTF</option>
            </select>
          </div>
          <br />
          <div className="form-group">
            <label for="enunciado">Dados extras:</label>
            <br />
            <textarea
              onChange={(e) => setDadosExtras(e.target.value)}
              onChange={(e) => setDadosExtras(e.target.value)}
              name="dadosExtras"
              id="dadosExtras"
              cols="50"
              rows="5"></textarea>
            <br />
            <br />
          </div>
          <div className="form-group">
            <label for="enunciado">Telefone:</label>
            <br />
            <input
              onChange={(e) => setTelefone(e.target.value)}
              type="text"
              className="form-control mx-auto"
              id="pessoa-fone"
              name="pessoa-fone"
            />
            <br />
          </div>
          <div className="form-group">
            <label for="enunciado">E-mail:</label>
            <br />
            <input
              onChange={(e) => setEmailCadastrado(e.target.value)}
              type="text"
              className="form-control mx-auto"
              id="pessoa-email"
              name="pessoa-email"
            />
            <br />
          </div>
          <div className="form-group">
            <label>Upload do avatar</label>
            <input
              onChange={(e) => validarImagem(e)}
              type="file"
              accept="image/*"
              className="form-control mx-auto"
            />
          </div>
          <br />
          <br />
          <div className="row">
            {carregando ? (
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-lg btn-block mt-3 mb-5 btn-cadastro"
                onClick={cadastrar}>
                Cadastro
              </button>
            )}
          </div>
        </form>
      </div>
    </body>
  );
}

export default Cadastro_autorizado;
