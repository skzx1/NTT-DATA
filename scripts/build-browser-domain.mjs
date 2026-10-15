import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({entryPoints:[resolve(root,'backend/src/browser-preview.ts')],outfile:resolve(root,'web/src/lib/domain.generated.js'),bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,banner:{js:'// GENERATED from the canonical domain engine. Run scripts/build-browser-domain.mjs.'}});
