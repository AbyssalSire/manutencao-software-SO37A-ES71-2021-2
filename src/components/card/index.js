import React, { useEffect, useState } from 'react';
import firebase from '../../config/firebase';
import './card.css';

function Card({
  key,
  nome,
  funcao,
  emailCadastrado,
  telefone,
  avatar,
  dadosExtras,
}) {
  const [urlImagem, setUrlImagem] = useState();

  useEffect(() => {
    firebase
      .storage()
      .ref(`imagens/${avatar}`)
      .getDownloadURL()
      .then((url) => {
        setUrlImagem(url);
      });
  }, []);

  return (
    <div className="cartao">
      <img src={urlImagem} id="imgCard" alt="" className="img-cartao" />

      <div className="">
        <h5>{nome}</h5>
        <h5>Função: {funcao}</h5>
        <p className=" ">
          E-mail para contato: {emailCadastrado} <br />
          Telefone para contato: {telefone} <br />
          Dados extras: {dadosExtras} <br />
        </p>
      </div>
    </div>
  );
}

export default Card;
