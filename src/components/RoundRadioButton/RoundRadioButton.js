import React, { useState } from 'react';
import Option from './Option/Option';
import css from './RoundRadioButton.module.css';

export default function RoundRadioButton(props) {
  const { selecionarPredio } = props;

  const [predios, setPredios] = useState([
    { nome: 'areas-administracao', estaSelecionado: true },
    { nome: 'bloco-a', estaSelecionado: false },
    { nome: 'bloco-ghi', estaSelecionado: false },
    { nome: 'bloco-k', estaSelecionado: false },
    { nome: 'bloco-s', estaSelecionado: false },
  ]);

  const executarClique = (nomePredio) => {
    const novoPredios = predios.map((predio) => {
      const { nome } = predio;

      if (nomePredio === nome) {
        return { nome, estaSelecionado: true };
      } else {
        return { nome, estaSelecionado: false };
      }
    });

    setPredios(novoPredios);

    selecionarPredio(nomePredio);
  };

  return (
    <div className={css.roundRadioButton}>
      {predios.map((predio) => {
        const { nome, estaSelecionado } = predio;
        return (
          <Option
            key={predio.nome}
            executarClique={executarClique}
            estaSelecionado={estaSelecionado}>
            {nome}
          </Option>
        );
      })}
    </div>
  );
}
