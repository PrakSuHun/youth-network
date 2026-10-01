/* Run after npm install --prefix /tmp/safelier-model-tools three@0.160.1 esbuild@0.25.0.
   Runtime uses the site's existing THREE; no CDN or network requests. */
const fs=require('fs'),path=require('path');
const tools='/tmp/safelier-model-tools/node_modules';
const esbuild=require(path.join(tools,'esbuild'));
(async()=>{
 const THREE=await import(path.join(tools,'three/build/three.module.js'));
 await esbuild.build({stdin:{contents:`import {FBXLoader} from '${tools}/three/examples/jsm/loaders/FBXLoader.js';window.SafeWorkerLoader=FBXLoader;`,resolveDir:process.cwd()},bundle:true,minify:true,format:'iife',outfile:'assets/vendor/worker-loader.min.js',plugins:[{name:'shared-three',setup(build){build.onResolve({filter:/^three$/},()=>({path:'three',namespace:'shared'}));build.onLoad({filter:/.*/,namespace:'shared'},()=>({contents:Object.keys(THREE).map(k=>`export const ${k}=window.THREE.${k};`).join('\n'),loader:'js'}));}}]});
})();
