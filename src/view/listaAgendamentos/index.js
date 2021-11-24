import React, { useEffect, useState } from 'react';
import ListaAgendamentos from '../../components/listaAgendamentos';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';

const getGrupoAgendamentoVazio = () => new Object({
  'cartao-expirado': [],
  'cartao-reservado': [],
  'cartao-emandamento': []
})

function ListaAgendamento() {
  const [agendamento, setAgendamento] = useState(getGrupoAgendamentoVazio());

  var listaDeAgendamento = [];

  const dataEHora = (data, hora) => new Date(data + 'T' + hora);

  function statusAgendamento(agendamento) {
    const agora = new Date();
    const inicio = dataEHora(agendamento.dataAgendamento, agendamento.horaAgendamentoInicio);
    const fim = dataEHora(agendamento.dataAgendamento, agendamento.horaAgendamentoFim);

    if (agora > inicio && agora < fim) {
      return 'cartao-emandamento';
    }

    if (agora < inicio) {
      return 'cartao-reservado';
    }

    return 'cartao-expirado';
  }

  function ordernarAgendamentos(agendamentos) {

    const mapaDatas = {};
    for (const agendamento of agendamentos) {
      const data = agendamento.dataAgendamento;
      if (!mapaDatas[data]) mapaDatas[data] = [];
      mapaDatas[data].push(agendamento);
    }
    
    const mapaDatasOrdenado = {};
    for (const data in mapaDatas) {
      mapaDatasOrdenado[data] = mapaDatas[data].sort((a, b) => 
        dataEHora(data, a.horaAgendamentoInicio) > dataEHora(data, b.horaAgendamentoInicio))
    }

    const agendamentosOrdenados = []
    for (const data in mapaDatasOrdenado) {
      for (const agendamento of mapaDatasOrdenado[data]) {
        agendamentosOrdenados.push(agendamento);
      }
    }

    return agendamentosOrdenados.sort((a, b) =>
      new Date(a.dataAgendamento) > new Date(b.dataAgendamento));
  }

  function agruparAgendamentos(agendamentos) {
    const grupos = getGrupoAgendamentoVazio();

    for (const agendamento of agendamentos) {
      const status = statusAgendamento(agendamento);
      grupos[status].push(agendamento);
    }

    return grupos;
  }

  useEffect(() => {
    firebase
      .firestore()
      .collection('agendamento')
      .get()
      .then(async (resultado) => {
        await resultado.docs.forEach((doc) => {
          listaDeAgendamento.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAgendamento(
          agruparAgendamentos(
            ordernarAgendamentos(listaDeAgendamento)
          )
        );
      });
  }, []);

  return (
    <body>
      <NavBar />
      <div className="col-12 p-3 my-3 bg-dark text-white">
      <h3>Em andamento</h3>
      <div className="row">
          {agendamento['cartao-emandamento'].map((item) => (
            <ListaAgendamentos
              status={statusAgendamento(item)}
              predio={item.predio}
              sala={item.sala}
              dataAgendamento={item.dataAgendamento}
              horaAgendamentoInicio={item.horaAgendamentoInicio}
              horaAgendamentoFim={item.horaAgendamentoFim}
              pessoaNome={item.pessoaNome}
              responsavelPeloAgendamento={item.responsavelPeloAgendamento}
            />
          ))}
        </div>
        <h3>Reservados</h3>
        <div className="row">
          {agendamento['cartao-reservado'].map((item) => (
            <ListaAgendamentos
              status={statusAgendamento(item)}
              predio={item.predio}
              sala={item.sala}
              dataAgendamento={item.dataAgendamento}
              horaAgendamentoInicio={item.horaAgendamentoInicio}
              horaAgendamentoFim={item.horaAgendamentoFim}
              pessoaNome={item.pessoaNome}
              responsavelPeloAgendamento={item.responsavelPeloAgendamento}
            />
          ))}
        </div>
        <h3>Expirados</h3>
        <div className="row">
          {agendamento['cartao-expirado'].map((item) => (
            <ListaAgendamentos
              status={statusAgendamento(item)}
              predio={item.predio}
              sala={item.sala}
              dataAgendamento={item.dataAgendamento}
              horaAgendamentoInicio={item.horaAgendamentoInicio}
              horaAgendamentoFim={item.horaAgendamentoFim}
              pessoaNome={item.pessoaNome}
              responsavelPeloAgendamento={item.responsavelPeloAgendamento}
            />
          ))}
        </div>
      </div>
    </body>
  );
}

export default ListaAgendamento;
