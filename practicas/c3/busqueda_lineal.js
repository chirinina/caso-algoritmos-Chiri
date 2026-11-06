"use strict";

const { performance } = require("node:perf_hooks");

const TAMANIO_BASE = 1_000_000;
const CORRIDAS = 5;
const DURACION_MINIMA_MS = 20;

function busquedaLineal(datos, objetivo) {
  for (let indice = 0; indice < datos.length; indice += 1) {
    if (datos[indice] === objetivo) return indice;
  }
  return -1;
}

function ejecutarLote(datos, objetivo, repeticiones) {
  let resultado = 0;
  const inicio = performance.now();
  for (let repeticion = 0; repeticion < repeticiones; repeticion += 1) {
    resultado += busquedaLineal(datos, objetivo);
  }
  return { resultado, duracionMs: performance.now() - inicio };
}

function medirCorrida(datos, objetivo) {
  let repeticiones = 1;

  while (true) {
    const calibracion = ejecutarLote(datos, objetivo, repeticiones);
    if (calibracion.resultado !== -repeticiones) {
      throw new Error("La búsqueda no devolvió -1 para un valor ausente.");
    }
    if (calibracion.duracionMs >= DURACION_MINIMA_MS) {
      const medicion = ejecutarLote(datos, objetivo, repeticiones);
      if (medicion.resultado !== -repeticiones) {
        throw new Error("La búsqueda no devolvió -1 para un valor ausente.");
      }
      if (medicion.duracionMs >= DURACION_MINIMA_MS) {
        return medicion.duracionMs / repeticiones;
      }
    }
    repeticiones *= 2;
  }
}

const tamanios = [TAMANIO_BASE, 4 * TAMANIO_BASE, 16 * TAMANIO_BASE];
const promedios = [];

console.log(
  `Búsqueda lineal; objetivo ausente; ${CORRIDAS} corridas por tamaño.`,
);
console.log(`Cada corrida mide al menos ${DURACION_MINIMA_MS} ms.`);
console.log("\n| n | Promedio (ms/búsqueda) | Ratio vs. tamaño anterior |");
console.log("|---:|---:|---:|");

for (const tamanio of tamanios) {
  const datos = Array.from({ length: tamanio }, (_, indice) => indice);
  const objetivo = -1;

  for (let calentamiento = 0; calentamiento < 10; calentamiento += 1) {
    busquedaLineal(datos, objetivo);
  }

  const tiempos = [];
  for (let corrida = 0; corrida < CORRIDAS; corrida += 1) {
    tiempos.push(medirCorrida(datos, objetivo));
  }

  const promedio =
    tiempos.reduce((suma, tiempo) => suma + tiempo, 0) / CORRIDAS;
  const ratio =
    promedios.length === 0 ? "-" : (promedio / promedios.at(-1)).toFixed(2);
  promedios.push(promedio);
  console.log(
    `| ${tamanio.toLocaleString("es")} | ${promedio.toFixed(6)} | ${ratio} |`,
  );
}

console.log(
  "\nLos tiempos dependen del equipo y de los procesos en ejecución.",
);
