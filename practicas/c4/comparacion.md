# Clase 4: comparación medida de búsquedas

Comparé la búsqueda lineal y la binaria con los **20 registros** de [datos_profesionales.csv](../../h1/datos_profesionales.csv). En ambos casos busqué servicios de **Mecánica en el municipio de El Alto**. La búsqueda lineal revisa los registros uno por uno; para la binaria ordené una vez los registros por especialidad y municipio, encontré el inicio del grupo y recogí sus coincidencias.

## Protocolo y resultados

Calenté ambos métodos con **20.000 consultas**. Después ejecuté **3 corridas de 300.000 consultas por método** y promedié el tiempo por consulta. La preparación y el ordenamiento se hicieron antes de cronometrar; la tabla mide solo las búsquedas.

| Método | Promedio (µs por consulta) | Cociente vs. búsqueda binaria |
| :--- | ---: | ---: |
| Lineal | 0,2419 | **1,15** |
| Binaria | 0,2096 | 1,00 |

En esta prueba, la búsqueda lineal tardó **1,15 veces** lo que tardó la binaria por consulta. El resultado depende del equipo y de la cantidad de datos; con solo 20 registros, la diferencia absoluta es muy pequeña. Para repetir la medición, ejecuté `node practicas/c4/comparacion_busquedas.js`.

## ¿Conviene ordenar primero en mi proceso?

Con mis 20 registros y una búsqueda ocasional, **no conviene ordenar primero**: la búsqueda lineal revisa pocos datos y no requiere preparación.

Si la base crece y voy a hacer muchas búsquedas, **sí puede convenir ordenar una vez y reutilizar ese orden**; así la búsqueda binaria puede compensar el costo inicial.
