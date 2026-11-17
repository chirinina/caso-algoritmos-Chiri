Nombre completo: Efrain Chiri Nina

# P1.2 — Curar y medir

En `parcial1.js` pasé la función lenta de la variante A a JavaScript: mantiene los dos bucles y compara cada carnet con los que vienen después.

## Funciones y complejidades

La cura guarda en un `Set` los carnets ya vistos y devuelve `true` si encuentra uno repetido; su tiempo promedio es `O(n)` y usa `O(n)` espacio adicional.

La función por pares cuesta `O(n²)` en el peor caso: si no hay repetidos, compara todos los pares. Ninguna función modifica la lista.

## Pruebas obligatorias

Al ejecutar `node parcial1/parcial1.js`, el programa prueba estos cinco casos con las dos funciones y muestra lo esperado, lo obtenido y si pasó:

| Caso | Entrada | Esperado |
|---|---|---|
| Repetido en el medio | `[7, 3, 9, 3, 5]` | `true` |
| Sin repetidos | `[7, 3, 9, 4, 5]` | `false` |
| Lista vacía | `[]` | `false` |
| Un solo elemento | `[8]` | `false` |
| Repetido en los extremos | `[4, 1, 2, 6, 4]` | `true` |

También comprueba que las funciones no hayan cambiado las entradas.

## Mediciones

Para ejecutar la medición después de las pruebas:

```bash
node parcial1/parcial1.js --medir
```

El programa hace una corrida de calentamiento y luego mide tres corridas por función y tamaño con `performance.now()`; después saca el promedio. Para cada tamaño genera una lista desordenada y sin repetidos, como pide la variante A. Así la función lenta tiene que revisar todos los pares. Los tamaños son `n`, `2n`, `4n` y `8n`.

El tamaño inicial predeterminado es `n = 5.000`. Se puede ajustar sin editar el archivo, por ejemplo:

```bash
PARCIAL_N=2500 node parcial1/parcial1.js --medir
```

Si el último tamaño tarda menos de `500 ms`, prueba duplicando `PARCIAL_N`; si tarda más de `20.000 ms`, prueba reduciéndolo a la mitad. El tiempo puede variar según la computadora y lo que esté ejecutándose.

### Tabla de resultados

La tabla salió al ejecutar `node parcial1/parcial1.js --medir` con Node.js v24.13.0 y el tamaño inicial predeterminado (`n = 5.000`). En otra computadora pueden salir tiempos algo distintos.

| n | Tiempo lenta (ms) | Tiempo curada (ms) | Factor lenta | Factor curada |
|---:|---:|---:|---:|---:|
| 5.000 | 18,480 | 1,719 | — | — |
| 10.000 | 60,492 | 2,533 | 3,27 | 1,47 |
| 20.000 | 209,539 | 3,742 | 3,46 | 1,48 |
| 40.000 | 879,181 | 11,159 | 4,20 | 2,98 |

El factor es el tiempo de una fila dividido entre el de la fila anterior; por eso la primera fila no tiene factor. Si uso otro `PARCIAL_N`, tengo que actualizar la tabla con esa salida.

### Conclusión

En esta ejecución, al duplicar `n`, la función por pares tardó entre 3,27 y 4,20 veces más, como se espera de `O(n²)`. La función con `Set` es de tiempo promedio `O(n)`; sus factores variaron más, así que se nota algo de ruido por la computadora y la ejecución de Node.js. El peor tiempo de la lenta fue **879,181 ms**, con **n = 40.000**.
