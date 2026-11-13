"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const ARCHIVO_CSV = path.join(__dirname, "../../h1/datos_profesionales.csv");
const TAMANIOS = [10_000, 20_000, 40_000, 80_000];
const CORRIDAS = 3;
const CALENTAMIENTO = 2_000;

function leerCamposCSV(linea) {
  const campos = [];
  let campo = "";
  let entreComillas = false;

  for (let indice = 0; indice < linea.length; indice += 1) {
    const caracter = linea[indice];

    if (caracter === '"' && entreComillas && linea[indice + 1] === '"') {
      campo += '"';
      indice += 1;
    } else if (caracter === '"') {
      entreComillas = !entreComillas;
    } else if (caracter === "," && !entreComillas) {
      campos.push(campo);
      campo = "";
    } else {
      campo += caracter;
    }
  }

  campos.push(campo);
  return campos;
}

function cargarClavesDeLaMuestra() {
  const lineas = fs.readFileSync(ARCHIVO_CSV, "utf8").trim().split(/\r?\n/);
  const encabezados = leerCamposCSV(lineas[0]);
  const indiceEspecialidad = encabezados.indexOf("especialidad");
  const indiceMunicipio = encabezados.indexOf("municipio");

  if (indiceEspecialidad === -1 || indiceMunicipio === -1) {
    throw new Error("El CSV debe incluir especialidad y municipio.");
  }

  const claves = lineas.slice(1).map((linea) => {
    const campos = leerCamposCSV(linea);
    return `${campos[indiceEspecialidad]}\u0000${campos[indiceMunicipio]}`;
  });
  const clavesUnicas = [...new Set(claves)].sort();

  if (clavesUnicas.length === 0) {
    throw new Error("No se encontraron servicios en la muestra.");
  }

  const indicePorClave = new Map(
    clavesUnicas.map((clave, indice) => [clave, indice]),
  );

  return {
    claves: claves.map((clave) => indicePorClave.get(clave)),
    cantidadRegistros: claves.length,
    cantidadCombinaciones: clavesUnicas.length,
  };
}

