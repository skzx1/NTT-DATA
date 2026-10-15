import {mkdir,copyFile,readdir,cp,stat} from 'node:fs/promises';
const root='artifacts/deploy';await mkdir(root+'/backend/dist',{recursive:true});
for(const name of (await readdir('backend/dist')).filter(n=>n.endsWith('.mjs')))await copyFile('backend/dist/'+name,root+'/backend/dist/'+name);
await cp('web/out',root+'/web/out',{recursive:true});await cp('scripts',root+'/scripts',{recursive:true});await cp('docs',root+'/docs',{recursive:true});for(const name of ['template.yaml','template-foundation.yaml','template-external-roles.yaml'])await copyFile(name,root+'/'+name);
console.log('Deployment payload prepared in artifacts/deploy. No credentials or node_modules.');
