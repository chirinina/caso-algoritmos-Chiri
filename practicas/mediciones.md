# Búsqueda lineal

Implementación: [busqueda_lineal.js](busqueda_lineal.js). Ejecutar con `node practicas/c3/busqueda_lineal.js`.

Se buscaron valores ausentes en arreglos sintéticos de enteros, así cada búsqueda recorre los `n` elementos. Se calentó cada tamaño con 10 búsquedas y se calibraron las repeticiones para que cada corrida cronometrada dure al menos 20 ms. Se hicieron 5 corridas por tamaño y se calculó su promedio.

|          n | Promedio (ms/búsqueda) | Ratio vs. tamaño anterior |
| ---------: | ---------------------: | ------------------------: |
|  1.000.000 |               2,411414 |                         - |
|  4.000.000 |               9,833240 |                      4,08 |
| 16.000.000 |              40,111019 |                      4,08 |

Al multiplicar `n` por 4, el tiempo promedio creció cerca de 4 veces en ambos casos, como se espera para $O(n)$. Con `n = 100.000` los ratios fueron más variables; al probar arreglos mayores y corridas más largas se estabilizaron. Los tiempos pueden cambiar según el equipo y otros procesos activos.
