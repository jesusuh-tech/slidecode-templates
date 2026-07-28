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
3. Copia tu archivo desde `~/.slidecode/templates/` a `templates/` acá. El archivo tiene que
   llamarse igual que su `meta.id` (`brutal-grid.sctemplate` ↔ `"id": "brutal-grid"`).
4. Abre un *pull request*. Al entrar, aparece en la galería de todo el mundo.

**No toques `index.json`.** Se regenera solo desde `templates/` cuando tu PR entra a `main`
(workflow `índice`) — es un archivo derivado, como un `dist/`. Editarlo a mano es lo que provocaba
conflictos: todas las publicaciones añadían su entrada al FINAL del mismo array, así que dos
templates propuestos a la vez chocaban en las mismas líneas. Con un archivo nuevo por template, no
hay nada que chocar.

También puedes proponerlo sin git: abre un *issue* adjuntando el `.sctemplate`.

### El `meta` de tu template

Todo lo que la galería enseña sale del `meta` que va DENTRO del `.sctemplate`, y de ahí sale también
el índice:

```json
"meta": {
  "id": "brutal-grid",
  "name": "Brutal Grid",
  "author": "tu nombre o tu usuario",
  "description": "Rejilla dura, tipografía condensada y cero degradados.",
  "version": "1.0.0"
}
```

`id` y `name` son obligatorios. `version` es lo que dispara la actualización en quienes ya lo
tienen: **súbela cada vez que reemplaces el archivo**, o quien lo tenga cacheado no se bajará tu
cambio nunca (la app cachea por versión). `author` es la firma de la ficha y `description` es la
línea de «para qué sirve» que se lee antes de aplicarlo.

## Qué se acepta

- **Que valide.** La app parsea el `.sctemplate` antes de cachearlo: uno inválido se ignora en
  silencio, así que un template roto no rompe a nadie… pero tampoco le sirve a nadie.
- **Autocontenido.** Imágenes y fuentes incrustadas (la app ya lo hace al crearlo). Nada de URLs
  externas que se caigan el día que alguien presente sin conexión.
- **Con `meta.author` de quien lo hizo.** Es la firma que aparece en la ficha.
- **Nombre e `id` que no choquen** con uno que ya esté en el catálogo. El generador del índice se
  para si encuentra dos `id` iguales, o si el `id` no coincide con el nombre del archivo.

La marca **«oficial»** de la galería sale de `meta.author: "slidecode"`, y va solo en los que
mantiene el proyecto: si tu template la trae, te vamos a pedir que la cambies por tu nombre en la
revisión. No es una jerarquía de calidad sino de responsabilidad — los oficiales los arreglamos
nosotros cuando el formato cambia.

## Estructura

```
templates/<id>.sctemplate       # un template por archivo (JSON autocontenido) — lo único que se edita
index.json                      # DERIVADO: lo regenera la Action al entrar a main. No lo edites.
scripts/indice.mjs              # el generador (`--check` avisa si el índice quedó desalineado)
```
