import React, { useEffect, useState } from 'react';
import ListaAgendamentos from '../../components/listaAgendamentos';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';

function ListaAgendamento() {
  const [agendamento, setAgendamento] = useState([]);

  var listaDeAgendamento = [];

  function ordernarAgendamentos(agendamentos) {
    console.log(agendamentos);

    const dataEHora = (data, hora) => new Date(data + 'T' + hora);
    const mapaDatas = {};
    for (const agendamento of agendamentos) {
      const data = agendamento.dataAgendamento;
      if (!mapaDatas[data]) mapaDatas[data] = [];
      mapaDatas[data].push(agendamento);
    }
    console.log(mapaDatas);
    
    const mapaDatasOrdenado = {};
    for (const data in mapaDatas) {
      mapaDatasOrdenado[data] = mapaDatas[data].sort((a, b) => 
        dataEHora(data, a.horaAgendamentoInicio) > dataEHora(data, b.horaAgendamentoInicio))
    }
    console.log(mapaDatas);

    const agendamentosOrdenados = []
    for (const data in mapaDatasOrdenado) {
      for (const agendamento of mapaDatasOrdenado[data]) {
        agendamentosOrdenados.push(agendamento);
      }
    }
    console.log(agendamentosOrdenados);

    return agendamentosOrdenados.sort((a, b) =>
      new Date(a.dataAgendamento) > new Date(b.dataAgendamento));
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
          ordernarAgendamentos(listaDeAgendamento)
        );
      });
  }, []);

  return (
    <body>
      <NavBar />
      <div className="col-12 p-3 my-3 bg-dark text-white">
        <div className="row">
          {agendamento.map((item) => (
            <ListaAgendamentos
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
