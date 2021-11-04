import React, { useEffect, useState } from 'react';
import Bloco_texto from '../../components/bloco_texto';
import NavBar from '../../components/navbar';
import firebase from '../../config/firebase';

function Ambientes() {
    const [ambientes, setAmbientes] = useState([]);

    var listaAmbientes = [];

    useEffect(() => {
        firebase.firestore().collection('predios').get().then(async (resultado) => {
            await resultado.docs.forEach(doc => {
                listaAmbientes.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            setAmbientes(listaAmbientes);
        })
    });
    return (
        <body>
            <NavBar />
            <div className="col-12 p-3 my-3 bg-dark text-white">
                <div className="row">
                    {
                        ambientes.map(item=><Bloco_texto key={item.id} predio={item.predio} sala={item.sala} />)
                    }
                </div>
            </div>

        </body>
    );
}

export default Ambientes;
