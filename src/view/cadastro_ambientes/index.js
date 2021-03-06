import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar';
import RoundRadioButton from '../../components/RoundRadioButton/RoundRadioButton';
import './cadastro_ambientes.css';

function Cadastro_ambientes() {
  const [msgTipo, setMsgTipo] = useState();
  const [predio, setPredio] = useState('areas-administracao');
  const [sala, setSala] = useState();
  const [responsavel, setResponsavel] = useState();
  const db = firebase.firestore();
  const email = useSelector((state) => state.usuarioEmail);
  const [carregando, setCarregando] = useState(0);

  function selecionarPredio(nomePredio) {
    setPredio(nomePredio);
    console.log(nomePredio);
  }

  const validarNomeResponsavel = (valor) => {
    const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return regex.test(valor);
  };

  const validarNumeroSala = (valor) => {
    const regex = /^[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return regex.test(valor);
  };

  function cadastrar() {
    setCarregando(1);

    if (!validarNomeResponsavel(responsavel) || !validarNumeroSala(sala)) {
      alert('Há caracteres inválidos nos campos');
      setCarregando(0);

      return;
    }

    db.collection('predios')
      .add({
        predio: predio,
        sala: sala,
        responsavelPeloPredio: responsavel,
        responsavelPeloAgendamento: email,
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
  }

  useEffect(() => {
    switch (msgTipo) {
      case 'ok':
        alert('Ambiente cadastrado com sucesso');
        break;
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
      <div className="bg-dark text-white cadastro-content">
        <div className="row">
          <h1 className="mx-auto text-center titulo-form">
            Cadastro novo ambiente
          </h1>
        </div>

        <form action="../paginas/index.html">
          <div className="form-group mx-auto text-center">
            <label for="enunciado">Prédio da UTF:</label>
            <RoundRadioButton selecionarPredio={selecionarPredio} />
            {/* <select
              onChange={(e) => setPredio(e.target.value)}
              name="predios"
              id="predios"
              className="form-control mx-auto">
              <option disabled selected value>
                -- Selecione uma categoria --
              </option>
              <option value="areas-administracao">Áreas administraticas</option>
              <option value="bloco-a">Bloco A</option>
              <option value="bloco-ghi">Bloco GHI</option>
              <option value="bloco-k">Bloco K</option>
              <option value="bloco-s">Bloco S</option>
            </select> */}
          </div>
          <div className="input-horizontal">
            <div className="form-group  mx-auto text-center">
              <label for="enunciado">Numero da Sala</label>
              <input
                onChange={(e) => setSala(e.target.value)}
                type="text"
                id="sala-numero"
                name="sala-numero"
                className="form-control  mx-auto"
                placeholder="ex.: 1234"
              />
            </div>

            <div className="form-group  mx-auto text-center input-label">
              <label for="enunciado">Responsável pelo prédio</label>
              <input
                onChange={(e) => setResponsavel(e.target.value)}
                type="text"
                id="responsavel"
                name="responsavel"
                className="form-control  mx-auto"
                placeholder="ex.: João Silva"
              />
            </div>
          </div>
          <div className="form-group  mx-auto text-center">
            {carregando ? (
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-block mt-3 mb-5 btn-cadastro"
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

export default Cadastro_ambientes;
