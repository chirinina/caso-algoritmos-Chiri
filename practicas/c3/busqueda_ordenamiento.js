"use strict";

function busquedaLineal(datos, objetivo) {
  for (let indice = 0; indice < datos.length; indice += 1) {
    if (datos[indice] === objetivo) return indice;
  }
  return -1;
}

function busquedaBinaria(datosOrdenados, objetivo) {
  let izquierda = 0;
  let derecha = datosOrdenados.length - 1;

  while (izquierda <= derecha) {
    const medio = Math.floor((izquierda + derecha) / 2);
    if (datosOrdenados[medio] === objetivo) return medio;
    if (datosOrdenados[medio] < objetivo) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }

  return -1;
}

function mergeSort(datos) {
  if (datos.length <= 1) return [...datos];

  const medio = Math.floor(datos.length / 2);
  const izquierda = mergeSort(datos.slice(0, medio));
  const derecha = mergeSort(datos.slice(medio));
  const ordenados = [];
  let indiceIzquierda = 0;
  let indiceDerecha = 0;

  while (indiceIzquierda < izquierda.length && indiceDerecha < derecha.length) {
    if (izquierda[indiceIzquierda] <= derecha[indiceDerecha]) {
      ordenados.push(izquierda[indiceIzquierda]);
      indiceIzquierda += 1;
    } else {
      ordenados.push(derecha[indiceDerecha]);
      indiceDerecha += 1;
    }
  }

  return ordenados.concat(
    izquierda.slice(indiceIzquierda),
    derecha.slice(indiceDerecha),
  );
}

function quickSort(datos) {
  const ordenados = [...datos];

  function ordenar(izquierda, derecha) {
    let inicio = izquierda;
    let fin = derecha;
    const pivote = ordenados[Math.floor((izquierda + derecha) / 2)];

    while (inicio <= fin) {
      while (ordenados[inicio] < pivote) inicio += 1;
      while (ordenados[fin] > pivote) fin -= 1;

      if (inicio <= fin) {
        [ordenados[inicio], ordenados[fin]] = [
          ordenados[fin],
          ordenados[inicio],
        ];
        inicio += 1;
        fin -= 1;
      }
    }

    if (izquierda < fin) ordenar(izquierda, fin);
    if (inicio < derecha) ordenar(inicio, derecha);
  }

  if (ordenados.length > 1) ordenar(0, ordenados.length - 1);
  return ordenados;
}

module.exports = {
  busquedaLineal,
  busquedaBinaria,
  mergeSort,
  quickSort,
};

if (require.main === module) {
  const datos = [31, 8, 47, 19, 3, 40, 12, 25];
  const ordenados = mergeSort(datos);

  console.log("Datos originales:", datos);
  console.log("Búsqueda lineal del 31 (índice):", busquedaLineal(datos, 31));
  console.log(
    "Búsqueda binaria del 31 en los datos ordenados (índice):",
    busquedaBinaria(ordenados, 31),
  );
  console.log(
    "Búsqueda binaria del 5 (no encontrado):",
    busquedaBinaria(ordenados, 5),
  );
  console.log("Merge Sort:", ordenados);
  console.log("Quick Sort:", quickSort(datos));
}
