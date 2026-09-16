const D=[[0,-1],[1,0],[0,1],[-1,0]]; // 0=N, 1=E, 2=S, 3=W
const DIR_NAMES=["north","east","south","west"];
const L=[
{t:"Step 1 · Function Calls",m:'The Builder is 3 blocks from the crystal. Call <code>move_forward()</code> three times.',tip:'Start with one game command and watch what changes.',sub:'Walk straight to the crystal!',h:'Each <code>move_forward()</code> moves one block.',s:[1,6],d:1,g:[4,6],p:[[1,6],[2,6],[3,6],[4,6]],tr:[[0,0],[7,0],[0,7]],fl:[[7,6]],tg:[[0,4],[6,1],[7,4]],c:"# Move forward three blocks\nmove_forward()\n",u:["move_forward"]},
{t:"Step 2 · Turning",m:'Follow the path: move east twice, <code>turn_left()</code>, then move north twice.',tip:'Turning changes the direction the Builder is facing.',sub:'Turn at the corner.',h:'Facing east + <code>turn_left()</code> = north.',s:[1,6],d:1,g:[3,4],p:[[1,6],[2,6],[3,6],[3,5],[3,4]],wa:[[5,4],[5,5],[6,4],[6,5]],tr:[[0,0],[7,0]],tg:[[0,5],[4,2],[7,6]],c:"# Follow the path\nmove_forward()\nmove_forward()\nturn_left()\n",u:["move_forward","turn_left","turn_right"]},
{t:"Step 3 · Sequencing",m:'A stone wall blocks the direct route. Put movement and turning commands in the right order.',tip:'A program is a sequence: Python follows your commands from top to bottom.',sub:'Go around the stone wall.',h:'Go north, then east, then north again.',s:[1,6],d:0,g:[6,2],p:[[1,6],[1,5],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[6,3],[6,2]],w:[[2,5],[3,5],[4,5],[5,5]],tr:[[0,1],[7,7]],r:[[4,3]],c:"# Go around the wall\nmove_forward()\nmove_forward()\nturn_right()\n",u:["move_forward","turn_left","turn_right"]},
{t:"Step 4 · For Loops",m:'Use a real Python <code>for</code> loop to move forward five times.',tip:'Loops help you repeat the same command without repeating yourself.',sub:'Cross the long meadow.',h:'Try <code>for i in range(5):</code> then indent the next line.',s:[1,4],d:1,g:[6,4],p:[[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]],tr:[[0,0],[7,7]],fl:[[6,6],[2,2]],c:"# Repeat with Python\nfor i in range(5):\n    move_forward()\n",u:["move_forward","turn_left","turn_right","for"]},
{t:"Step 5 · If Statements",m:'Lava is directly ahead. If <code>block_ahead()</code> is lava, turn left, then move west.',tip:'Use an if statement to make a smart decision before moving.',sub:'Avoid the lava!',h:'Facing north + <code>turn_left()</code> = west.',s:[4,6],d:0,g:[1,6],p:[[1,6],[2,6],[3,6],[4,6]],la:[[4,5]],r:[[5,5],[6,5]],tr:[[0,0],[7,0],[0,7]],fl:[[1,1],[6,2]],tg:[[2,2],[7,3]],c:'# Look before you move\nif block_ahead() == "lava":\n    turn_left()\n\n# Then move toward the crystal\n',u:["move_forward","turn_left","turn_right","block_ahead","if"]},
{t:"Step 6 · Final Challenge",m:'Plan your own route and reach the crystal with clean Python.',tip:'Use everything you unlocked: movement, turning, sensing, loops and conditions.',sub:'Find your own clean solution.',h:'Trace the path with your finger before coding.',s:[1,6],d:1,g:[6,1],p:[[1,6],[2,6],[3,6],[3,5],[3,4],[4,4],[5,4],[6,4],[6,3],[6,2],[6,1]],w:[[4,5],[4,6],[5,5]],wa:[[1,2],[2,2],[1,3]],tr:[[0,0],[7,7]],r:[[5,2]],fl:[[6,6],[2,5]],tg:[[0,5],[6,5]],c:"# Write your solution here\n",u:["move_forward","turn_left","turn_right","block_ahead","for","if"]}
];
const COMMANDS=[
{k:"move_forward",label:"move_forward()",ico:"↑",cls:"move",insert:"move_forward()",desc:"Move one block forward."},
{k:"turn_left",label:"turn_left()",ico:"↶",cls:"turn",insert:"turn_left()",desc:"Turn 90° left."},
{k:"turn_right",label:"turn_right()",ico:"↷",cls:"turn",insert:"turn_right()",desc:"Turn 90° right."},
{k:"block_ahead",label:"block_ahead()",ico:"◆",cls:"sensor",insert:"block_ahead()",desc:"Check the block in front."},
{k:"for",label:"for",ico:"⟳",cls:"logic",insert:"for i in range(3):\n    move_forward()",desc:"Repeat commands."},
{k:"if",label:"if",ico:"if",cls:"logic",insert:'if block_ahead() == "lava":\n    turn_left()',desc:"Make a decision."}
];
let q=Math.min(Number(localStorage.getItem("craft-level")||0),5),py=null,busy=false;
const $=x=>document.getElementById(x),world=$("world"),player=$("player"),goal=$("goal"),ed=$("editor");
const has=(a,x,y)=>(a||[]).some(p=>p[0]===x&&p[1]===y), set=a=>new Set((a||[]).map(p=>p.join(",")));
function pos(el,x,y){el.style.left=x*12.5+"%";el.style.top=y*12.5+"%"}
function actor(x,y,d,anim=true){
  if(!anim){player.style.transition="none";requestAnimationFrame(()=>player.style.transition="left .24s ease,top .24s ease")}
  pos(player,x,y);player.dataset.dir=DIR_NAMES[d]||"south";
}
function progress(){let r=$("dots");r.innerHTML="";L.forEach((_,i)=>{let s=document.createElement("span");s.className=i<q?"done":i===q?"current":"";r.appendChild(s)})}
function renderWorld(){
  let l=L[q],p=set(l.p);world.innerHTML="";
  for(let y=0;y<8;y++)for(let x=0;x<8;x++){
    let t=document.createElement("div"),base=p.has(`${x},${y}`)?"dirt":"grass";t.className=`tile ${base}`;
    if(has(l.wa,x,y))t.className="tile water";if(has(l.la,x,y))t.className="tile lava";if(has(l.w,x,y))t.className="tile stone";
    if(has(l.tr,x,y))t.classList.add("tree");if(has(l.r,x,y))t.classList.add("rock");if(has(l.tg,x,y))t.classList.add("tall");if(has(l.fl,x,y))t.classList.add("flower");
    if(y===7)t.classList.add("edge-bottom");if(x===7)t.classList.add("edge-right");world.appendChild(t)
  }
  pos(goal,l.g[0],l.g[1]);goal.classList.remove("hide");actor(l.s[0],l.s[1],l.d,false)
}
function gutter(){let n=Math.max(12,ed.value.split("\n").length+3);$("gutter").textContent=Array.from({length:n},(_,i)=>i+1).join("\n")}
function fb(type,title,msg){
  $("ft").textContent=title;$("fm").textContent=msg;
  const icon={ready:"▶",ok:"✓",err:"!",try:"?",load:"…"}[type]||"✓";$("statusIcon").textContent=icon;
  const map={ready:["#8cc8ff","#173c69"],ok:["#8cf0bb","#0b5835"],err:["#ff9b93","#761f1a"],try:["#ffe58b","#6a4a00"],load:["#b8c7df","#31455f"]};let[c,bg]=map[type]||map.ready;$("statusIcon").style.background=c;$("statusIcon").style.color=bg;$("statusIcon").style.borderColor=c;
}
function renderCommands(){
  const unlocked=new Set(L[q].u||[]),row=$("commandRow");row.innerHTML="";
  COMMANDS.forEach(c=>{let b=document.createElement("button");b.className=`cmd ${c.cls||""} ${unlocked.has(c.k)?"":"locked"}`;b.type="button";b.title=unlocked.has(c.k)?`${c.desc} Provided by Python Craft Lab.`:"Unlocks in a later level";b.innerHTML=`<span class="ico">${c.ico}</span><span>${c.label}</span>`;if(unlocked.has(c.k))b.onclick=()=>insertCommand(c.insert);row.appendChild(b)})
}
function insertCommand(text){
  const s=ed.selectionStart,e=ed.selectionEnd,before=ed.value.slice(0,s),after=ed.value.slice(e),prefix=before&& !before.endsWith("\n")?"\n":"";ed.value=before+prefix+text+after;const p=(before+prefix+text).length;ed.focus();ed.setSelectionRange(p,p);gutter()
}
function render(){
  let l=L[q];progress();renderWorld();$("missionStep").textContent=l.t;$("missionText").innerHTML=l.m;$("missionTip").textContent=l.tip;$("goalSub").textContent=l.sub;$("hint").innerHTML=l.h;ed.value=l.c;gutter();renderCommands();$("next").classList.remove("show");fb("ready","Python is ready.","Press RUN CODE and watch your commands change the world.")
}
async function init(){try{fb("load","Loading Python…","First load can take a moment.");py=await loadPyodide();fb("ready","Python is ready.","Press RUN CODE and watch your commands change the world.")}catch(e){fb("err","Python could not load.","Refresh and try again.")}}
function prog(code,l){let walls=[...(l.w||[]),...(l.tr||[]),...(l.r||[])];return `
import json
x=${l.s[0]}; y=${l.s[1]}; direction=${l.d}; events=[]
walls=set(map(tuple,${JSON.stringify(walls)})); lava=set(map(tuple,${JSON.stringify(l.la||[])})); water=set(map(tuple,${JSON.stringify(l.wa||[])}))
dirs=[(0,-1),(1,0),(0,1),(-1,0)]
def terrain(nx,ny):
    if nx<0 or nx>7 or ny<0 or ny>7: return "wall"
    if (nx,ny) in walls: return "stone"
    if (nx,ny) in lava: return "lava"
    if (nx,ny) in water: return "water"
    return "clear"
def guard():
    if len(events)>80: raise Exception("Too many actions.")
def move_forward():
    global x,y,direction
    guard(); dx,dy=dirs[direction]; nx,ny=x+dx,y+dy; tile=terrain(nx,ny)
    if tile in ("wall","stone","lava","water"): events.append(("bump",x,y,direction,tile)); return
    x,y=nx,ny; events.append(("move",x,y,direction,"clear"))
def turn_left():
    global direction
    guard(); direction=(direction+3)%4; events.append(("turn",x,y,direction,"left"))
def turn_right():
    global direction
    guard(); direction=(direction+1)%4; events.append(("turn",x,y,direction,"right"))
def block_ahead():
    dx,dy=dirs[direction]; return terrain(x+dx,y+dy)
user_code=${JSON.stringify(code)}
try:
    exec(user_code,globals()); result=json.dumps({"ok":True,"x":x,"y":y,"d":direction,"events":events})
except Exception as e:
    result=json.dumps({"ok":False,"error":str(e),"x":x,"y":y,"d":direction,"events":events})
result`}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function play(ev,l){actor(l.s[0],l.s[1],l.d,false);await wait(120);for(const e of ev){let[k,x,y,d,detail]=e;if(k==="turn"){actor(x,y,d,true);await wait(320)}else if(k==="move"){actor(x,y,d,true);await wait(280)}else{actor(x,y,d,true);player.classList.remove("bump");void player.offsetWidth;player.classList.add("bump");fb("try","Blocked!",detail==="lava"?"That block is lava. Turn before moving.":"Something blocks the path.");await wait(360)}}}
async function run(){if(busy)return;if(!py){fb("load","Python is still loading…","Try again in a moment.");return}busy=true;$("run").disabled=true;let l=L[q];goal.classList.remove("hide");$("next").classList.remove("show");fb("load","Running your Python…","Watch the Builder follow each command.");try{let r=JSON.parse(await py.runPythonAsync(prog(ed.value,l)));await play(r.events||[],l);if(!r.ok)fb("err","Python found a bug.",r.error||"Check your code.");else if(r.x===l.g[0]&&r.y===l.g[1]){goal.classList.add("hide");fb("ok","Level complete!","Your Python changed the world.");$("next").classList.add("show")}else fb("try","Almost there.","The Builder did not reach the crystal yet.")}catch(e){fb("err","Python found a bug.",String(e.message||e))}finally{busy=false;$("run").disabled=false}}
$("run").onclick=run;$("reset").onclick=render;$("next").onclick=()=>{q=(q+1)%6;localStorage.setItem("craft-level",q);render()};ed.oninput=gutter;render();init();
