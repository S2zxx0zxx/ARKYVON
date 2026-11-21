import { MatchGrid, SeededRandom, FixedStepLoop } from '../../dist/index.js';
const canvas = document.querySelector('#board');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#status');
const score = document.querySelector('#score');
let grid = new MatchGrid(7, 7, new SeededRandom(20261122));
let selected = null;
const palette = ['#f59e0b', '#e879f9', '#22d3ee', '#34d399'];
function draw() {
  const size = canvas.width / grid.width;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.cells.forEach((color, index) => {
    const x = (index % grid.width + .5) * size;
    const y = (Math.floor(index / grid.width) + .5) * size;
    ctx.beginPath(); ctx.arc(x,y,size*.37,0,Math.PI*2);
    ctx.fillStyle = palette[color]; ctx.fill();
    if (index === selected) { ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.stroke(); }
  });
}
const loop = new FixedStepLoop({ update:()=>{}, render:draw });
loop.start(performance.now());
function frame(now) { loop.advance(now); requestAnimationFrame(frame); }
requestAnimationFrame(frame);
canvas.addEventListener('pointerdown', event => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * grid.width / rect.width);
  const y = Math.floor((event.clientY - rect.top) * grid.height / rect.height);
  if (x < 0 || y < 0 || x >= grid.width || y >= grid.height) return;
  const index = y * grid.width + x;
  if (selected === null) { selected = index; status.textContent = 'Choose an adjacent bubble'; return; }
  const outcome = grid.swap(selected,index); selected = null;
  score.textContent = String(outcome.score);
  status.textContent = outcome.accepted ? `Matched ${outcome.removed} bubbles!` : 'No match; swap rejected';
});
document.querySelector('#reset').addEventListener('click',()=>{grid=new MatchGrid(7,7,new SeededRandom(20261122)); selected=null; score.textContent='0'; status.textContent='Board reset';});
document.addEventListener('visibilitychange',()=>document.hidden ? loop.pause() : loop.resume(performance.now()));
