const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const storage=new Map(), elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{value:'',style:{},hidden:false,innerHTML:'',getContext:()=>({}),addEventListener(){},querySelectorAll:()=>[]});return elements.get(id);}
const ctx=vm.createContext({console,document:{getElementById:element,body:{classList:{add(){},remove(){}}}},window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame(){}});
vm.runInContext(['data','sim','dialogue','tutorial','view'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+`\ndraw=()=>{};
state=Sim.fresh();state.day=5;state.coins=62;state.paused=false;closePanel();
const original=JSON.stringify(state);startPractice();
state.coins=999;state.knowledge.wagons={test:true};save();
globalThis.savedPractice=localStorage.getItem('hearth-hush-v1');
finishPractice();globalThis.returned={day:state.day,coins:state.coins,knowledge:state.knowledge,practice:!!state.practice};
panel('Read at my own pace','talk');let before=state.time;frame(100);frame(200);globalThis.readingWaited=state.time===before;
closePanel();frame(300);globalThis.walkingResumed=state.time>before;
`,ctx);
const saved=JSON.parse(ctx.savedPractice);
assert.equal(saved.day,5);assert.equal(saved.coins,62);assert(!saved.practice);assert(!saved.knowledge.wagons);
assert.equal(ctx.returned.day,5);assert.equal(ctx.returned.coins,62);assert(!ctx.returned.practice);assert(!ctx.returned.knowledge.wagons);
assert(ctx.readingWaited);assert(ctx.walkingResumed);
console.log('PASS practice autosave preserves the real week; early exit restores it; reading freezes time and closing resumes it');
