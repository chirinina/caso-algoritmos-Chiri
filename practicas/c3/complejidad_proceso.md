# Complejidad de mi búsqueda actual

Hoy la persona busca recomendaciones en redes o WhatsApp, revisa si el servicio corresponde a su especialidad y zona, y luego compara disponibilidad y referencias. Para analizarlo, llamo **n** a la cantidad de publicaciones o prestadores que revisa, y **k** a los que considera adecuados.

| Parte del proceso actual | Trabajo que hago | Costo aproximado |
| :--- | :--- | :--- |
| Revisar opciones | Mirar cada publicación para comprobar especialidad y ubicación | Hasta `n` revisiones: **O(n)** |
| Comparar opciones adecuadas | Revisar disponibilidad y referencias de `k` prestadores | Hasta `k` comparaciones: **O(k)** |
| Proceso completo | Revisar opciones y comparar las adecuadas | **O(n + k)**; como `k ≤ n`, queda **O(n)** |

Si busco una sola opción y paro cuando encuentro una adecuada, el mejor caso es **O(1)** y el peor es **O(n)**. Si quiero comparar todas las opciones adecuadas, tengo que revisar las `n`, por eso el proceso sigue siendo **O(n)**.

Esta es una **estimación del trabajo**, no una medición de minutos ni un conteo observado en redes: hoy la información está dispersa y no tengo una lista única para contarla. El tiempo de espera de respuestas tampoco se expresa con esta O. La estimación de 10 a 30 minutos está pendiente de medir.
