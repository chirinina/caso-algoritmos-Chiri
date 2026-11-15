# Clase 6: costos y elección para mi app

## Costo por recurrencia

El CSV de mi proyecto contiene **20 registros de servicios técnicos**, con especialidad y ubicación; no representa todo Bolivia y no confirmé que todos sigan activos. La tabla calcula comparaciones teóricas para `n=20` y para una futura escala de `n=1.000`; no son segundos ni mediciones hechas sobre esos registros.

- Búsqueda binaria: `B(0)=0`; `B(n)=1+B(⌊n/2⌋)`.
- Merge Sort (peor caso): `M(0)=M(1)=0`; `M(n)=M(⌊n/2⌋)+M(⌈n/2⌉)+(n−1)`.
- Quick Sort balanceado: `Q(0)=Q(1)=0`; `Q(n)=Q(⌊(n−1)/2⌋)+Q(⌈(n−1)/2⌉)+(n−1)`.
- Quick Sort peor caso: `P(0)=P(1)=0`; `P(n)=P(n−1)+(n−1)`.

| n | Binaria, peor caso | Merge Sort, peor caso | Quick Sort, balanceado | Quick Sort, peor caso |
| ---: | ---: | ---: | ---: | ---: |
| 20 (mi muestra) | 5 | 69 | 54 | 190 |
| 1.000 (escala de prueba) | 10 | 8.977 | 7.987 | 499.500 |

Ejemplo para `n=20`: `M(20)=M(10)+M(10)+19=25+25+19=69`. Son conteos de peor caso, excepto la columna de Quick Sort balanceado, que supone mitades parejas. El programa calcula las recurrencias y verifica los resultados sin ordenar datos:

```bash
node practicas/c6/calcular_recurrencias.js
```

## Elección para mi caso

Hoy mi búsqueda ocurre en recomendaciones y publicaciones dispersas; el CSV de 20 registros es solo la muestra del proyecto, no la cantidad total de opciones que una persona revisa. En la app, si consulto esta muestra, **recorrer sus registros uno por uno, O(n), es suficiente**; ordenarlos antes de una búsqueda ocasional no se justifica. Si la lista crece y quiero mantenerla ordenada por especialidad y municipio para reutilizar ese orden, elegiría **Merge Sort**: garantiza `O(n log n)` y conserva el orden de registros con la misma clave.

Como evidencia de escala, en el [torneo de Clase 5](../c5/informe.md) Merge Sort ganó en 3 de 4 tamaños; Quick Sort ganó con 80.000. Esos datos fueron **sintéticos**, basados en las combinaciones de mi muestra. La medición de búsqueda lineal de [Clase 3](../mediciones.md) también usó arreglos sintéticos: al multiplicar `n` por 4, el tiempo creció 4,08 veces. Eso respalda `O(n)` para el algoritmo, pero **no mide** cuánto tarda una persona buscando en redes. El proceso manual está descrito por separado en [mi análisis del caso](../c3/complejidad_proceso.md).
