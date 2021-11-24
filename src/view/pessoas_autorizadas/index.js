import React, { useEffect, useState } from 'react';
import Card from '../../components/card';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';
import './pessoasAutorizadas.css';

function PessoasAutorizadas() {
  const [cards, setCards] = useState([]);

  var listaCards = [];

  useEffect(() => {
    firebase
      .firestore()
      .collection('usuariosCadastrados')
      .get()
      .then(async (resultado) => {
        await resultado.docs.forEach((doc) => {
          listaCards.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setCards(listaCards);
      });
  }, []);

  return (
    <body>
      <NavBar />
      <div className="pessoas-content bg-dark text-white">
        <div className="lista">
          {cards.map((item) => (
            <Card
              key={item.id}
              nome={item.nome}
              funcao={item.funcao}
              emailCadastrado={item.emailCadastrado}
              telefone={item.telefone}
              dadosExtras={item.dadosExtras}
              avatar={item.avatar}
            />
          ))}
        </div>
      </div>
    </body>
  );
}

export default PessoasAutorizadas;
