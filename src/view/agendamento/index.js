import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar';
import RoundRadioButton from '../../components/RoundRadioButton/RoundRadioButton';
import Select from '../../components/Select/Select';
import firebase from '../../config/firebase';
import './agendamento.css';

function Agendamento() {
  const [msgTipo, setMsgTipo] = useState();
  const [predio, setPredio] = useState();
  const [sala, setSala] = useState();
  const [dadosExtras, setDadosExtras] = useState();
  const [funcPessoa, setFuncPessoa] = useState();
  const [pessoaNome, setPessoaNome] = useState();
  const [dataAgendamento, setData] = useState();
  const [horaAgendamentoInicio, setHoraInicio] = useState();
  const [horaAgendamentoFim, setHoraFim] = useState();
  const [salas, setSalas] = useState([]);
  const db = firebase.firestore();

  const [carregando, setCarregando] = useState(0);
  const email = useSelector((state) => state.usuarioEmail);

  useEffect(() => {
    selecionarPredio('areas-administracao');
  }, []);

  function selecionarPredio(nomePredio) {
    setPredio(nomePredio);
    getAmbientes(nomePredio);
  }

  async function getAmbientes(predio) {
    let ambientes;

    await db
      .collection('predios')
      .get()
      .then((resultado) => {
        ambientes = resultado.docs
          .map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
          .filter((ambiente) => {
            return ambiente.predio === predio;
          });
      });

    setSalas(ambientes);
  }

  function buscarConflitos(agendamento, callback) {
    const dataEHora = (data, hora) => new Date(data + 'T' + hora);
    const data = agendamento.dataAgendamento;
    const hInicio = dataEHora(data, agendamento.horaAgendamentoInicio);
    const hFim = dataEHora(data, agendamento.horaAgendamentoFim);

    db.collection('agendamento')
      .where('predio', '==', agendamento.predio)
      .where('sala', '==', agendamento.sala)
      .where('dataAgendamento', '==', data)
      .get()
      .then((queryResult) => {
        const conflitos = queryResult.docs
          .map((d) => d.data())
          .filter((a) => dataEHora(data, a.horaAgendamentoInicio) < hFim)
          .filter((a) => dataEHora(data, a.horaAgendamentoFim) > hInicio);
        if (conflitos.length > 0) {
          throw new Error('Conflito');
        }
        callback();
      })
      .catch(() => {
        setMsgTipo('conflito');
        setCarregando(0);
      });
  }

  function realizarAgendamento(agendamento) {
    db.collection('agendamento')
      .add(agendamento)
      .then(() => {
        setMsgTipo('ok');
        setCarregando(0);
      })
      .catch(() => {
        setMsgTipo('erro');
        setCarregando(0);
      });
  }

  function cadastrar() {
    setCarregando(1);
    const agendamento = {
      predio: predio,
      sala: sala,
      dadosExtras: dadosExtras,
      funcPessoa: funcPessoa,
      pessoaNome: pessoaNome,
      dataAgendamento: dataAgendamento,
      horaAgendamentoInicio: horaAgendamentoInicio,
      horaAgendamentoFim: horaAgendamentoFim,
      responsavelPeloAgendamento: email,
      dataCriado: new Date(),
    };

    buscarConflitos(agendamento, () => {
      realizarAgendamento(agendamento);
    });
  }

  useEffect(() => {
    switch (msgTipo) {
      case 'ok':
        alert('Agendamento realizado com sucesso');
        break;
      case 'erro':
        alert('Erro ao realizar agendamento');
        break;
      case 'conflito':
        alert('O hor??rio selecionado est?? indispon??vel');
        break;
      default:
    }
  }, [msgTipo]);

  return (
    <body>
      <NavBar />
      <div className="bg-dark text-white agendamento-content">
        <form action="">
          <div className="form-group mx-auto text-center">
            <h1>Agendamento de Salas</h1>

            <label>Pr??dio da UTF</label>
            <RoundRadioButton selecionarPredio={selecionarPredio} />

            <div className="input-horizontal">
              <div className="center">
                <label for="enunciado">Lista de salas dispon??veis</label>
                <Select salas={salas} selectOption={setSala} />
              </div>

              <div className="form-group">
                <div>
                  <label for="enunciado">
                    Selecione a data para o agendamento:{' '}
                  </label>
                  <input
                    onChange={(e) => setData(e.target.value)}
                    type="date"
                    min="2021-08-23"
                    className="form-control mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="input-horizontal">
              <div>
                <label for="enunciado">
                  Selecione o hor??rio do inicio do Agendamento:
                </label>
                <input
                  onChange={(e) => setHoraInicio(e.target.value)}
                  type="time"
                  className="form-control mx-auto "
                />
              </div>

              <div>
                <label for="enunciado">
                  Selecione o hor??rio do fim do Agendamento:{' '}
                </label>
                <input
                  onChange={(e) => setHoraFim(e.target.value)}
                  type="time"
                  className="form-control mx-auto "
                />
              </div>
            </div>

            <div className="form-group">
              <label for="enunciado">
                Dados extras do ambiente em quest??o:
              </label>
              <br />

              <textarea
                onChange={(e) => setDadosExtras(e.target.value)}
                name="dadosExtras"
                id="dadosExtras"
                cols="50"
                rows="5"
                placeholder="ex.: n??mero de pessoas, etc"></textarea>
              <br />
            </div>
            <div className="input-horizontal">
              <div className="form-group">
                <label for="enunciado">
                  Fun????o da pessoa requisitando agendamento:{' '}
                </label>
                <select
                  onChange={(e) => setFuncPessoa(e.target.value)}
                  name="funcPessoa"
                  id="funcPessoa"
                  className="form-control mx-auto ">
                  <option disabled selected value>
                    -- Selecione a fun????o da pessoa --
                  </option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="servidor">Servidor</option>
                  <option value="pessoa-de-fora">Pessoa de fora da UTF</option>
                </select>
              </div>

              <div className="form-group">
                <label for="enunciado">Pessoa requisitando agendamento: </label>
                <input
                  onChange={(e) => setPessoaNome(e.target.value)}
                  type="text"
                  className="form-control mx-auto"
                  id="pessoa-resp"
                  name="pessoa-rest"
                  placeholder="ex.: Jo??o Silva"
                />
              </div>
            </div>

            <div>
              {carregando ? (
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only"></span>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-cadastro"
                  onClick={cadastrar}>
                  Cadastro
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </body>
  );
}

export default Agendamento;
