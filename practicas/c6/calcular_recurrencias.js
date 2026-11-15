"use strict";

const TAMANIOS = [20, 1_000];
const QUICK_BALANCEADO_ESPERADO = new Map([
  [20, 54],
  [1_000, 7_987],
]);
const FORMATO_NUMERO = new Intl.NumberFormat("es-BO");

function nivelesDeMezcla(n) {
  let niveles = 0;
  let potencia = 1;
  while (potencia < n) {
    potencia *= 2;
    niveles += 1;
  }
  return { niveles, potencia };
}

function busquedaBinariaRecurrencia(n) {
  let comparaciones = 0;
  while (n > 0) {
    comparaciones += 1;
    n = Math.floor(n / 2);
  }
  return comparaciones;
}

function mergeSortRecurrencia(n, memo = new Map([[0, 0], [1, 0]])) {
  if (memo.has(n)) return memo.get(n);
  const izquierda = Math.floor(n / 2);
  const derecha = Math.ceil(n / 2);
  const comparaciones =
    mergeSortRecurrencia(izquierda, memo) +
    mergeSortRecurrencia(derecha, memo) +
    (n - 1);
  memo.set(n, comparaciones);
  return comparaciones;
}

function quickSortBalanceadoRecurrencia(n, memo = new Map([[0, 0], [1, 0]])) {
  if (memo.has(n)) return memo.get(n);
  const izquierda = Math.floor((n - 1) / 2);
  const derecha = Math.ceil((n - 1) / 2);
  const comparaciones =
    quickSortBalanceadoRecurrencia(izquierda, memo) +
    quickSortBalanceadoRecurrencia(derecha, memo) +
    (n - 1);
  memo.set(n, comparaciones);
  return comparaciones;
}

function quickSortPeorCasoRecurrencia(n, memo = new Map([[0, 0], [1, 0]])) {
  if (memo.has(n)) return memo.get(n);
  const comparaciones = quickSortPeorCasoRecurrencia(n - 1, memo) + (n - 1);
  memo.set(n, comparaciones);
  return comparaciones;
}

function verificarFormulas(n, valores) {
  const { niveles, potencia } = nivelesDeMezcla(n);
  const binariaEsperada = n === 0 ? 0 : Math.floor(Math.log2(n)) + 1;
  const mergeEsperada = n * niveles - potencia + 1;
  const quickPeorEsperado = (n * (n - 1)) / 2;

  if (
    valores.binaria !== binariaEsperada ||
    valores.merge !== mergeEsperada ||
    valores.quickPeor !== quickPeorEsperado
  ) {
    throw new Error(`La verificación de recurrencias falló para n=${n}.`);
  }
}

console.log("Comparaciones exactas calculadas con recurrencias (no se ordenan datos).");
console.log("| n | Binaria, peor caso | Merge Sort, peor caso | Quick Sort, balanceado* | Quick Sort, peor caso* |");
console.log("| ---: | ---: | ---: | ---: | ---: |");

for (const n of TAMANIOS) {
  const valores = {
    binaria: busquedaBinariaRecurrencia(n),
    merge: mergeSortRecurrencia(n),
    quickBalanceado: quickSortBalanceadoRecurrencia(n),
    quickPeor: quickSortPeorCasoRecurrencia(n),
  };
  verificarFormulas(n, valores);
  if (valores.quickBalanceado !== QUICK_BALANCEADO_ESPERADO.get(n)) {
    throw new Error(`La verificación de Quick Sort balanceado falló para n=${n}.`);
  }
  console.log(
    `| ${FORMATO_NUMERO.format(n)} | ${FORMATO_NUMERO.format(valores.binaria)} | ` +
      `${FORMATO_NUMERO.format(valores.merge)} | ` +
      `${FORMATO_NUMERO.format(valores.quickBalanceado)} | ` +
      `${FORMATO_NUMERO.format(valores.quickPeor)} |`,
  );
}

console.log(
  "\n*Quick Sort usa el modelo de partición con n-1 comparaciones; el caso balanceado supone mitades lo más parejas posible.",
);
