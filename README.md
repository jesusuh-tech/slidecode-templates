# SLIDECODE — Templates oficiales

Kits de diseño oficiales de [SLIDECODE](https://github.com/jesushurtado-ops): cada
`.sctemplate` es un template completo — tema (tokens canónicos), layouts
pre-compuestos y módulos animados (code-blocks) — autocontenido y validado.

La app lee `index.json` y cachea los templates localmente (funciona offline).

## Estructura

```
index.json                      # [{ id, name, file, version }]
templates/<id>.sctemplate       # un template por archivo (JSON)
```

## Publicar o actualizar un template

1. Crea el template en SLIDECODE (Archivo → «Crear template desde este deck…»).
2. Copia el archivo desde `~/.slidecode/templates/` a `templates/`.
3. Agrega/actualiza su entrada en `index.json` (sube `version` si reemplazas).
4. Commit y push a `main` — la app lo recoge al abrir la galería.
