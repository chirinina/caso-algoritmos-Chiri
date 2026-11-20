"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const ARCHIVO_CSV = path.join(__dirname, "../..", "h1/datos_profesionales.csv");
const TAMANOS = [100, 200, 400, 800];
const CORRIDAS = 3;
const CONSULTAS_POR_CORRIDA = 20_000;
const CONSULTA = { especialidad: "Mecánica", municipio: "El Alto" };

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

function cargarMuestra() {
  const lineas = fs.readFileSync(ARCHIVO_CSV, "utf8").trim().split(/\r?\n/);
  const encabezados = leerCamposCSV(lineas[0]);
  const indices = {
    id: encabezados.indexOf("id"),
    especialidad: encabezados.indexOf("especialidad"),
    municipio: encabezados.indexOf("municipio"),
  };

  if (Object.values(indices).some((indice) => indice === -1)) {
    throw new Error("El CSV debe incluir id, especialidad y municipio.");
  }

  const muestra = lineas.slice(1).map((linea) => {
    const campos = leerCamposCSV(linea);
    return {
      id: campos[indices.id],
      especialidad: campos[indices.especialidad],
      municipio: campos[indices.municipio],
    };
  });

  if (muestra.length === 0) {
    throw new Error("El CSV no contiene registros para medir.");
  }
  return muestra;
}

function generarRegistros(muestra, n) {
  return Array.from({ length: n }, (_, indice) => {
    const base = muestra[indice % muestra.length];
    return {
      ...base,
      id:
        indice < muestra.length
          ? base.id
          : `${base.id}-SYN-${String(indice + 1).padStart(4, "0")}`,
    };
  });
}

function compararClaves(a, b) {
  for (const campo of ["especialidad", "municipio", "id"]) {
    if (a[campo] < b[campo]) return -1;
    if (a[campo] > b[campo]) return 1;
  }
  return 0;
}

function buscarRangoLineal(registros, consulta) {
  return registros.filter(
    (registro) =>
      registro.especialidad === consulta.especialidad &&
      registro.municipio === consulta.municipio,
  );
}

function limiteInferior(registrosOrdenados, clave) {
  let izquierda = 0;
  let derecha = registrosOrdenados.length;

  while (izquierda < derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);
    if (compararClaves(registrosOrdenados[medio], clave) < 0) {
      izquierda = medio + 1;
    } else {
      derecha = medio;
    }
  }
  return izquierda;
}

function buscarRangoOrdenado(registrosOrdenados, consulta) {
  const inicio = limiteInferior(registrosOrdenados, {
    ...consulta,
    id: "",
  });
  const encontrados = [];

  for (let indice = inicio; indice < registrosOrdenados.length; indice += 1) {
    const registro = registrosOrdenados[indice];
    if (
      registro.especialidad !== consulta.especialidad ||
      registro.municipio !== consulta.municipio
    ) {
      break;
    }
    encontrados.push(registro);
  }
  return encontrados;
}

function verificarMismoRango(lineal, ordenado) {
  const idsLineales = lineal.map((registro) => registro.id).sort();
  const idsOrdenados = ordenado.map((registro) => registro.id).sort();
  assert.deepEqual(idsOrdenados, idsLineales);
}

function medirCorrida(busqueda, registros, consulta, cantidadEsperada) {
  let totalEncontrado = 0;
  const inicio = performance.now();

  for (let repeticion = 0; repeticion < CONSULTAS_POR_CORRIDA; repeticion += 1) {
    totalEncontrado += busqueda(registros, consulta).length;
  }

  const duracionMs = performance.now() - inicio;
  assert.equal(
    totalEncontrado,
    cantidadEsperada * CONSULTAS_POR_CORRIDA,
    "La búsqueda no devolvió el mismo número de coincidencias.",
  );
  return (duracionMs * 1_000) / CONSULTAS_POR_CORRIDA;
}

function promedio(valores) {
  return valores.reduce((suma, valor) => suma + valor, 0) / valores.length;
}

function medir() {
  const muestra = cargarMuestra();
  const resultados = [];

  for (const n of TAMANOS) {
    const registros = generarRegistros(muestra, n);
    const ordenados = [...registros].sort(compararClaves);
    const rangoLineal = buscarRangoLineal(registros, CONSULTA);
    const rangoOrdenado = buscarRangoOrdenado(ordenados, CONSULTA);
    verificarMismoRango(rangoLineal, rangoOrdenado);

    medirCorrida(
      buscarRangoLineal,
      registros,
      CONSULTA,
      rangoLineal.length,
    );
    medirCorrida(
      buscarRangoOrdenado,
      ordenados,
      CONSULTA,
      rangoLineal.length,
    );

    const tiemposLineales = [];
    const tiemposOrdenados = [];
    for (let corrida = 0; corrida < CORRIDAS; corrida += 1) {
      const ordenDeMetodos =
        corrida % 2 === 0
          ? [
              [buscarRangoLineal, registros, tiemposLineales],
              [buscarRangoOrdenado, ordenados, tiemposOrdenados],
            ]
          : [
              [buscarRangoOrdenado, ordenados, tiemposOrdenados],
              [buscarRangoLineal, registros, tiemposLineales],
            ];

      for (const [busqueda, datos, tiempos] of ordenDeMetodos) {
        tiempos.push(
          medirCorrida(busqueda, datos, CONSULTA, rangoLineal.length),
        );
      }
    }

    resultados.push({
      n,
      coincidencias: rangoLineal.length,
      lineal: promedio(tiemposLineales),
      ordenado: promedio(tiemposOrdenados),
    });
  }

  console.log(`Node.js ${process.version}`);
  console.log(
    `Consulta: ${CONSULTA.especialidad} en ${CONSULTA.municipio}; ` +
      `${CONSULTAS_POR_CORRIDA.toLocaleString("es")} consultas por corrida.`,
  );
  console.log(
    `Protocolo: 1 calentamiento por método y tamaño; ${CORRIDAS} corridas; ` +
      "promedio. Los datos se preparan antes de cronometrar.",
  );
  console.log("\n| n | Coincidencias | Lineal (µs/consulta) | Ordenado (µs/consulta) | Factor lineal | Factor ordenado |");
  console.log("|---:|---:|---:|---:|---:|---:|");

  resultados.forEach((fila, indice) => {
    const anterior = resultados[indice - 1];
    const factorLineal = anterior
      ? (fila.lineal / anterior.lineal).toFixed(2)
      : "—";
    const factorOrdenado = anterior
      ? (fila.ordenado / anterior.ordenado).toFixed(2)
      : "—";
    console.log(
      `| ${fila.n} | ${fila.coincidencias} | ${fila.lineal.toFixed(4)} | ` +
        `${fila.ordenado.toFixed(4)} | ${factorLineal} | ${factorOrdenado} |`,
    );
  });
}

medir();
