import React from 'react';
import css from './Option.module.css';

export default function Option(props) {
  const { children, executarClique, estaSelecionado } = props;

  const handleClick = (event) => {
    executarClique(children);
  };

  return (
    <div
      onClick={handleClick}
      className={`${css.botao} ${
        estaSelecionado ? css.selecionado : css.opcao
      }`}>
      {children}
    </div>
  );
}
