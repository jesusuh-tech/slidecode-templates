#!/usr/bin/env node
/**
 * REGENERA `index.json` A PARTIR DE `templates/`.
 *
 * ## Por qué existe
 *
 * `index.json` era un array que cada publicación EDITABA para sumar su entrada al final. Dos
 * templates publicados sin que el primero se mergeara tocaban LAS MISMAS LÍNEAS —el final del
 * array— así que git los daba por conflicto. No era un error de nadie: pasaba por construcción,
 * y volvería a pasar cada vez que dos publicaciones se cruzaran.
 *
 * Y el conflicto era peor de lo que parecía. Las líneas comunes de las dos entradas
 * (`version`/`author`, idénticas) quedaban FUERA del hunk, así que «Accept both changes» en la web
 * producía UN objeto con las claves repetidas: JSON válido, sin error en ninguna parte, y al
 * parsearlo gana la última clave. El template nuevo desaparecía del catálogo con su `.sctemplate`
 * intacto en el repo.
 *
 * Así que el índice deja de ser una fuente de verdad y pasa a ser DERIVADO: los `.sctemplate` son
 * lo único que se edita a mano, y publicar solo AÑADE UN ARCHIVO NUEVO — dos archivos distintos no
 * pueden chocar en git. Este script lo reconstruye entero, y la Action lo corre al mergear.
 *
 * ## Orden
 *
 * Por `id`, alfabético. Antes era «el orden de quien mergeó al final», o sea azar; ahora dos
 * ejecuciones dan el mismo archivo, que es lo que hace que un diff signifique algo. La galería
 * ordena por su cuenta (`ordenDelCatalogo`: los oficiales primero, después por nombre), así que
 * este orden es de estabilidad, no de presentación.
 *
 *   node scripts/indice.mjs            reescribe index.json
 *   node scripts/indice.mjs --check    falla si está desactualizado (no escribe)
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CARPETA = "templates";
const INDICE = "index.json";

const archivos = readdirSync(CARPETA)
  .filter((n) => n.endsWith(".sctemplate"))
  .sort();

const entradas = [];
const problemas = [];

for (const nombre of archivos) {
  const ruta = join(CARPETA, nombre);
  let template;
  try {
    template = JSON.parse(readFileSync(ruta, "utf8"));
  } catch (error) {
    problemas.push(`${ruta}: no es JSON válido (${error.message})`);
    continue;
  }
  const meta = template?.meta;
  if (meta === undefined || typeof meta.id !== "string" || typeof meta.name !== "string") {
    problemas.push(`${ruta}: le falta meta.id o meta.name`);
    continue;
  }

  /*
   * EL `id` TIENE QUE SER EL NOMBRE DEL ARCHIVO, y si no lo es, se para.
   *
   * Dos motivos. Uno: la galería baja `file` y luego busca por `id`, así que desalineados el
   * catálogo ofrece un template que al abrirse es otro — el tipo de fallo que nadie ve en un diff.
   * Dos, y por eso no hay una comprobación aparte de ids repetidos: dentro de una carpeta los
   * nombres YA son únicos, así que atar el id al nombre hace que dos ids iguales sean imposibles
   * por construcción en vez de ser algo que hay que ir a revisar.
   */
  if (`${meta.id}.sctemplate` !== nombre) {
    problemas.push(`${ruta}: meta.id es «${meta.id}», así que el archivo debería llamarse «${meta.id}.sctemplate»`);
    continue;
  }

  entradas.push({
    id: meta.id,
    name: meta.name,
    file: ruta,
    // El mismo defecto que ponía el publicador: un template sin versión es 1.0.0.
    version: typeof meta.version === "string" ? meta.version : "1.0.0",
    ...(typeof meta.author === "string" ? { author: meta.author } : {}),
    ...(typeof meta.description === "string" ? { description: meta.description } : {}),
  });
}

if (problemas.length > 0) {
  process.stderr.write(`No se pudo armar el índice:\n${problemas.map((p) => `  - ${p}`).join("\n")}\n`);
  process.exit(1);
}

entradas.sort((a, b) => a.id.localeCompare(b.id, "en"));
const texto = `${JSON.stringify(entradas, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const actual = readFileSync(INDICE, "utf8");
  if (actual === texto) {
    process.stdout.write(`index.json al día (${entradas.length} ${entradas.length === 1 ? "template" : "templates"})\n`);
    process.exit(0);
  }
  process.stderr.write(
    `index.json está desactualizado respecto a ${CARPETA}/. Corre: node scripts/indice.mjs\n`,
  );
  process.exit(1);
}

writeFileSync(INDICE, texto);
process.stdout.write(`index.json reescrito con ${entradas.length} ${entradas.length === 1 ? "template" : "templates"}\n`);
