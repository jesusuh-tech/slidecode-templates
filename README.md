# Templates de SLIDECODE

El catálogo de [SLIDECODE](https://slidecode.app): un solo estante para los templates que
mantiene el proyecto y los que publica cualquiera. La app lo lee desde acá, lo cachea en
`~/.slidecode/official/` y lo enseña en su galería (Template → «Cambiar…»), así que **todo lo que
entra a `main` le llega a todo el mundo en cuanto abre la galería**.

Un `.sctemplate` es un kit de diseño completo y autocontenido: tema (colores, fuentes y estilos),
layouts pre-compuestos y módulos animados (los `code-block`). Un solo archivo JSON, sin
dependencias externas.

## Cómo publicar el tuyo

1. Créalo en la app: **Archivo → «Crear template desde este deck…»**. Ponle nombre y la línea de
   «para qué sirve» — esa línea es lo que se lee en la galería antes de aplicarlo.
2. Haz *fork* de este repo.
3. Copia tu archivo desde `~/.slidecode/templates/` a `templates/` acá.
4. Agrega su entrada en `index.json`.
5. Abre un *pull request*. Al entrar, aparece en la galería de todo el mundo.

También puedes proponerlo sin git: abre un *issue* adjuntando el `.sctemplate`.

### La entrada en `index.json`

```json
{
  "id": "brutal-grid",
  "name": "Brutal Grid",
  "file": "templates/brutal-grid.sctemplate",
  "version": "1.0.0",
  "author": "tu nombre o tu usuario",
  "description": "Rejilla dura, tipografía condensada y cero degradados."
}
```

`id` y `file` son lo único que la app necesita para bajarlo; `version` es lo que dispara la
actualización en quienes ya lo tienen (súbela cuando reemplaces el archivo). `author` y
`description` están para quien lee el repo — los que la galería enseña de verdad son los que van
dentro del `.sctemplate`, en `meta`.

## Qué se acepta

- **Que valide.** La app parsea el `.sctemplate` antes de cachearlo: uno inválido se ignora en
  silencio, así que un template roto no rompe a nadie… pero tampoco le sirve a nadie.
- **Autocontenido.** Imágenes y fuentes incrustadas (la app ya lo hace al crearlo). Nada de URLs
  externas que se caigan el día que alguien presente sin conexión.
- **Con `meta.author` de quien lo hizo.** Es la firma que aparece en la ficha.
- **Nombre e `id` que no choquen** con uno que ya esté en `index.json`.

La marca **«oficial»** de la galería sale de `meta.author: "slidecode"`, y va solo en los que
mantiene el proyecto: si tu template la trae, te vamos a pedir que la cambies por tu nombre en la
revisión. No es una jerarquía de calidad sino de responsabilidad — los oficiales los arreglamos
nosotros cuando el formato cambia.

## Estructura

```
index.json                      # [{ id, name, file, version, author?, description? }]
templates/<id>.sctemplate       # un template por archivo (JSON autocontenido)
```
