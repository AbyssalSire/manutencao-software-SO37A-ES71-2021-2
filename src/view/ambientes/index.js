import React, { useEffect, useState } from 'react';
import Bloco_texto from '../../components/bloco_texto';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';
import './ambientes.css';

function Ambientes() {
  const [ambientes, setAmbientes] = useState([]);

  var listaAmbientes = [];

  useEffect(() => {
    firebase
      .firestore()
      .collection('predios')
      .get()
      .then(async (resultado) => {
        await resultado.docs.forEach((doc) => {
          listaAmbientes.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAmbientes(listaAmbientes);
      });
  });
  return (
    <body>
      <NavBar />
      <div className="ambientes-content bg-dark text-white">
        <h2>Lista de Ambientes</h2>
        <div className="lista">
          {ambientes.map((item) => (
            <Bloco_texto key={item.id} predio={item.predio} sala={item.sala} />
          ))}
        </div>
      </div>
    </body>
  );
}

export default Ambientes;
