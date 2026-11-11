# Búsqueda lineal

Implementación: [busqueda_lineal.js](busqueda_lineal.js). Ejecutar con `node practicas/c3/busqueda_lineal.js`.

Se buscaron valores ausentes en arreglos sintéticos de enteros, así cada búsqueda recorre los `n` elementos. Se calentó cada tamaño con 10 búsquedas y se calibraron las repeticiones para que cada corrida cronometrada dure al menos 20 ms. Se hicieron 5 corridas por tamaño y se calculó su promedio.

|          n | Promedio (ms/búsqueda) | Ratio vs. tamaño anterior |
| ---------: | ---------------------: | ------------------------: |
|  1.000.000 |               2,411414 |                         - |
|  4.000.000 |               9,833240 |                      4,08 |
| 16.000.000 |              40,111019 |                      4,08 |

Al multiplicar `n` por 4, el tiempo promedio creció cerca de 4 veces en ambos casos, como se espera para $O(n)$. Con `n = 100.000` los ratios fueron más variables; al probar arreglos mayores y corridas más largas se estabilizaron. Los tiempos pueden cambiar según el equipo y otros procesos activos.

## Búsqueda binaria a mano

Datos ordenados: `[3, 8, 12, 19, 25, 31, 40, 47]`. En cada paso se revisa el elemento central del rango que todavía puede contener el objetivo. Si el rango tiene dos elementos centrales posibles, se toma el de índice menor (redondeo hacia abajo). Cada elemento central revisado cuenta como un paso.

### Buscar el 31

| Paso | Rango que se revisa (índices) | Medio | Decisión |
| ---: | :--- | ---: | :--- |
| 1 | 0 a 7 | 19 (índice 3) | 31 es mayor; continuar a la derecha |
| 2 | 4 a 7 | 31 (índice 5) | Encontrado |

Se revisaron **2 elementos medios**, así que la búsqueda tomó **2 pasos**.

### Buscar el 5 (no está)

| Paso | Rango que se revisa (índices) | Medio | Decisión |
| ---: | :--- | ---: | :--- |
| 1 | 0 a 7 | 19 (índice 3) | 5 es menor; continuar a la izquierda |
| 2 | 0 a 2 | 8 (índice 1) | 5 es menor; continuar a la izquierda |
| 3 | 0 a 0 | 3 (índice 0) | 5 es mayor; ya no quedan elementos |

Se revisaron **3 elementos medios**. Al terminar el tercer paso, el rango posible queda vacío; por eso se concluye que **el 5 no está**.

### Máximo de pasos

En cada paso se descarta aproximadamente la mitad de los elementos restantes. Para una búsqueda que también puede terminar con el objetivo ausente, el máximo es `ceil(log2(n + 1))` pasos:

| Cantidad de datos (`n`) | Potencias que encierran a `n + 1` | Máximo de pasos |
| ---: | :--- | ---: |
| 1.000 | `2^9 = 512 < 1.001 <= 1.024 = 2^10` | **10** |
| 1.000.000 | `2^19 = 524.288 < 1.000.001 <= 1.048.576 = 2^20` | **20** |

Por eso la búsqueda binaria tiene crecimiento **O(log n)**: aunque el arreglo crece de 1.000 a 1.000.000 de datos (mil veces más), el máximo pasa de 10 a 20 pasos, no de 1.000 a 1.000.000. Esta estrategia requiere que los datos estén ordenados.
