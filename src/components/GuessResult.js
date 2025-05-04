function GuessResult({ guess, answer }) {
    const compare = (label, guessValue, correctValue) => {
      let color = "red";
  
      if (guessValue === correctValue) {
        color = "green";
      }
  
      return (
        <tr key={label}>
          <td>{label}</td>
          <td style={{ color }}>{guessValue}</td>
        </tr>
      );
    };
  
    return (
      <div>
        <h3>Comparación con el personaje del día</h3>
        <table>
          <tbody>
            {compare("Género", guess.gender, answer.gender)}
            {compare("Raza", guess.species, answer.species)}
            {compare("Origen", guess.origin, answer.origin)}
            {compare("Afiliación", guess.affiliation, answer.affiliation)}
            {compare("Transformación", guess.transformation, answer.transformation)}
            {compare("Atributos", guess.attributes, answer.attributes)}
            {compare("Muertes", guess.deaths, answer.deaths)}
            {compare("Serie", guess.series, answer.series)}
            {compare("Saga Debut", guess.sagaDebut, answer.sagaDebut)}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default GuessResult;
  