// Nombre completo: Efrain Chiri Nina
"use strict";

const assert = require("node:assert/strict");
const { performance } = require("node:perf_hooks");

function HayRepetidosPorPares(valores) {
  for (let i = 0; i < valores.length; i += 1) {
    for (let j = i + 1; j < valores.length; j += 1) {
      if (valores[i] === valores[j]) {
        return true;
      }
    }
  }
  return false;
}

function HayRepetidosCurado(valores) {
  const vistos = new Set();
  for (const valor of valores) {
    if (vistos.has(valor)) {
      return true;
    }
    vistos.add(valor);
  }
  return false;
}

const casos = [
  { nombre: "Repetido en el medio", valores: [7, 3, 9, 3, 5], esperado: true },
  { nombre: "Sin repetidos", valores: [7, 3, 9, 4, 5], esperado: false },
  { nombre: "Lista vacía", valores: [], esperado: false },
  { nombre: "Un solo elemento", valores: [8], esperado: false },
  { nombre: "Repetido en los extremos", valores: [4, 1, 2, 6, 4], esperado: true },
];

function probarFunciones() {
  const funciones = [
    ["HayRepetidosPorPares", HayRepetidosPorPares],
    ["HayRepetidosCurado", HayRepetidosCurado],
  ];

  for (const caso of casos) {
    for (const [nombre, funcion] of funciones) {
      const entrada = [...caso.valores];
      const obtenido = funcion(entrada);
      const paso =
        obtenido === caso.esperado &&
        entrada.every((valor, indice) => valor === caso.valores[indice]);

      console.log(
        `${caso.nombre} — ${nombre}: esperado=${caso.esperado}, ` +
          `obtenido=${obtenido}, ${paso ? "PASÓ" : "FALLÓ"}`,
      );

      assert.equal(obtenido, caso.esperado, `${nombre}: ${caso.nombre}`);
      assert.deepEqual(entrada, caso.valores, `${nombre} modificó la entrada`);
    }
  }
}

function leerTamanoInicial() {
  const texto = process.env.PARCIAL_N ?? "5000";
  const n = Number(texto);
  if (!Number.isSafeInteger(n) || n < 1) {
    throw new Error("PARCIAL_N debe ser un entero positivo seguro.");
  }
  return n;
}

function medirUnaCorrida(funcion, valores) {
  const inicio = performance.now();
  const resultado = funcion(valores);
  const duracionMs = performance.now() - inicio;
  assert.equal(resultado, false, "La lista de medición debe estar libre de repetidos.");
  return duracionMs;
}

function promedio(valores) {
  return valores.reduce((suma, valor) => suma + valor, 0) / valores.length;
}

function generarSinRepetidos(n, semilla = 42) {
  const datos = Array.from({ length: n }, (_, indice) => indice);
  let estado = semilla >>> 0;

  for (let i = datos.length - 1; i > 0; i -= 1) {
    estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;
    const k = estado % (i + 1);
    [datos[i], datos[k]] = [datos[k], datos[i]];
  }

  return datos;
}

function medirFunciones() {
  const tamanoInicial = leerTamanoInicial();
  const tamanos = [1, 2, 4, 8].map((factor) => tamanoInicial * factor);
  if (tamanos.some((tamano) => !Number.isSafeInteger(tamano))) {
    throw new Error("El tamaño configurado produce un tamaño no seguro.");
  }

  const funciones = [
    ["lenta", HayRepetidosPorPares],
    ["curada", HayRepetidosCurado],
  ];
  const resultados = [];

  for (const n of tamanos) {
    const valores = generarSinRepetidos(n);
    const promedios = {};

    for (const [nombre, funcion] of funciones) {
      funcion(valores);
      const corridas = [];
      for (let corrida = 0; corrida < 3; corrida += 1) {
        corridas.push(medirUnaCorrida(funcion, valores));
      }
      promedios[nombre] = promedio(corridas);
    }

    resultados.push({ n, ...promedios });
  }

  console.log(
    "\nPromedio de 3 corridas (ms); una corrida de calentamiento por función y tamaño.",
  );
  console.log("| n | Tiempo lenta (ms) | Tiempo curada (ms) | Factor lenta | Factor curada |");
  console.log("|---:|---:|---:|---:|---:|");
  resultados.forEach((fila, indice) => {
    const anterior = resultados[indice - 1];
    const factorLenta = anterior ? (fila.lenta / anterior.lenta).toFixed(2) : "—";
    const factorCurada = anterior ? (fila.curada / anterior.curada).toFixed(2) : "—";
    console.log(
      `| ${fila.n} | ${fila.lenta.toFixed(3)} | ${fila.curada.toFixed(3)} | ` +
        `${factorLenta} | ${factorCurada} |`,
    );
  });
}

probarFunciones();

if (process.argv.includes("--medir")) {
  medirFunciones();
}
