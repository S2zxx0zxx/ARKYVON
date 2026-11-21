import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FixedStepLoop, SeededRandom, EventBus, PluginHost, SceneController, CommandLog,
  parseProjectManifest, AssetCatalog, InputQueue, MemorySaveBackend, VersionedSaveStore, MatchGrid,
} from '../dist/index.js';

test('fixed-step loop advances expected ticks and interpolates', () => {
  const updates=[];const alpha=[];
  const loop=new FixedStepLoop({ update:(dt,step)=>updates.push([dt,step]),render:a=>alpha.push(a) },{stepMs:10,maxFrameMs:100});
  loop.start(0);
  assert.deepEqual(loop.advance(25),{updates:2,droppedMs:0,alpha:.5});
  assert.deepEqual(updates,[[.01,1],[.01,2]]);
  assert.deepEqual(alpha,[.5]);
  loop.pause();
  assert.equal(loop.advance(200).updates,0);
  loop.resume(200);
  assert.equal(loop.advance(210).updates,1);
  assert.equal(loop.step,3);
});
test('fixed-step loop rejects regression, reentrant updates and invalid options',()=>{
  assert.throws(()=>new FixedStepLoop({update(){},render(){}},{stepMs:0}),RangeError);
  let inner;
  const loop = new FixedStepLoop({update(){ inner=()=>loop.advance(20);assert.throws(inner,/Reentrant/);},render(){}},{stepMs:10});
  loop.start(0); loop.advance(10);
  assert.throws(()=>loop.advance(5),/Non-monotonic/);
});
test('fixed-step loop drops over-budget work and caps calls',()=>{
  let calls=0;
  const loop=new FixedStepLoop({update(){calls++;},render(){}},{stepMs:10,maxFrameMs:100,maxUpdatesPerFrame:3});
  loop.start(0);
  const stats=loop.advance(250);
  assert.equal(stats.updates,3);assert.equal(calls,3);
  assert.ok(stats.droppedMs>=220);
});
test('seeded RNG has reproducible streams and snapshot restore',()=>{
  const a=new SeededRandom(5),b=new SeededRandom(5);
  for(let i=0;i<100;i++) assert.equal(a.uint32(),b.uint32());
  const state=a.snapshot(),v=a.int(10,15);a.restore(state);assert.equal(a.int(10,15),v);
  assert.throws(()=>a.int(5,5),RangeError);
  assert.throws(()=>new SeededRandom(Number.NaN),RangeError);
});
test('typed event bus isolates mutation during dispatch',()=>{
  const bus=new EventBus(),received=[];
  let offSecond=()=>{};
  bus.on('score',p=>{received.push(['first',p]);offSecond();});
  offSecond=bus.on('score',p=>received.push(['second',p]));
  bus.emit('score',12);bus.emit('score',13);
  assert.deepEqual(received,[['first',12],['second',12],['first',13]]);
});
test('plugin host resolves dependencies and disposes in reverse order',()=>{
  const events=[],host=new PluginHost();
  host.installAll([
    {id:'view',requires:['core'],setup(){events.push('view+');return()=>events.push('view-');}},
    {id:'core',setup(){events.push('core+');return()=>events.push('core-');}},
  ]);
  assert.deepEqual(host.ids,['core','view']);host.dispose();
  assert.deepEqual(events,['core+','view+','view-','core-']);
});
test('plugins reject cycles and missing deps, rollback when setup fails',()=>{
  assert.throws(()=>new PluginHost().installAll([{id:'a',requires:['b'],setup(){}},{id:'b',requires:['a'],setup(){}}]),/cycle/);
  assert.throws(()=>new PluginHost().installAll([{id:'a',requires:['none'],setup(){}}]),/Missing/);
  const events=[],host=new PluginHost();
  assert.throws(()=>host.installAll([{id:'a',setup(){events.push('a');return()=>events.push('dispose-a');}},{id:'b',setup(){throw new Error('broken');}}]),/broken/);
  assert.deepEqual(events,['a','dispose-a']); assert.deepEqual(host.ids,[]);
});
test('scene lifecycle transitions, same-scene no-op and failed-entry restoration',()=>{
  const events=[];
  const scene=n=>({enter(){events.push(n+' enter');if(n==='bad') throw Error('no entry');},exit(){events.push(n+' exit');},update(){events.push(n+' update');}});
  const scenes=new SceneController({home:()=>scene('home'),play:()=>scene('play'),bad:()=>scene('bad')});
  scenes.switchTo('home'); scenes.switchTo('home'); scenes.update(.01);
  scenes.switchTo('play');
  assert.throws(()=>scenes.switchTo('bad'),/no entry/);
  assert.equal(scenes.current,'play');
  scenes.stop();assert.equal(scenes.current,null);
  assert.deepEqual(events,['home enter','home update','home exit','play enter','play exit','bad enter','bad exit','play enter','play exit']);
});
test('command log snapshots are immutable copies',()=>{
  const c=new CommandLog();const item={a:1};
  c.append(0,item);item.a=9;
  const snap=c.snapshot();assert.equal(snap[0].command.a,1);snap[0].command.a=15;
  assert.equal(c.snapshot()[0].command.a,1);
  assert.throws(()=>c.append(-1,{}),RangeError);
});
test('manifest validation accepts typed projects and rejects traversal-like IDs',()=>{
  const value={schemaVersion:1,id:'puzzle-game',displayName:'Puzzle',dimension:'2d',targets:['web','android'],plugins:['render-pixi'],contentVersion:1};
  assert.deepEqual(parseProjectManifest(value),value);
  for(const change of [{id:'../bad'},{targets:['web','web']},{plugins:['foo','foo']},{schemaVersion:2},{contentVersion:0}]){
    assert.throws(()=>parseProjectManifest({...value,...change}));
  }
});
test('asset DAG sorts and rejects missing, cyclic or unsafe assets',()=>{
  const sha='a'.repeat(64),catalog=new AssetCatalog();
  catalog.add({id:'textures/atlas',path:'textures/atlas.ktx2',sha256:sha,requires:['textures/source']});
  catalog.add({id:'textures/source',path:'textures/source.png',sha256:sha});
  assert.deepEqual(catalog.ordered().map(x=>x.id),['textures/source','textures/atlas']);
  assert.throws(()=>catalog.add({id:'evil',path:'../escape',sha256:sha}),/Unsafe/);
  const cyclic=new AssetCatalog();
  cyclic.add({id:'x',path:'x',sha256:sha,requires:['y']});cyclic.add({id:'y',path:'y',sha256:sha,requires:['x']});
  assert.throws(()=>cyclic.ordered(),/cycle/);
});
test('input queue drains through simulation step',()=>{
  const queue=new InputQueue();queue.enqueue({step:2,action:'tap',value:true});queue.enqueue({step:5,action:'move.x',value:.5});
  assert.deepEqual(queue.drainThrough(2).map(x=>x.action),['tap']);
  assert.deepEqual(queue.drainThrough(10).map(x=>x.action),['move.x']);
  assert.throws(()=>queue.enqueue({step:1,action:'BAD'}),/Invalid/);
});
test('versioned save store validates payload and supports explicit migration',()=>{
  const backend=new MemorySaveBackend();
  const valid=x=>!!x && typeof x==='object' && Number.isInteger(x.score) && x.score>=0;
  const v1=new VersionedSaveStore(backend,'example',1,valid);v1.save('slot1',{score:10});
  const v2=new VersionedSaveStore(backend,'example',2,valid,(_v,p)=>({score:p.score+1}));
  assert.deepEqual(v2.load('slot1'),{score:11});
  assert.throws(()=>v1.save('../unsafe',{score:1}),/slot/);
  assert.throws(()=>v1.save('bad',{score:-1}),/payload/);
  v2.save('slot1',{score:99});assert.throws(()=>v1.load('slot1'),/newer/);
});
test('match-grid rejects diagonal swaps and preserves state on rejected moves',()=>{
  const board=new MatchGrid(3,3,new SeededRandom(2),[0,1,2,1,2,0,2,0,1]);
  const before=[...board.cells];assert.equal(board.swap(0,4).accepted,false);
  assert.deepEqual(board.cells,before);assert.equal(board.score,0);
});
test('match-grid accepts seeded productive swaps reproducibly',()=>{
  const initial=[0,1,2,0,2,1,1,0,2];
  const a=new MatchGrid(3,3,new SeededRandom(9),initial),b=new MatchGrid(3,3,new SeededRandom(9),initial);
  let move=null;
  for(let i=0;i<9 && !move;i++){
    for(const n of [i+1,i+3]){
      if(n<9 && Math.abs(Math.floor(i/3)-Math.floor(n/3))+Math.abs(i%3-n%3)===1){
        const trial=new MatchGrid(3,3,new SeededRandom(9),initial);
        if(trial.swap(i,n).accepted){move=[i,n];break;}
      }
    }
  }
  assert.ok(move,'fixture should contain a productive move');
  const x=a.swap(...move),y=b.swap(...move);
  assert.deepEqual(x,y);assert.ok(x.removed>=3);
  assert.deepEqual(a.cells,b.cells);
});
