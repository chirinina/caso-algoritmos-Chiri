"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const ARCHIVO_CSV = path.join(__dirname, "../../h1/datos_profesionales.csv");
const CALENTAMIENTO = 20_000;
const REPETICIONES = 300_000;
const CORRIDAS = 3;
const OBJETIVO = "Mecánica\u0000El Alto";

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

function cargarDatos() {
  const lineas = fs.readFileSync(ARCHIVO_CSV, "utf8").trim().split(/\r?\n/);
  const encabezados = leerCamposCSV(lineas[0]);
  const indiceEspecialidad = encabezados.indexOf("especialidad");
  const indiceMunicipio = encabezados.indexOf("municipio");

  if (indiceEspecialidad === -1 || indiceMunicipio === -1) {
    throw new Error("El CSV debe incluir especialidad y municipio.");
  }

  return lineas.slice(1).map((linea) => {
    const campos = leerCamposCSV(linea);
    return {
      clave: `${campos[indiceEspecialidad]}\u0000${campos[indiceMunicipio]}`,
      registro: campos,
    };
  });
}

function buscarLineal(datos, objetivo) {
  const encontrados = [];
  for (const dato of datos) {
    if (dato.clave === objetivo) encontrados.push(dato.registro);
  }
  return encontrados;
}

function buscarBinaria(datosOrdenados, objetivo) {
  let izquierda = 0;
  let derecha = datosOrdenados.length;

  while (izquierda < derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);
    if (datosOrdenados[medio].clave < objetivo) {
      izquierda = medio + 1;
    } else {
      derecha = medio;
    }
  }

  const encontrados = [];
  for (let indice = izquierda; indice < datosOrdenados.length; indice += 1) {
    if (datosOrdenados[indice].clave !== objetivo) break;
    encontrados.push(datosOrdenados[indice].registro);
  }
  return encontrados;
}

function medir(busqueda, datos, objetivo) {
  let cantidadEncontrada = 0;
  const inicio = performance.now();

  for (let repeticion = 0; repeticion < REPETICIONES; repeticion += 1) {
    cantidadEncontrada += busqueda(datos, objetivo).length;
  }

  const duracionMs = performance.now() - inicio;
  return {
    microsegundosPorConsulta: (duracionMs * 1_000) / REPETICIONES,
    cantidadEncontrada,
  };
}

const datos = cargarDatos();
const datosOrdenados = [...datos].sort((a, b) =>
  a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0,
);
const resultadoLineal = buscarLineal(datos, OBJETIVO);
const resultadoBinario = buscarBinaria(datosOrdenados, OBJETIVO);

if (
  resultadoLineal.length !== resultadoBinario.length ||
  resultadoLineal.some(
    (registro) =>
      !resultadoBinario.some((otro) => otro[0] === registro[0]),
  )
) {
  throw new Error("Las búsquedas no devolvieron los mismos registros.");
}

for (let calentamiento = 0; calentamiento < CALENTAMIENTO; calentamiento += 1) {
  buscarLineal(datos, OBJETIVO);
  buscarBinaria(datosOrdenados, OBJETIVO);
}

const tiemposLineal = [];
const tiemposBinaria = [];

for (let corrida = 0; corrida < CORRIDAS; corrida += 1) {
  tiemposLineal.push(medir(buscarLineal, datos, OBJETIVO));
  tiemposBinaria.push(medir(buscarBinaria, datosOrdenados, OBJETIVO));
}

function promedio(tiempos) {
  return (
    tiempos.reduce(
      (suma, tiempo) => suma + tiempo.microsegundosPorConsulta,
      0,
    ) / CORRIDAS
  );
}

const promedioLineal = promedio(tiemposLineal);
const promedioBinaria = promedio(tiemposBinaria);
const cociente = promedioLineal / promedioBinaria;
const coincidenciasPorCorrida = REPETICIONES * resultadoLineal.length;

console.log(`Registros de prueba: ${datos.length} (muestra del proyecto)`);
console.log("Consulta: especialidad Mecánica en el municipio de El Alto");
console.log(
  `Protocolo: ${CALENTAMIENTO.toLocaleString("es")} consultas de calentamiento; ` +
    `${CORRIDAS} corridas de ${REPETICIONES.toLocaleString("es")} consultas; promedio.`,
);
console.log(`Coincidencias encontradas por consulta: ${resultadoLineal.length}`);
console.log("\n| Método | Promedio (µs/consulta) | Cociente vs. binaria |");
console.log("| :--- | ---: | ---: |");
console.log(
  `| Lineal | ${promedioLineal.toFixed(4)} | ${cociente.toFixed(2)} |`,
);
console.log(`| Binaria | ${promedioBinaria.toFixed(4)} | 1,00 |`);
console.log(
  `\nControl: cada método encontró ${coincidenciasPorCorrida.toLocaleString("es")} coincidencias por corrida.`,
);
