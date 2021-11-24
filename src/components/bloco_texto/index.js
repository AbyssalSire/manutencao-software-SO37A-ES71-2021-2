import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './bloco_texto.css';

function Bloco_texto({ key, predio, sala }) {
  return (
    <div className="cartao">
      <h5>Sala: {sala}</h5>
      <p>Prédio: {predio}</p>

      {useSelector((state) => state.usuarioLogado) > 0 ? (
        <Link to="agendamento" className="btn btn-detalhes">
          Fazer agendamento
        </Link>
      ) : (
        <Link to="login" className="btn btn-detalhes">
          Login
        </Link>
      )}
    </div>
  );
}

export default Bloco_texto;
