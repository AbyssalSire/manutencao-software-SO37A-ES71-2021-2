import React, { useState } from 'react';
import Option from './Option/Option';
import css from './RoundRadioButton.module.css';

export default function RoundRadioButton(props) {
  const { selecionarPredio, prediosFiltrados } = props;

  const PREDIOS_DEFAULT = [
    { nome: 'areas-administracao', estaSelecionado: true },
    { nome: 'bloco-a', estaSelecionado: false },
    { nome: 'bloco-ghi', estaSelecionado: false },
    { nome: 'bloco-k', estaSelecionado: false },
    { nome: 'bloco-s', estaSelecionado: false },
  ];

  const [predios, setPredios] = useState(
    prediosFiltrados === undefined
      ? PREDIOS_DEFAULT
      : prediosFiltrados.map((predio, index) => {
          return { nome: predio, estaSelecionado: index === 0 ? true : false };
        })
  );

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
      {predios.lenght === 0
        ? 'Não há prédios disponíveis para as opções selecionadas'
        : predios.map((predio) => {
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
