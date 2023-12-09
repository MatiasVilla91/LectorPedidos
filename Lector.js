/*SCROLL PERFECTO!! */
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import './estilos.css';

const LectorFarmacia = () => {
  const [numero, setNumero] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosXlsx, setDatosXlsx] = useState(null);
  const [celdasResaltadas, setCeldasResaltadas] = useState([]);
  const [celdaResaltadaActual, setCeldaResaltadaActual] = useState(null);
  const [celdaCoincidenteRef, setCeldaCoincidenteRef] = useState(null);
  const inputNumeroRef = useRef(null);

  const handleInputChange = (event) => {
    setNumero(event.target.value);
  };

  const handleEnviar = () => {
    alert(`Número enviado: ${numero}`);
    resaltarCelda(numero);
  };

  const handleArchivoSeleccionado = (event) => {
    const archivo = event.target.files[0];
    setArchivoSeleccionado(archivo);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnviar();
    }
  };

  useEffect(() => {
    if (archivoSeleccionado) {
      leerArchivoXLSX(archivoSeleccionado);
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    if (celdaCoincidenteRef) {
      const { fila, columna } = celdaCoincidenteRef;
      const celdaCoincidente = document.getElementById(`celda-${fila}-${columna}`);
      if (celdaCoincidente) {
        setTimeout(() => {
          celdaCoincidente.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
      }
    }
  }, [celdaCoincidenteRef]);

  const leerArchivoXLSX = (archivo) => {
    const lector = new FileReader();
    lector.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const celdas = Object.keys(sheet).filter((key) => key !== '!ref');

      const datos = [];
      let maxFila = 0;
      let maxColumna = 0;

      celdas.forEach((celda) => {
        const { r, c } = XLSX.utils.decode_cell(celda);
        maxFila = Math.max(maxFila, r);
        maxColumna = Math.max(maxColumna, c);
      });

      for (let i = 0; i <= maxFila; i++) {
        const fila = [];
        for (let j = 0; j <= maxColumna; j++) {
          const celda = XLSX.utils.encode_cell({ r: i, c: j });
          const valor = sheet[celda] ? sheet[celda].v : '';
          const valorConvertido = isNaN(valor) ? valor : parseInt(valor, 10);
          fila.push(valorConvertido);
        }
        datos.push(fila);
      }

      setDatosXlsx(datos);
    };

    lector.readAsArrayBuffer(archivo);
  };

  const resaltarCelda = (valor) => {
    const numeroBuscado = parseInt(valor, 10);

    if (datosXlsx) {
      for (let i = 0; i < datosXlsx.length; i++) {
        const fila = datosXlsx[i];
        const columna = fila.findIndex(
          (cellValue) => !isNaN(cellValue) && parseInt(cellValue, 10) === numeroBuscado
        );

        if (columna !== -1) {
          alert(`Número ${valor} encontrado en la fila ${i + 1}, columna ${columna + 1}`);
          setCeldaResaltadaActual({ fila: i, columna: columna });
          const celdaYaResaltada = celdasResaltadas.some(
            (celda) => celda.fila === i && celda.columna === columna
          );
          if (!celdaYaResaltada) {
            setCeldasResaltadas([...celdasResaltadas, { fila: i, columna: columna }]);
          }
          setCeldaCoincidenteRef({ fila: i, columna: columna });
          return;
        }
      }
      alert(`Número ${valor} no encontrado en la tabla`);
    }
  };

  return (
    <div>
      <h1 className="titulo">Lector de Farmacia</h1>
      <label>
        Selecciona un archivo xlsx:
        <input type="file" accept=".xlsx, .xls" onChange={handleArchivoSeleccionado} />
      </label>

      {datosXlsx && (
        <>
          <label>
            Introduce un número:
            <input
              ref={inputNumeroRef}
              type="text"
              value={numero}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
          </label>
          <button onClick={handleEnviar}>Enviar</button>

          <div>
            <h2>Contenido del archivo xlsx:</h2>
            <table className="datos-tabla">
              <thead>
                <tr>
                  {datosXlsx[0].map((valor, index) => (
                    <th key={index}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosXlsx.map((fila, rowIndex) => (
                  <tr key={rowIndex}>
                    {fila.map((valor, colIndex) => (
                      <td
                        key={colIndex}
                        id={`celda-${rowIndex}-${colIndex}`}
                        className={`${
                          celdasResaltadas.some(
                            (celda) => celda.fila === rowIndex && celda.columna === colIndex
                          )
                            ? 'celda-resaltada'
                            : ''
                        } ${
                          celdaResaltadaActual &&
                          celdaResaltadaActual.fila === rowIndex &&
                          celdaResaltadaActual.columna === colIndex
                            ? 'celda-resaltada-actual'
                            : ''
                        }`}
                      >
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LectorFarmacia;

/*MODIFICAMOS EL SCROLL
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './estilos.css';

const LectorFarmacia = () => {
  const [numero, setNumero] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosXlsx, setDatosXlsx] = useState(null);
  const [celdasResaltadas, setCeldasResaltadas] = useState([]);
  const [celdaResaltadaActual, setCeldaResaltadaActual] = useState(null);
  const [celdaCoincidenteRef, setCeldaCoincidenteRef] = useState(null);

  const handleInputChange = (event) => {
    setNumero(event.target.value);
  };

  const handleEnviar = () => {
    //alert(`Número enviado: ${numero}`);
    resaltarCelda(numero);
  };

  const handleArchivoSeleccionado = (event) => {
    const archivo = event.target.files[0];
    setArchivoSeleccionado(archivo);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnviar();
    }
  };

  useEffect(() => {
    if (archivoSeleccionado) {
      leerArchivoXLSX(archivoSeleccionado);
    }
  }, [archivoSeleccionado]);

  useEffect(() => {
    if (celdaCoincidenteRef) {
      const celda = document.getElementById(
        `celda-${celdaCoincidenteRef.fila}-${celdaCoincidenteRef.columna}`
      );
      if (celda) {
        celda.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [celdaCoincidenteRef]);

  const leerArchivoXLSX = (archivo) => {
    const lector = new FileReader();
    lector.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const celdas = Object.keys(sheet).filter((key) => key !== '!ref');

      const datos = [];
      let maxFila = 0;
      let maxColumna = 0;

      celdas.forEach((celda) => {
        const { r, c } = XLSX.utils.decode_cell(celda);
        maxFila = Math.max(maxFila, r);
        maxColumna = Math.max(maxColumna, c);
      });

      for (let i = 0; i <= maxFila; i++) {
        const fila = [];
        for (let j = 0; j <= maxColumna; j++) {
          const celda = XLSX.utils.encode_cell({ r: i, c: j });
          const valor = sheet[celda] ? sheet[celda].v : '';
          const valorConvertido = isNaN(valor) ? valor : parseInt(valor, 10);
          fila.push(valorConvertido);
        }
        datos.push(fila);
      }

      setDatosXlsx(datos);
    };

    lector.readAsArrayBuffer(archivo);
  };

  const resaltarCelda = (valor) => {
    const numeroBuscado = parseInt(valor, 10);

    if (datosXlsx) {
      for (let i = 0; i < datosXlsx.length; i++) {
        const fila = datosXlsx[i];
        const columna = fila.findIndex(
          (cellValue) => !isNaN(cellValue) && parseInt(cellValue, 10) === numeroBuscado
        );

        if (columna !== -1) {
          alert(`Número ${valor} encontrado en la fila ${i + 1}, columna ${columna + 1}`);
          setCeldaResaltadaActual({ fila: i, columna: columna });
          const celdaYaResaltada = celdasResaltadas.some(
            (celda) => celda.fila === i && celda.columna === columna
          );
          if (!celdaYaResaltada) {
            setCeldasResaltadas([...celdasResaltadas, { fila: i, columna: columna }]);
          }
          setCeldaCoincidenteRef({ fila: i, columna: columna });
            // Hacer scroll hacia la celda coincidente
        const celdaCoincidente = document.getElementById(`celda-${i}-${columna}`);
        if (celdaCoincidente) {
          celdaCoincidente.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
          return;
        }
      }
      alert(`Número ${valor} no encontrado en la tabla`);
    }
  };

  return (
    <div>
      <h1 className="titulo">Lector de Farmacia</h1>
      <label>
        Selecciona un archivo xlsx:
        <input type="file" accept=".xlsx, .xls" onChange={handleArchivoSeleccionado} />
      </label>

      {datosXlsx && (
        <>
          <label>
            Introduce un número:
            <input
              type="text"
              value={numero}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
          </label>
          <button onClick={handleEnviar}>Enviar</button>

          <div>
            <h2>Contenido del archivo xlsx:</h2>
            <table className="datos-tabla">
              <thead>
                <tr>
                  {datosXlsx[0].map((valor, index) => (
                    <th key={index}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosXlsx.map((fila, rowIndex) => (
                  <tr key={rowIndex}>
                    {fila.map((valor, colIndex) => (
                      <td
                        key={colIndex}
                        id={`celda-${rowIndex}-${colIndex}`}
                        className={`${
                          celdasResaltadas.some(
                            (celda) => celda.fila === rowIndex && celda.columna === colIndex
                          )
                            ? 'celda-resaltada'
                            : ''
                        } ${
                          celdaResaltadaActual &&
                          celdaResaltadaActual.fila === rowIndex &&
                          celdaResaltadaActual.columna === colIndex
                            ? 'celda-resaltada-actual'
                            : ''
                        }`}
                      >
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LectorFarmacia;

/* NO HACE SCROLL AUN 
import React, { useState, useEffect } from 'react';
  import * as XLSX from 'xlsx';
  import './estilos.css';

  const LectorFarmacia = () => {
    const [numero, setNumero] = useState('');
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [datosXlsx, setDatosXlsx] = useState(null);
    const [celdasResaltadas, setCeldasResaltadas] = useState([]);
    const [mostrarBuscarNumero, setMostrarBuscarNumero] = useState(false);
   


    const handleInputChange = (event) => {
      setNumero(event.target.value);
    };

    const handleEnviar = () => {
      alert(`Número enviado: ${numero}`);
      resaltarCelda(numero);
    };

    const handleArchivoSeleccionado = (event) => {
      const archivo = event.target.files[0];
      setArchivoSeleccionado(archivo);
      setMostrarBuscarNumero(true); // Mostrar la opción de buscar número después de cargar el archivo
    };

    const handleInputKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleEnviar();
      }
    };

    useEffect(() => {
      if (archivoSeleccionado) {
        leerArchivoXLSX(archivoSeleccionado);
      }
    }, [archivoSeleccionado]);

    const leerArchivoXLSX = (archivo) => {
      const lector = new FileReader();
      lector.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const celdas = Object.keys(sheet).filter((key) => key !== '!ref');

        const datos = [];
        let maxFila = 0;
        let maxColumna = 0;

        celdas.forEach((celda) => {
          const { r, c } = XLSX.utils.decode_cell(celda);
          maxFila = Math.max(maxFila, r);
          maxColumna = Math.max(maxColumna, c);
        });

        for (let i = 0; i <= maxFila; i++) {
        const fila = [];
        for (let j = 0; j <= maxColumna; j++) {
        const celda = XLSX.utils.encode_cell({ r: i, c: j });
        const valor = sheet[celda] ? sheet[celda].v : '';
        const valorConvertido = isNaN(valor) ? valor : parseInt(valor, 10);
        fila.push(valorConvertido);
  }
       datos.push(fila);
}

        setDatosXlsx(datos);
      };

      lector.readAsArrayBuffer(archivo);
    };

    const resaltarCelda = (valor) => {
      const numeroBuscado = parseInt(valor, 10);
    
      if (datosXlsx) {
        for (let i = 0; i < datosXlsx.length; i++) {
          const fila = datosXlsx[i];
          const columna = fila.findIndex(
            (cellValue) => !isNaN(cellValue) && parseInt(cellValue, 10) === numeroBuscado
          );
    
          if (columna !== -1) {
            alert(`Número ${valor} encontrado en la fila ${i + 1}, columna ${columna + 1}`);
            const celdaYaResaltada = celdasResaltadas.some(
              (celda) => celda.fila === i && celda.columna === columna
            );
            if (!celdaYaResaltada) {
              setCeldasResaltadas([...celdasResaltadas, { fila: i, columna: columna }]);
            }
            return;
          }
        }
        alert(`Número ${valor} no encontrado en la tabla`);
      }
    };
    
    return (
      <div>
        <h1 className="titulo">Lector de Farmacia</h1>
        {mostrarBuscarNumero ? (
          <>
            <label>
              Introduce un número:
              <input
                type="text"
                value={numero}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
              />
            </label>
            <button onClick={handleEnviar}>Enviar</button>
          </>
        ) : (
          <label>
            Selecciona un archivo xlsx:
            <input type="file" accept=".xlsx, .xls" onChange={handleArchivoSeleccionado} />
          </label>
        )}

        {datosXlsx && (
          <div>
            <h2>Contenido del archivo xlsx:</h2>
            <table className="datos-tabla">
              <thead>
                <tr>
                  {datosXlsx[0].map((valor, index) => (
                    <th key={index}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosXlsx.slice(0).map((fila, rowIndex) => (
                  <tr key={rowIndex}>
                    {fila.map((valor, colIndex) => (
                      <td
                        key={colIndex}
                        className={
                          celdasResaltadas.some(
                            (celda) => celda.fila === rowIndex && celda.columna === colIndex
                          )
                            ? 'celda-resaltada'
                            : ''
                        }
                      >
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  export default LectorFarmacia;


/*  import React, { useState, useEffect } from 'react';
  import * as XLSX from 'xlsx';
  import './estilos.css';

  const LectorFarmacia = () => {
    const [numero, setNumero] = useState('');
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [datosXlsx, setDatosXlsx] = useState(null);
    const [celdasResaltadas, setCeldasResaltadas] = useState([]);
    const [mostrarBuscarNumero, setMostrarBuscarNumero] = useState(false);

    const handleInputChange = (event) => {
      setNumero(event.target.value);
    };

    const handleEnviar = () => {
      alert(`Número enviado: ${numero}`);
      resaltarCelda(numero);
    };

    const handleArchivoSeleccionado = (event) => {
      const archivo = event.target.files[0];
      setArchivoSeleccionado(archivo);
      setMostrarBuscarNumero(true); // Mostrar la opción de buscar número después de cargar el archivo
    };

    const handleInputKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleEnviar();
      }
    };

    useEffect(() => {
      if (archivoSeleccionado) {
        leerArchivoXLSX(archivoSeleccionado);
      }
    }, [archivoSeleccionado]);

    const leerArchivoXLSX = (archivo) => {
      const lector = new FileReader();
      lector.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const celdas = Object.keys(sheet).filter((key) => key !== '!ref');

        const datos = [];
        let maxFila = 0;
        let maxColumna = 0;

        celdas.forEach((celda) => {
          const { r, c } = XLSX.utils.decode_cell(celda);
          maxFila = Math.max(maxFila, r);
          maxColumna = Math.max(maxColumna, c);
        });

        for (let i = 0; i <= maxFila; i++) {
          const fila = [];
          for (let j = 0; j <= maxColumna; j++) {
            const celda = XLSX.utils.encode_cell({ r: i, c: j });
            fila.push(sheet[celda] ? sheet[celda].v : '');
          }
          datos.push(fila);
        }

        setDatosXlsx(datos);
      };

      lector.readAsArrayBuffer(archivo);
    };

    const resaltarCelda = (valor) => {
      if (datosXlsx) {
        for (let i = 0; i < datosXlsx.length; i++) {
          const fila = datosXlsx[i];
          const columna = fila.indexOf(valor);
          if (columna !== -1) {
            alert(`Número ${valor} encontrado en la fila ${i + 1}, columna ${columna + 1}`);
            const celdaYaResaltada = celdasResaltadas.some(
              (celda) => celda.fila === i && celda.columna === columna
            );
            if (!celdaYaResaltada) {
              setCeldasResaltadas([...celdasResaltadas, { fila: i, columna: columna }]);
            }
            return;
          }
        }
        alert(`Número ${valor} no encontrado en la tabla`);
      }
    };

    return (
      <div>
        <h1 className="titulo">Lector de Farmacia</h1>
        {mostrarBuscarNumero ? (
          <>
            <label>
              Introduce un número:
              <input
                type="text"
                value={numero}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
              />
            </label>
            <button onClick={handleEnviar}>Enviar</button>
          </>
        ) : (
          <label>
            Selecciona un archivo xlsx:
            <input type="file" accept=".xlsx, .xls" onChange={handleArchivoSeleccionado} />
          </label>
        )}

        {datosXlsx && (
          <div>
            <h2>Contenido del archivo xlsx:</h2>
            <table className="datos-tabla">
              <thead>
                <tr>
                  {datosXlsx[0].map((valor, index) => (
                    <th key={index}>{valor}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datosXlsx.slice(0).map((fila, rowIndex) => (
                  <tr key={rowIndex}>
                    {fila.map((valor, colIndex) => (
                      <td
                        key={colIndex}
                        className={
                          celdasResaltadas.some(
                            (celda) => celda.fila === rowIndex && celda.columna === colIndex
                          )
                            ? 'celda-resaltada'
                            : ''
                        }
                      >
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  export default LectorFarmacia;


/*
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './estilos.css'; 

const LectorFarmacia = () => {
  const [numero, setNumero] = useState('');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [datosXlsx, setDatosXlsx] = useState(null);
  //const [celdaResaltada, setCeldaResaltada] = useState({ fila: -1, columna: -1 });
  const [celdasResaltadas, setCeldasResaltadas] = useState([]);
  const handleInputChange = (event) => {
    setNumero(event.target.value);
  };

  const handleEnviar = () => {
    alert(`Número enviado: ${numero}`);
    resaltarCelda(numero);
  };

  const handleArchivoSeleccionado = (event) => {
    const archivo = event.target.files[0];
    setArchivoSeleccionado(archivo);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleEnviar();
    }
  };

  useEffect(() => {
    if (archivoSeleccionado) {
      leerArchivoXLSX(archivoSeleccionado);
    }
  }, [archivoSeleccionado]);

//LEER ARCHIVO
  const leerArchivoXLSX = (archivo) => {
    const lector = new FileReader();
    lector.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // Obtener todas las celdas disponibles en la hoja de cálculo
      const celdas = Object.keys(sheet).filter((key) => key !== '!ref');
  
      const datos = [];
      let maxFila = 0;
      let maxColumna = 0;
  
      celdas.forEach((celda) => {
        const { r, c } = XLSX.utils.decode_cell(celda);
        maxFila = Math.max(maxFila, r);
        maxColumna = Math.max(maxColumna, c);
      });
  
      for (let i = 0; i <= maxFila; i++) {
        const fila = [];
        for (let j = 0; j <= maxColumna; j++) {
          const celda = XLSX.utils.encode_cell({ r: i, c: j });
          fila.push(sheet[celda] ? sheet[celda].v : '');
        }
        datos.push(fila);
      }
  
      setDatosXlsx(datos);
    };
  
    lector.readAsArrayBuffer(archivo);
  };
  
//RESALTAR CELDA
  
  
const resaltarCelda = (valor) => {
  if (datosXlsx) {
    for (let i = 0; i < datosXlsx.length; i++) {
      const fila = datosXlsx[i];
      const columna = fila.indexOf(valor);
      if (columna !== -1) {
        alert(`Número ${valor} encontrado en la fila ${i + 1}, columna ${columna + 1}`);
        // Verifica si la celda ya está resaltada
        const celdaYaResaltada = celdasResaltadas.some(
          (celda) => celda.fila === i && celda.columna === columna
        );
        if (!celdaYaResaltada) {
          // Si la celda no está resaltada, agrégala al estado
          setCeldasResaltadas([...celdasResaltadas, { fila: i, columna: columna }]);
        }
        return;
      }
    }
    alert(`Número ${valor} no encontrado en la tabla`);
  }
};
  
  return (
    <div>
      <h1 className="titulo">Lector de Farmacia</h1>
      <label>
        Introduce un número:
        <input
          type="text"
          value={numero}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </label>
      <label>
        Selecciona un archivo xlsx:
        <input type="file" accept=".xlsx, .xls" onChange={handleArchivoSeleccionado} />
      </label>
      <button onClick={handleEnviar}>Enviar</button>

      {datosXlsx && (
        <div>
          <h2>Contenido del archivo xlsx:</h2>
          <table className="datos-tabla">
            <thead>
              <tr>
                {datosXlsx[0].map((valor, index) => (
                  <th key={index}>{valor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {datosXlsx.slice(0).map((fila, rowIndex) => (
    <tr key={rowIndex}>
      {fila.map((valor, colIndex) => (
        <td
          key={colIndex}
          className={
            celdasResaltadas.some((celda) => celda.fila === rowIndex && celda.columna === colIndex)
              ? 'celda-resaltada'
              : ''
          }
        >
          {valor}
        </td>
      ))}
    </tr>
  ))}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LectorFarmacia;
*/
