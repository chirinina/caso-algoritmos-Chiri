# Clase 5: torneo de ordenamientos

Quise comparar cuánto tardan tres métodos en ordenar servicios de mi proyecto por especialidad y municipio. Usé esas combinaciones de mi muestra para crear datos de prueba de 10.000, 20.000, 40.000 y 80.000 registros; los tamaños grandes son sintéticos.

Calenté los algoritmos con 2.000 registros, hice 3 corridas por tamaño y saqué el promedio. Comprobé que los datos quedaran ordenados y no se perdiera ningún registro. Medí solo el ordenamiento.

| Registros | Inserción (ms) | Merge Sort (ms) | Quick Sort (ms) |
| ---: | ---: | ---: | ---: |
| 10.000 | 187,876 | 3,900 | 12,389 |
| 20.000 | 761,244 | 8,061 | 8,806 |
| 40.000 | 12.949,987 | 23,145 | 30,981 |
| 80.000 | 66.328,001 | 75,492 | 54,414 |

Con 80.000 registros, inserción tardó unos **66 segundos**, mientras que Merge Sort y Quick Sort tardaron menos de una décima de segundo. Para ordenar muchos servicios convienen más Merge Sort o Quick Sort. En esta prueba Merge Sort ganó hasta 40.000 datos y Quick Sort ganó con 80.000; los tiempos pueden cambiar según el equipo.

Para repetir la prueba: `node practicas/c5/torneo_ordenamientos.js`.
