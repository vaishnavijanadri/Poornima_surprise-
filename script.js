
const canvas=document.getElementById("celebration");
const ctx=canvas ? canvas.getContext("2d") : null;
const burstLayer=document.getElementById("burstLayer");
let particles=[];
let fireworks=[];
function resizeCanvas(){
  if(!canvas || !ctx) return;
  canvas.width=window.innerWidth*devicePixelRatio;
  canvas.height=window.innerHeight*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener("resize",resizeCanvas); resizeCanvas();

function firework(x=Math.random()*innerWidth,y=Math.random()*innerHeight*.65){
  const hue=Math.floor(Math.random()*360);
  for(let i=0;i<80;i++){
    const a=Math.random()*Math.PI*2, s=2+Math.random()*7;
    fireworks.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,hue});
  }
  const ring=document.createElement("div"); ring.className="burst-ring";
  if(burstLayer) burstLayer.appendChild(ring);
  setTimeout(()=>ring.remove(),1100);
}
function confetti(count=180){
  for(let i=0;i<count;i++){
    particles.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*.3,
      vx:(Math.random()-.5)*5,vy:2+Math.random()*7,
      r:3+Math.random()*6,rot:Math.random()*6.28,vr:(Math.random()-.5)*.3,
      hue:Math.floor(Math.random()*360),life:1});
  }
}
function animateCelebration(){
  if(!canvas || !ctx){ requestAnimationFrame(animateCelebration); return; }
  ctx.clearRect(0,0,innerWidth,innerHeight);
  fireworks.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.life-=.018});
  fireworks=fireworks.filter(p=>p.life>0);
  fireworks.forEach(p=>{ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=`hsl(${p.hue},100%,70%)`;ctx.fillRect(p.x,p.y,3,3)});
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.rot+=p.vr;p.life-=.004});
  particles=particles.filter(p=>p.life>0&&p.y<innerHeight+40);
  particles.forEach(p=>{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=`hsl(${p.hue},100%,70%)`;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.8);ctx.restore()});
  ctx.globalAlpha=1;
  requestAnimationFrame(animateCelebration);
}
animateCelebration();

function bigCelebration(){
  confetti(220);
  firework(innerWidth*.18,innerHeight*.25);
  firework(innerWidth*.5,innerHeight*.18);
  firework(innerWidth*.82,innerHeight*.28);
}

const screens=[...document.querySelectorAll(".screen")];
let current=0;
const count=document.getElementById("count");
const line=document.getElementById("line");
const song=document.getElementById("song");
const record=document.getElementById("record");
const songBtn=document.getElementById("songBtn");
const afterSong=document.getElementById("afterSong");

function stopMedia(){
  document.querySelectorAll("video").forEach(v=>{v.pause();});
}
function show(n){
  if(n<0||n>=screens.length)return;
  if(n!==current) firework(innerWidth*(.25+.5*Math.random()),innerHeight*(.18+.45*Math.random()));
  stopMedia();
  screens[current].classList.remove("active");
  current=n;
  screens[current].classList.add("active");
  count.textContent=String(current+1).padStart(2,"0");
  line.style.width=((current)/(screens.length-1)*100)+"%";
  if(current!==16 && !song.paused){song.pause();record.classList.remove("playing");}
  if(current===18) bigCelebration();
}
document.querySelectorAll("[data-next]").forEach(b=>{
  b.addEventListener("click",()=>{
    if(!b.disabled) show(current+1);
  });
  b.addEventListener("touchend",(e)=>{
    e.preventDefault();
    if(!b.disabled) show(current+1);
  }, {passive:false});
});

songBtn.addEventListener("click", () => {
  afterSong.classList.remove("hidden");

  if (song.paused) {
    if (!Number.isFinite(song.duration) || song.duration <= 0) {
      song.addEventListener("loadedmetadata", startSong, { once: true });
      song.load();
    } else {
      startSong();
    }
  } else {
    song.pause();
  }
});

function startSong() {
  song.currentTime = song.duration / 2;

  song.play()
    .then(() => {
      record.classList.add("playing");
      songBtn.textContent = "PAUSE MODALASALA ⏸";
      afterSong.classList.remove("hidden");
    })
    .catch((error) => {
      console.log("Song could not play:", error);
      afterSong.classList.remove("hidden");
      songBtn.textContent = "PLAY MODALASALA 🎵";
    });
}
function startSong(){
  song.currentTime=song.duration/2;
  song.play().then(()=>{
    record.classList.add("playing");
    songBtn.textContent="PAUSE MODALASALA ⏸";
    afterSong.classList.remove("hidden");
  }).catch(()=>{});
}
song.addEventListener("play",()=>record.classList.add("playing"));
song.addEventListener("pause",()=>{record.classList.remove("playing");songBtn.textContent="PLAY MODALASALA 🎵";});
song.addEventListener("ended",()=>afterSong.classList.remove("hidden"));
afterSong.addEventListener("click",()=>show(17));

document.addEventListener("keydown",e=>{
  if(["ArrowRight"," ","Enter"].includes(e.key) && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){
    e.preventDefault();
    if(current===16 && e.key===" "){song.paused?startSong():song.pause();return}
    show(current+1);
  }
  if(e.key==="ArrowLeft")show(current-1);
});

show(0);
setTimeout(()=>{firework(innerWidth*.2,innerHeight*.28);firework(innerWidth*.8,innerHeight*.3)},500);
document.querySelectorAll(".blast-btn").forEach(b=>b.addEventListener("click",()=>{confetti(90);firework(innerWidth*.5,innerHeight*.35)}));
setTimeout(bigCelebration,1200);
