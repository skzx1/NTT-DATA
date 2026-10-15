import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
await import('./build-browser-domain.mjs');
const processes=[spawn(process.execPath,[resolve('node_modules/tsx/dist/cli.mjs'),'watch','src/local.ts'],{cwd:resolve('backend'),stdio:'inherit',env:{...process.env,LOCAL_MODE:'true'}}),spawn(process.execPath,[resolve('node_modules/next/dist/bin/next'),'dev','-p','4050'],{cwd:resolve('web'),stdio:'inherit'})];
process.on('SIGINT',()=>{for(const p of processes)p.kill();process.exit(0)});
for(const p of processes)p.on('exit',code=>{if(code)for(const other of processes)if(other!==p)other.kill()});
