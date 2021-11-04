import React from 'react';
import css from './Select.module.css';

export default function Select(props) {
  const { salas, selectOption } = props;

  const handleChange = (event) => {
    const option = event.target.value;
    selectOption(option);
    console.log(option);
  };

  return (
    <div className={css.divSelect}>
      <select
        className={css.select}
        onChange={handleChange}
        name="sala"
        id="sala"
        className="form-control mx-auto">
        <option disabled selected value>
          Selecione a sala
        </option>

        {salas.map((sala) => {
          return <option key={sala.id}>{sala.sala}</option>;
        })}
      </select>
    </div>
  );
}
