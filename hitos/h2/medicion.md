# H2 — Medición

## Qué comparé

Medí la consulta del caso de H1: encontrar todos los servicios de **Mecánica en el municipio de El Alto**. La versión ingenua filtra el arreglo completo; la versión adecuada busca con binaria el inicio del grupo en un arreglo ordenado por especialidad, municipio e identificador, y devuelve sus coincidencias. Antes de medir, el programa [medicion.js](medicion.js) comprueba que ambas versiones devuelvan los mismos identificadores.

El CSV contiene 20 registros de la muestra de H1. Para los tamaños mayores se repiten sus especialidades y municipios con identificadores sintéticos únicos; no se presentan esos registros como prestadores reales. Los tamaños medidos son 100, 200, 400 y 800. Ordenar el arreglo y generar los datos ocurre antes de cronometrar; la tabla mide las consultas sobre un índice ya preparado.

## Protocolo y resultados

Ejecuté `node hitos/h2/medicion.js` con Node.js v24.22.3. Para cada método y tamaño hice una corrida de calentamiento de 20.000 consultas, luego **3 corridas de 20.000 consultas** y promedié el tiempo por consulta. La columna de factor divide el promedio de una fila entre el promedio de la fila anterior; por eso la primera fila no tiene factor.

| n | Coincidencias por consulta | Lineal (µs/consulta) | Arreglo ordenado (µs/consulta) | Factor lineal | Factor ordenado |
|---:|---:|---:|---:|---:|---:|
| 100 | 5 | 0.6978 | 0.9958 | — | — |
| 200 | 10 | 1.1680 | 1.1032 | 1.67 | 1.11 |
| 400 | 20 | 2.2037 | 1.3386 | 1.89 | 1.21 |
| 800 | 40 | 4.1441 | 1.5255 | 1.88 | 1.14 |

Para repetir la medición, ejecuta:

```bash
node hitos/h2/medicion.js
```

## Conclusión

Al duplicar `n`, la búsqueda lineal creció entre **1.67 y 1.89 veces** en las últimas tres filas, cercano a lo esperable para `O(n)`; la primera razón también refleja el ruido de tiempos tan pequeños.  
El arreglo ordenado creció menos en esta prueba, pero su rango cuesta `O(log n + k)`, y `k` también se duplica (de 5 a 40), pues el programa devuelve todas las coincidencias.  
Con 800 registros sintéticos, la consulta ordenada fue aproximadamente **2.72 veces** más rápida en esta ejecución; eso no demuestra por sí solo que convenga para los 20 registros actuales.  
Los tiempos dependen del equipo, Node.js y otros procesos, y no incluyen ordenar ni mantener el índice; son evidencia de esta prueba, no una garantía de rendimiento en producción.
