import React from 'react';
import './listaAgendamentos.css';

function ListaAgendamentos({
  status,
  predio,
  sala,
  dataAgendamento,
  horaAgendamentoInicio,
  horaAgendamentoFim,
  pessoaNome,
  responsavelPeloAgendamento,
}) {
  return (
    <div className={`col-md-3 col-sm-12 cartao text-center ${status}`}>
      <div className="texto-body">
        <h5>Sala: {sala}</h5>
        <p className="conteudo-agendamento">
          Prédio: {predio} <br />
          Data agendada: {dataAgendamento} <br />
          Inicio: {horaAgendamentoInicio} <br />
          Fim: {horaAgendamentoFim} <br />
          Agendado para {pessoaNome} <br />
          <br />
          Agendado por: {responsavelPeloAgendamento} <br />
        </p>
      </div>
    </div>
  );
}

export default ListaAgendamentos;