function crearGenerador(seed) {
  let estado = seed >>> 0;
  return function siguiente() {
    estado = (estado + 0x6d2b79f5) | 0;
    let valor = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    valor ^= valor + Math.imul(valor ^ (valor >>> 7), 61 | valor);
    return ((valor ^ (valor >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function crearDatos(tamanio, clavesReales, seed) {
  const aleatorio = crearGenerador(seed);
  const datos = new Array(tamanio);

  for (let indice = 0; indice < tamanio; indice += 1) {
    const clave = clavesReales[Math.floor(aleatorio() * clavesReales.length)];
    datos[indice] = { id: indice, claveOrden: clave };
  }

  return datos;
}

function insertionSort(datos) {
  for (let indice = 1; indice < datos.length; indice += 1) {
    const actual = datos[indice];
    let anterior = indice - 1;

    while (
      anterior >= 0 &&
      datos[anterior].claveOrden > actual.claveOrden
    ) {
      datos[anterior + 1] = datos[anterior];
      anterior -= 1;
    }

    datos[anterior + 1] = actual;
  }

  return datos;
}

function mergeSort(datos) {
  const auxiliar = new Array(datos.length);
  let origen = datos;
  let destino = auxiliar;

  for (let ancho = 1; ancho < datos.length; ancho *= 2) {
    for (let inicio = 0; inicio < datos.length; inicio += ancho * 2) {
      const medio = Math.min(inicio + ancho, datos.length);
      const fin = Math.min(inicio + ancho * 2, datos.length);
      let izquierda = inicio;
      let derecha = medio;
      let salida = inicio;

      while (izquierda < medio && derecha < fin) {
        if (origen[izquierda].claveOrden <= origen[derecha].claveOrden) {
          destino[salida] = origen[izquierda];
          izquierda += 1;
        } else {
          destino[salida] = origen[derecha];
          derecha += 1;
        }
        salida += 1;
      }

      while (izquierda < medio) {
        destino[salida] = origen[izquierda];
        izquierda += 1;
        salida += 1;
      }

      while (derecha < fin) {
        destino[salida] = origen[derecha];
        derecha += 1;
        salida += 1;
      }
    }

    [origen, destino] = [destino, origen];
  }

  if (origen !== datos) {
    for (let indice = 0; indice < datos.length; indice += 1) {
      datos[indice] = origen[indice];
    }
  }

  return datos;
}

function quickSort(datos) {
  if (datos.length < 2) return datos;

  const pendientes = [[0, datos.length - 1]];

  while (pendientes.length > 0) {
    let [izquierda, derecha] = pendientes.pop();

    while (izquierda < derecha) {
      let inicio = izquierda;
      let fin = derecha;
      const pivote = datos[Math.floor((izquierda + derecha) / 2)].claveOrden;

      while (inicio <= fin) {
        while (datos[inicio].claveOrden < pivote) inicio += 1;
        while (datos[fin].claveOrden > pivote) fin -= 1;

        if (inicio <= fin) {
          [datos[inicio], datos[fin]] = [datos[fin], datos[inicio]];
          inicio += 1;
          fin -= 1;
        }
      }

      const tamanioIzquierda = fin - izquierda + 1;
      const tamanioDerecha = derecha - inicio + 1;

      if (tamanioIzquierda < tamanioDerecha) {
        if (inicio < derecha) pendientes.push([inicio, derecha]);
        derecha = fin;
      } else {
        if (izquierda < fin) pendientes.push([izquierda, fin]);
        izquierda = inicio;
      }
    }
  }

  return datos;
}

const ALGORITMOS = [
  { nombre: "Inserción", ordenar: insertionSort },
  { nombre: "Merge Sort", ordenar: mergeSort },
  { nombre: "Quick Sort", ordenar: quickSort },
];

function verificarOrden(datos) {
  for (let indice = 1; indice < datos.length; indice += 1) {
    if (datos[indice - 1].claveOrden > datos[indice].claveOrden) {
      throw new Error(
        `El arreglo no quedó ordenado en el índice ${indice}.`,
      );
    }
  }
}

function verificarRegistros(datos, tamanioEsperado) {
  if (datos.length !== tamanioEsperado) {
    throw new Error("El algoritmo cambió la cantidad de registros.");
  }

  const ids = new Set(datos.map((dato) => dato.id));
  if (ids.size !== tamanioEsperado) {
    throw new Error("El algoritmo perdió o duplicó registros.");
  }

  verificarOrden(datos);
}

function medir(ordenar, datosOriginales) {
  const copia = datosOriginales.slice();
  const inicio = performance.now();
  ordenar(copia);
  const duracionMs = performance.now() - inicio;
  verificarRegistros(copia, datosOriginales.length);
  return duracionMs;
}

function promedio(valores) {
  return valores.reduce((suma, valor) => suma + valor, 0) / valores.length;
}

function calentar(clavesMuestra) {
  const datosCalentamiento = crearDatos(
    CALENTAMIENTO,
    clavesMuestra.claves,
    20261112,
  );

  for (const algoritmo of ALGORITMOS) {
    const copia = datosCalentamiento.slice();
    algoritmo.ordenar(copia);
    verificarRegistros(copia, CALENTAMIENTO);
  }
}

if (require.main === module) {
  const clavesMuestra = cargarClavesDeLaMuestra();
  calentar(clavesMuestra);

  console.log("Torneo de ordenamientos para registros de servicios técnicos");
  console.log(
    `Base: ${clavesMuestra.cantidadRegistros} registros del CSV y ` +
      `${clavesMuestra.cantidadCombinaciones} combinaciones de especialidad y municipio.`,
  );
  console.log(
    "Datos sintéticos: cada registro usa una de esas combinaciones; semilla fija por tamaño.",
  );
  console.log(
    `Protocolo: calentamiento con ${CALENTAMIENTO.toLocaleString("es")} registros, ` +
      `${CORRIDAS} corridas por algoritmo y tamaño; promedio en milisegundos.`,
  );
  console.log(
    "Se verifica orden y conservación de registros antes de iniciar las mediciones y en cada corrida.",
  );
  console.log(
    "El tiempo incluye ordenar una copia, pero no generar los datos ni verificar el resultado.",
  );
  console.log(
    "\n| Registros | Inserción (ms) | Merge Sort (ms) | Quick Sort (ms) |",
  );
  console.log("| ---: | ---: | ---: | ---: |");

  for (const tamanio of TAMANIOS) {
    const datos = crearDatos(
      tamanio,
      clavesMuestra.claves,
      20261112 + tamanio,
    );
    const promedios = new Map(
      ALGORITMOS.map((algoritmo) => [algoritmo.nombre, []]),
    );

    for (const algoritmo of ALGORITMOS) {
      const prueba = datos.slice();
      algoritmo.ordenar(prueba);
      verificarRegistros(prueba, tamanio);
    }

    for (let corrida = 0; corrida < CORRIDAS; corrida += 1) {
      const desplazamiento = corrida % ALGORITMOS.length;

      for (let posicion = 0; posicion < ALGORITMOS.length; posicion += 1) {
        const algoritmo =
          ALGORITMOS[(posicion + desplazamiento) % ALGORITMOS.length];
        promedios.get(algoritmo.nombre).push(
          medir(algoritmo.ordenar, datos),
        );
      }
    }

    console.log(
      `| ${tamanio.toLocaleString("es")} | ` +
        `${promedio(promedios.get("Inserción")).toFixed(3)} | ` +
        `${promedio(promedios.get("Merge Sort")).toFixed(3)} | ` +
        `${promedio(promedios.get("Quick Sort")).toFixed(3)} |`,
    );
  }
}

module.exports = { insertionSort, mergeSort, quickSort, verificarOrden };
