import React, { useEffect, useState } from 'react';
import ListaAgendamentos from '../../components/listaAgendamentos';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';

function ListaAgendamento() {
  const [agendamento, setAgendamento] = useState([]);

  var listaDeAgendamento = [];

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

        setAgendamento(listaDeAgendamento);
      });
  });

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
