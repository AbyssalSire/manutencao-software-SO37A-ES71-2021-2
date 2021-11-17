import React from 'react';
import './listaAgendamentos.css';

function ListaAgendamentos({
  predio,
  sala,
  dataAgendamento,
  horaAgendamentoInicio,
  horaAgendamentoFim,
  pessoaNome,
  responsavelPeloAgendamento,
}) {
  const inicioAgendamento = new Date(
    `${dataAgendamento} ${horaAgendamentoInicio}`
  );
  const fimAgendamento = new Date(`${dataAgendamento} ${horaAgendamentoFim}`);
  const horaAtual = new Date();
  const timediff = (inicioAgendamento - horaAtual) / 1000 / 3600;

  const escolherClasse = () => {
    if (horaAtual > fimAgendamento) {
      return 'cartao-expirado';
    }

    if (inicioAgendamento > horaAtual && 1 < timediff) {
      return 'cartao-reservado';
    }

    return 'cartao-emandamento';
  };

  return (
    <div
      className={`col-md-3 col-sm-12 cartao text-center ${escolherClasse()}`}>
      <div className="texto-body">
        <h5>Sala: {sala}</h5>
        <p className="texto-text text-justify">
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
