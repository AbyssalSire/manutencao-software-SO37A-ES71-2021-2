import firebase from 'firebase';
import React, { useState } from 'react';
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

  function validarEmailInput(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      throw new Error("Email inválido")
    }
  }

  function validarTelefoneInput(telefone) {
    const regex = /^[(]([0-9]{2})[)]([0-9]{9})$/;
    if (!regex.test(telefone)) {
      throw new Error("Telefone inválido.")
    }
  }

  const mascaraTelefoneRegexpPreenchimento = /^[(]?[0-9]{0,2}[)]?[0-9]{0,9}$/;
  function aplicarMascaraTelefone(novoTelefone) {

    // 1- tentar colocar espaço entre ")" e o proximo numero (lembrar de trocar no regex do validarEmailInput)
    // 2- se o primeiro caractere não for número ou "(" a validação quebra 

    if (novoTelefone.indexOf("(") != 0) {
      novoTelefone = "(" + novoTelefone
    } 

    if (novoTelefone.length > 3 && novoTelefone.indexOf(")") != 3) {
      novoTelefone = novoTelefone.slice(0,3) + ")" + novoTelefone.slice(3)
    }

    if (mascaraTelefoneRegexpPreenchimento.test(novoTelefone)) {
      setTelefone(novoTelefone);
    }
  }

  function validarImagem(event) {
    const arquivo = event.target.files[0];
    const nome = arquivo.name;
    const extensoesPermitidas = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (extensoesPermitidas.exec(nome)) {
      setAvatar(arquivo);
    } else {
      alert('Tipo de arquivo invalido');
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
              onChange={(e) => aplicarMascaraTelefone(e.target.value)}
              type="text"
              value={telefone}
              className="form-control mx-auto"
              id="pessoa-fone"
              name="pessoa-fone"
              placeholder="(11) 912345678"
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
              placeholder="email@provedor.com"
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
        {msgTipo === 'ok' && <span>Cadastrado com sucesso!</span>}
        {msgTipo === 'erro' && <span>Erro ao cadastrar</span>}
      </div>
    </body>
  );
}

export default Cadastro_autorizado;
