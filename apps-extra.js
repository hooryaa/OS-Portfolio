/* ============================================================
   HOORIA OS — EXTRA APPS: Paint · Notes · Music · Arcade · Files · Widgets
   ============================================================ */

/* ---------------------------------------------------------
   PAINT
   --------------------------------------------------------- */
function renderPaint(container){
  const wrap = el("div", {class:"app", style:"padding:0;"});
  const toolbar = el("div", {style:"display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border);flex-wrap:wrap;"});
  const canvasWrap = el("div", {style:"flex:1;position:relative;overflow:auto;background:#e9e9ec;display:flex;align-items:flex-start;justify-content:center;padding:16px;"});
  const canvasInner = el("div", {style:"position:relative;transform-origin:top center;"});
  const gridCanvas = el("canvas", {style:"position:absolute;inset:0;pointer-events:none;display:none;"});
  const drawCanvas = el("canvas", {style:"position:relative;cursor:crosshair;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.15);"});
  canvasInner.appendChild(drawCanvas);
  canvasInner.appendChild(gridCanvas);
  canvasWrap.appendChild(canvasInner);

  let mode = "pencil", color = "#161616", size = 4, gridOn = false, zoom = 1;
  const recentColors = ["#161616"];
  const undoStack = [], redoStack = [];
  const ctx = drawCanvas.getContext("2d");
  const gctx = gridCanvas.getContext("2d");
  const W = 760, H = 480;

  function sizeCanvases(){
    [drawCanvas, gridCanvas].forEach(c=>{ c.width = W; c.height = H; c.style.width=(W*zoom)+"px"; c.style.height=(H*zoom)+"px"; });
    gridCanvas.style.position = "absolute"; gridCanvas.style.left = "0"; gridCanvas.style.top = "0";
    canvasInner.style.width = (W*zoom)+"px"; canvasInner.style.height = (H*zoom)+"px";
    drawGrid();
  }
  function drawGrid(){
    gctx.clearRect(0,0,W,H);
    if(!gridOn) return;
    gctx.strokeStyle = "rgba(0,0,0,.08)"; gctx.lineWidth = 1;
    for(let x=0;x<W;x+=20){ gctx.beginPath(); gctx.moveTo(x,0); gctx.lineTo(x,H); gctx.stroke(); }
    for(let y=0;y<H;y+=20){ gctx.beginPath(); gctx.moveTo(0,y); gctx.lineTo(W,y); gctx.stroke(); }
  }
  function pushUndo(){
    undoStack.push(ctx.getImageData(0,0,W,H));
    if(undoStack.length>30) undoStack.shift();
    redoStack.length = 0;
  }
  function addRecentColor(c){
    if(recentColors.includes(c)) return;
    recentColors.unshift(c);
    if(recentColors.length>6) recentColors.pop();
    renderRecentColors();
  }
  function toCanvasXY(e){
    const r = drawCanvas.getBoundingClientRect();
    return { x:(e.clientX-r.left)/zoom, y:(e.clientY-r.top)/zoom };
  }

  let drawing=false, lx, ly, startX, startY, snapshot=null;
  drawCanvas.addEventListener("mousedown",(e)=>{
    drawing = true; pushUndo();
    const {x,y} = toCanvasXY(e);
    lx = x; ly = y; startX = x; startY = y;
    if(mode==="shape-rect" || mode==="shape-circle") snapshot = ctx.getImageData(0,0,W,H);
    if(mode==="text"){
      const txt = prompt("Text to add:", "");
      if(txt){
        ctx.fillStyle = color; ctx.font = `${Math.max(14,size*4)}px 'Space Grotesk', sans-serif`;
        ctx.fillText(txt, x, y);
        addRecentColor(color);
      }
      drawing = false;
    }
  });
  drawCanvas.addEventListener("mousemove",(e)=>{
    if(!drawing) return;
    const {x,y} = toCanvasXY(e);
    if(mode==="pencil" || mode==="eraser"){
      ctx.strokeStyle = mode==="eraser" ? "#ffffff" : color;
      ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(x,y); ctx.stroke();
      lx=x; ly=y;
    } else if(mode==="shape-rect" && snapshot){
      ctx.putImageData(snapshot,0,0);
      ctx.strokeStyle = color; ctx.lineWidth = size;
      ctx.strokeRect(Math.min(startX,x), Math.min(startY,y), Math.abs(x-startX), Math.abs(y-startY));
    } else if(mode==="shape-circle" && snapshot){
      ctx.putImageData(snapshot,0,0);
      ctx.strokeStyle = color; ctx.lineWidth = size;
      const rx = Math.abs(x-startX)/2, ry = Math.abs(y-startY)/2;
      ctx.beginPath(); ctx.ellipse((startX+x)/2, (startY+y)/2, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
    }
  });
  window.addEventListener("mouseup", ()=>{
    if(drawing && (mode==="pencil"||mode==="eraser"||mode==="shape-rect"||mode==="shape-circle")) addRecentColor(color);
    drawing=false; snapshot=null;
  });

  const colorInput = el("input", {type:"color", value:color, onchange:(e)=>{ color=e.target.value; }});
  const recentRow = el("div", {style:"display:flex;gap:4px;"});
  function renderRecentColors(){
    recentRow.innerHTML = "";
    recentColors.forEach(c=> recentRow.appendChild(el("div", {
      style:`width:18px;height:18px;border-radius:5px;background:${c};border:1px solid var(--border-hi);cursor:pointer;`,
      onclick:()=>{ color=c; colorInput.value=c; }
    })));
  }
  renderRecentColors();

  const sizeInput = el("input", {type:"range", min:"1", max:"40", value:String(size), onchange:(e)=>size=+e.target.value});
  const zoomInput = el("input", {type:"range", min:"50", max:"200", value:"100", style:"width:80px;", oninput:(e)=>{ zoom = e.target.value/100; sizeCanvases(); }});

  const toolButtons = {};
  function makeTool(id, label){
    const b = el("button", {class:"btn", onclick:()=>{ mode=id; setActive(); }}, label);
    toolButtons[id] = b;
    return b;
  }
  function setActive(){ Object.entries(toolButtons).forEach(([id,b])=> b.classList.toggle("primary", id===mode)); }

  const tPencil = makeTool("pencil","✎ Pencil");
  const tEraser = makeTool("eraser","◻ Eraser");
  const tRect = makeTool("shape-rect","▭ Rect");
  const tCircle = makeTool("shape-circle","◯ Circle");
  const tText = makeTool("text","T Text");

  [tPencil, tEraser, tRect, tCircle, tText].forEach(b=> toolbar.appendChild(b));
  toolbar.appendChild(el("span",{style:"color:var(--text-2);font-size:11px;margin-left:4px;"},"Size"));
  toolbar.appendChild(sizeInput);
  toolbar.appendChild(colorInput);
  toolbar.appendChild(recentRow);
  toolbar.appendChild(el("button", {class:"btn", onclick:()=>{ if(undoStack.length){ redoStack.push(ctx.getImageData(0,0,W,H)); ctx.putImageData(undoStack.pop(),0,0); } }}, "↺ Undo"));
  toolbar.appendChild(el("button", {class:"btn", onclick:()=>{ if(redoStack.length){ undoStack.push(ctx.getImageData(0,0,W,H)); ctx.putImageData(redoStack.pop(),0,0); } }}, "↻ Redo"));
  toolbar.appendChild(el("button", {class:"btn", onclick:()=>{ gridOn=!gridOn; drawGrid(); }}, "▦ Grid"));
  toolbar.appendChild(el("span",{style:"color:var(--text-2);font-size:11px;"},"Zoom"));
  toolbar.appendChild(zoomInput);
  toolbar.appendChild(el("button", {class:"btn", onclick:()=>{ pushUndo(); ctx.fillStyle="#fff"; ctx.fillRect(0,0,W,H); }}, "🗑 Clear"));
  toolbar.appendChild(el("a", {class:"btn primary", onclick:()=>{
    const a = document.createElement("a");
    a.download = "hooria-os-drawing.png";
    a.href = drawCanvas.toDataURL("image/png");
    a.click();
    notify("Saved", "Your drawing was downloaded as a PNG.", "🖌");
  }}, "⬇ Save PNG"));
  setActive();

  wrap.appendChild(toolbar);
  wrap.appendChild(canvasWrap);
  container.appendChild(wrap);
  requestAnimationFrame(()=>{ sizeCanvases(); ctx.fillStyle="#fff"; ctx.fillRect(0,0,W,H); });
}

/* ---------------------------------------------------------
   STICKY NOTES
   --------------------------------------------------------- */
function renderNotes(container){
  const KEY = "hooria-os-notes";
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } }
  function save(notes){ localStorage.setItem(KEY, JSON.stringify(notes)); }

  const board = el("div", {style:"position:relative;height:100%;overflow:auto;background:repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(255,255,255,.02) 28px);"});
  const addBtn = el("button", {class:"btn primary", style:"position:absolute;top:12px;right:12px;z-index:2;"}, "+ New note");
  container.appendChild(el("div", {class:"app", style:"padding:0;"}, board, addBtn));

  const colors = ["#FFE58A","#8AFFC1","#8ACBFF","#FF8AC6","#C8A2FF"];
  let notes = load();
  if(!notes.length){
    notes = [{ id:"n1", x:24, y:60, text:"Ping recruiters back re: Data Engineering roles.", color:colors[0] },
             { id:"n2", x:220, y:120, text:"Finish DAX optimization pass on Power BI suite.", color:colors[1] }];
    save(notes);
  }

  function render(){
    board.innerHTML = "";
    notes.forEach(n => board.appendChild(makeNote(n)));
  }
  function makeNote(n){
    const note = el("div", {
      style:`position:absolute;left:${n.x}px;top:${n.y}px;width:170px;min-height:130px;background:${n.color};
             color:#1a1a1a;border-radius:4px;padding:12px;font-size:12.5px;line-height:1.5;
             box-shadow:0 10px 24px rgba(0,0,0,.35);cursor:grab;font-family:var(--font-body);`
    });
    const del = el("button", {style:"position:absolute;top:4px;right:6px;background:none;border:none;cursor:pointer;font-size:13px;color:#1a1a1a;opacity:.6;", onclick:(e)=>{
      e.stopPropagation();
      notes = notes.filter(x=>x.id!==n.id); save(notes); render();
    }}, "×");
    const text = el("div", {contenteditable:"true", style:"outline:none;margin-top:10px;", oninput:(e)=>{ n.text = e.target.textContent; save(notes); }}, n.text);
    note.appendChild(del); note.appendChild(text);

    let dragging=false, sx,sy,ox,oy;
    note.addEventListener("mousedown",(e)=>{
      if(e.target === text) return;
      dragging=true; sx=e.clientX; sy=e.clientY; ox=n.x; oy=n.y;
    });
    window.addEventListener("mousemove",(e)=>{
      if(!dragging) return;
      n.x = Math.max(0, ox + (e.clientX-sx)); n.y = Math.max(0, oy + (e.clientY-sy));
      note.style.left = n.x+"px"; note.style.top = n.y+"px";
    });
    window.addEventListener("mouseup",()=>{ if(dragging){ dragging=false; save(notes); } });
    return note;
  }
  addBtn.addEventListener("click", ()=>{
    notes.push({ id:"n"+Date.now(), x:40+Math.random()*80, y:40+Math.random()*80, text:"New note…", color: colors[Math.floor(Math.random()*colors.length)] });
    save(notes); render();
  });
  render();
}

/* ---------------------------------------------------------
   MUSIC PLAYER (procedural ambient audio, no external files)
   --------------------------------------------------------- */
const MUSIC_TRACKS = [
  { id:"lofi", name:"Lofi Focus", desc:"Warm, slow chord pad" },
  { id:"synthwave", name:"Synthwave Drive", desc:"Bright arpeggiated pulse" },
  { id:"rain", name:"Rain Sounds", desc:"Filtered white-noise rain" },
];
const MusicEngine = {
  actx:null, master:null, nodes:[], playingId:null, vol:0.5, muted:false, listeners:[],
  ensureCtx(){ this.actx = this.actx || new (window.AudioContext||window.webkitAudioContext)(); },
  subscribe(fn){ this.listeners.push(fn); return ()=>{ this.listeners = this.listeners.filter(f=>f!==fn); }; },
  emit(){ this.listeners.forEach(fn=>fn(this.playingId)); },
  stop(){
    this.nodes.forEach(n=>{ try{n.stop && n.stop();}catch(e){} try{n.disconnect && n.disconnect();}catch(e){} });
    this.nodes = []; this.playingId = null; this.emit();
  },
  setVolume(v){ this.vol = v; if(this.master) this.master.gain.value = this.muted?0:this.vol; },
  toggleMute(){ this.muted = !this.muted; if(this.master) this.master.gain.value = this.muted?0:this.vol; return this.muted; },
  play(id){
    if(this.playingId === id){ this.stop(); return; }
    this.stop();
    this.ensureCtx();
    this.master = this.actx.createGain(); this.master.gain.value = this.muted?0:this.vol; this.master.connect(this.actx.destination);
    if(id==="lofi"){
      [130.8,164.8,196.0,246.9].forEach(f=>{
        const o=this.actx.createOscillator(); o.type="sine"; o.frequency.value=f;
        const g=this.actx.createGain(); g.gain.value=0.05;
        o.connect(g); g.connect(this.master); o.start();
        this.nodes.push(o,g);
      });
    } else if(id==="synthwave"){
      const notes=[220,277.2,329.6,220,246.9,293.7,349.2,246.9]; let i=0;
      const o=this.actx.createOscillator(); o.type="sawtooth";
      const g=this.actx.createGain(); g.gain.value=0.04;
      const f=this.actx.createBiquadFilter(); f.type="lowpass"; f.frequency.value=1200;
      o.connect(f); f.connect(g); g.connect(this.master); o.start();
      const iv=setInterval(()=>{ o.frequency.setValueAtTime(notes[i%notes.length], this.actx.currentTime); i++; }, 260);
      this.nodes.push(o,g,f,{stop:()=>clearInterval(iv), disconnect:()=>{}});
    } else if(id==="rain"){
      const bufferSize=2*this.actx.sampleRate;
      const buffer=this.actx.createBuffer(1,bufferSize,this.actx.sampleRate);
      const data=buffer.getChannelData(0);
      for(let i=0;i<bufferSize;i++) data[i]=Math.random()*2-1;
      const noise=this.actx.createBufferSource(); noise.buffer=buffer; noise.loop=true;
      const f=this.actx.createBiquadFilter(); f.type="bandpass"; f.frequency.value=1000; f.Q.value=0.6;
      const g=this.actx.createGain(); g.gain.value=0.15;
      noise.connect(f); f.connect(g); g.connect(this.master); noise.start();
      this.nodes.push(noise,f,g);
    }
    this.playingId = id; this.emit();
  }
};

function renderMusic(container){
  const list = el("div", {});
  const volRow = el("div", {style:"display:flex;align-items:center;gap:10px;padding:14px 18px;border-top:1px solid var(--border);"});
  const volInput = el("input", {type:"range", min:"0", max:"100", value:String(MusicEngine.vol*100), style:"flex:1;", oninput:(e)=> MusicEngine.setVolume(e.target.value/100)});
  const muteBtn = el("button", {class:"btn", onclick:()=>{
    const muted = MusicEngine.toggleMute();
    muteBtn.textContent = muted ? "\ud83d\udd07" : "\ud83d\udd0a"; playBeep(muted?200:500);
  }}, MusicEngine.muted ? "\ud83d\udd07" : "\ud83d\udd0a");
  volRow.appendChild(muteBtn); volRow.appendChild(volInput);

  function render(){
    list.innerHTML = "";
    MUSIC_TRACKS.forEach(t=>{
      const active = MusicEngine.playingId === t.id;
      list.appendChild(el("div", {
        class:"contact-card", style:`cursor:pointer;margin-bottom:10px;${active?'border-color:var(--cyan);':''}`,
        onclick:()=> MusicEngine.play(t.id)
      },
        el("span",{class:"cc-icon"}, active?"\u23f8":"\u25b6"),
        el("h4",{}, t.name),
        el("span",{}, active ? "Now playing \u2014 click to stop" : t.desc)
      ));
    });
  }
  const unsub = MusicEngine.subscribe(render);
  render();
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll", style:"padding-bottom:0;"},
      el("span", {class:"eyebrow"}, "Ambient coding music"),
      el("h1", {class:"app-h"}, "Music Player"),
      el("p", {class:"app-sub"}, "Procedurally generated \u2014 no external files, safe to leave running."),
      list
    ),
    volRow
  ));
}

/* ---------------------------------------------------------
   LEADERBOARD (localStorage)
   --------------------------------------------------------- */
const LB_KEY = "hooria-os-leaderboard";
function lbGet(){ try{ return JSON.parse(localStorage.getItem(LB_KEY)||"{}"); }catch(e){ return {}; } }
function lbSet(game, value, higherIsBetter=true){
  const lb = lbGet();
  const prev = lb[game];
  if(prev === undefined || (higherIsBetter ? value > prev : value < prev)){
    lb[game] = value;
    localStorage.setItem(LB_KEY, JSON.stringify(lb));
    return true;
  }
  return false;
}
function lbRow(label, value){
  return el("span", {style:"font-family:var(--font-mono);font-size:11px;color:var(--text-2);margin-right:16px;"},
    `${label}: `, el("b", {style:"color:var(--cyan);"}, value===undefined ? "—" : String(value))
  );
}

/* ---------------------------------------------------------
   ARCADE — Snake · Memory · Tic-Tac-Toe · Typing · 2048 · Minesweeper
   --------------------------------------------------------- */
function renderArcade(container, route){
  const tabs = el("div", {class:"arch-tabs"});
  const lbStrip = el("div", {style:"padding:4px 20px 12px;display:flex;flex-wrap:wrap;"});
  const body = el("div", {style:"flex:1;overflow:auto;padding:18px;"});
  const games = [
    { id:"snake", label:"Snake", fn:mountSnake },
    { id:"memory", label:"Memory Match", fn:mountMemory },
    { id:"tictactoe", label:"Tic-Tac-Toe", fn:mountTicTacToe },
    { id:"typing", label:"Typing Test", fn:mountTyping },
    { id:"2048", label:"2048", fn:mount2048 },
    { id:"minesweeper", label:"Minesweeper", fn:mountMinesweeper },
    { id:"pixelart", label:"Pixel Art", fn:mountPixelArt },
  ];
  function renderLb(){
    const lb = lbGet();
    lbStrip.innerHTML = "";
    lbStrip.appendChild(lbRow("Snake best", lb.snake));
    lbStrip.appendChild(lbRow("Memory best moves", lb.memory));
    lbStrip.appendChild(lbRow("Tic-Tac-Toe wins", lb.tictactoe));
    lbStrip.appendChild(lbRow("Typing best WPM", lb.typing));
    lbStrip.appendChild(lbRow("2048 best", lb["2048"]));
    lbStrip.appendChild(lbRow("Minesweeper wins", lb.minesweeper));
  }
  function show(id){
    body.innerHTML = "";
    $all(".arch-tab", tabs).forEach(t=>t.classList.toggle("active", t.dataset.g===id));
    (games.find(g=>g.id===id) || games[0]).fn(body, renderLb);
    renderLb();
  }
  games.forEach(g=> tabs.appendChild(el("div", {class:"arch-tab", "data-g":g.id, onclick:()=>show(g.id)}, g.label)));
  container.appendChild(el("div", {class:"app", style:"padding:0;"},
    el("div", {style:"padding:16px 20px 0;"},
      el("span", {class:"eyebrow"}, "Take a break"),
      el("h1", {class:"app-h"}, "Arcade")
    ),
    tabs, lbStrip, body
  ));
  renderLb();
  show((route && route.game) || "snake");
}

function mountSnake(body, onScore){
  const wrap = el("div", {style:"display:flex;flex-direction:column;align-items:center;gap:10px;"});
  const info = el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);"}, "Score: 0 — use arrow keys");
  const canvas = el("canvas", {width:"320", height:"320", style:"background:#0b0b0d;border:1px solid var(--border-hi);border-radius:10px;"});
  wrap.appendChild(info); wrap.appendChild(canvas);
  body.appendChild(wrap);
  const ctx = canvas.getContext("2d");
  const cell = 16, cols = 20, rows = 20;
  let snake, dir, food, score, alive, playedOnce=false;
  function reset(){
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}]; dir = {x:1,y:0}; score = 0; alive = true;
    placeFood();
  }
  function placeFood(){ food = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) }; }
  function tick(){
    if(!alive) return;
    const head = { x: snake[0].x+dir.x, y: snake[0].y+dir.y };
    if(head.x<0||head.y<0||head.x>=cols||head.y>=rows || snake.some(s=>s.x===head.x&&s.y===head.y)){
      alive = false;
      const isBest = lbSet("snake", score, true);
      info.textContent = `Game over — score ${score}${isBest?" — new best!":""}. Press any arrow key to restart.`;
      if(onScore) onScore();
      return;
    }
    snake.unshift(head);
    if(head.x===food.x && head.y===food.y){ score++; placeFood(); if(!playedOnce){playedOnce=true; unlockAchievement("snake_played");} }
    else snake.pop();
    info.textContent = `Score: ${score} — use arrow keys`;
    draw();
  }
  function draw(){
    ctx.fillStyle = "#0b0b0d"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#00E5C7";
    snake.forEach(s=> ctx.fillRect(s.x*cell, s.y*cell, cell-2, cell-2));
    ctx.fillStyle = "#FF6B4A";
    ctx.fillRect(food.x*cell, food.y*cell, cell-2, cell-2);
  }
  const keyHandler = (e)=>{
    const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0} };
    if(!map[e.key]) return;
    e.preventDefault();
    if(!alive){ reset(); draw(); return; }
    const nd = map[e.key];
    if(nd.x === -dir.x && nd.y === -dir.y) return;
    dir = nd;
  };
  window.addEventListener("keydown", keyHandler);
  reset(); draw();
  const loop = setInterval(tick, 130);
  new MutationObserver(()=>{ if(!document.body.contains(canvas)){ clearInterval(loop); window.removeEventListener("keydown", keyHandler); } })
    .observe(document.body, {childList:true, subtree:true});
}

function mountMemory(body, onScore){
  const symbols = ["◆","▣","◈","✎","⬡","▥","⌗","⚙"];
  const deck = [...symbols, ...symbols].sort(()=>Math.random()-0.5);
  const grid = el("div", {style:"display:grid;grid-template-columns:repeat(4,64px);gap:10px;"});
  const info = el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);margin-bottom:10px;"}, "Moves: 0");
  let flipped = [], matched = [], moves = 0, lock = false;
  deck.forEach((sym, i)=>{
    const card = el("div", {
      style:"width:64px;height:64px;border-radius:10px;background:var(--surface);border:1px solid var(--border-hi);display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;user-select:none;",
      onclick:()=>flip(i, card)
    }, "");
    card.dataset.sym = sym;
    grid.appendChild(card);
  });
  function flip(i, card){
    if(lock || matched.includes(i) || flipped.some(f=>f.i===i)) return;
    card.textContent = card.dataset.sym;
    flipped.push({i,card});
    if(flipped.length === 2){
      moves++; info.textContent = `Moves: ${moves}`;
      lock = true;
      const [a,b] = flipped;
      if(a.card.dataset.sym === b.card.dataset.sym){
        matched.push(a.i, b.i); flipped = []; lock = false;
        if(matched.length === deck.length){
          const isBest = lbSet("memory", moves, false);
          info.textContent = `Solved in ${moves} moves! 🎉${isBest?" New best!":""}`;
          if(onScore) onScore();
        }
      } else {
        setTimeout(()=>{ a.card.textContent=""; b.card.textContent=""; flipped=[]; lock=false; }, 650);
      }
    }
  }
  body.appendChild(el("div", {}, info, grid));
}

function mountTicTacToe(body, onScore){
  let board = Array(9).fill(null);
  const info = el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);margin-bottom:10px;"}, "You are X. Try to beat the AI.");
  const grid = el("div", {style:"display:grid;grid-template-columns:repeat(3,72px);gap:8px;"});
  const cells = [];
  for(let i=0;i<9;i++){
    const c = el("div", {
      style:"width:72px;height:72px;border-radius:10px;background:var(--surface);border:1px solid var(--border-hi);display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;font-family:var(--font-display);",
      onclick:()=>playerMove(i)
    }, "");
    cells.push(c); grid.appendChild(c);
  }
  function playerMove(i){
    if(board[i] || checkWinner(board)) return;
    board[i] = "X"; render();
    if(checkWinner(board) || board.every(Boolean)){ endCheck(); return; }
    setTimeout(()=>{ const m = bestMove(board); if(m>-1){ board[m]="O"; render(); } endCheck(); }, 250);
  }
  function endCheck(){
    const w = checkWinner(board);
    if(w === "X"){
      const wins = (lbGet().tictactoe||0) + 1;
      lbSet("tictactoe", wins, true);
      info.textContent = "You win! 🎉"; unlockAchievement("tictactoe_win");
      if(onScore) onScore();
    }
    else if(w === "O"){ info.textContent = "AI wins. Try again?"; }
    else if(board.every(Boolean)){ info.textContent = "Draw. Reset to try again."; }
  }
  function render(){ cells.forEach((c,i)=> c.textContent = board[i]||""); }
  function checkWinner(b){
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const [a,b1,c] of lines) if(b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a];
    return null;
  }
  function bestMove(b){
    let bestScore = -Infinity, move = -1;
    for(let i=0;i<9;i++){
      if(!b[i]){
        b[i] = "O";
        const score = minimax(b, 0, false);
        b[i] = null;
        if(score > bestScore){ bestScore = score; move = i; }
      }
    }
    return move;
  }
  function minimax(b, depth, isMax){
    const w = checkWinner(b);
    if(w==="O") return 10-depth;
    if(w==="X") return depth-10;
    if(b.every(Boolean)) return 0;
    if(isMax){
      let best = -Infinity;
      for(let i=0;i<9;i++) if(!b[i]){ b[i]="O"; best=Math.max(best, minimax(b,depth+1,false)); b[i]=null; }
      return best;
    } else {
      let best = Infinity;
      for(let i=0;i<9;i++) if(!b[i]){ b[i]="X"; best=Math.min(best, minimax(b,depth+1,true)); b[i]=null; }
      return best;
    }
  }
  const resetBtn = el("button", {class:"btn", style:"margin-top:12px;", onclick:()=>{ board = Array(9).fill(null); render(); info.textContent="New game — you are X."; }}, "Reset");
  body.appendChild(el("div", {}, info, grid, resetBtn));
}

function mountTyping(body, onScore){
  const sentences = [
    "Clean data models make every downstream dashboard easier to trust.",
    "The bug is never where you first assume it will be hiding.",
    "Ship the pipeline, then optimize the query, not the other way around.",
    "A good API hides complexity without hiding the truth of what it does.",
    "Every dashboard is a promise that the data behind it was validated first."
  ];
  const target = sentences[Math.floor(Math.random()*sentences.length)];
  const display = el("div", {style:"font-family:var(--font-mono);font-size:15px;line-height:1.7;color:var(--text-1);margin-bottom:14px;max-width:56ch;"});
  target.split("").forEach(ch => display.appendChild(el("span", {}, ch)));
  const input = el("input", {type:"text", style:"width:100%;max-width:56ch;padding:10px 12px;border-radius:8px;background:var(--surface);border:1px solid var(--border-hi);color:var(--text-0);font-family:var(--font-mono);", placeholder:"Start typing to begin the timer…"});
  const result = el("div", {style:"margin-top:12px;font-family:var(--font-mono);font-size:12.5px;color:var(--cyan);"});
  let start = null, done = false;
  input.addEventListener("input", ()=>{
    if(done) return;
    if(start===null) start = Date.now();
    const val = input.value;
    const spans = display.children;
    for(let i=0;i<target.length;i++){
      spans[i].style.color = i<val.length ? (val[i]===target[i] ? "var(--cyan)" : "var(--danger)") : "var(--text-1)";
    }
    if(val === target){
      done = true;
      const seconds = (Date.now()-start)/1000;
      const wpm = Math.round((target.split(" ").length / seconds) * 60);
      const isBest = lbSet("typing", wpm, true);
      result.textContent = `Done in ${seconds.toFixed(1)}s — ${wpm} WPM.${isBest?" New best!":""}`;
      unlockAchievement("typing_done");
      if(onScore) onScore();
    }
  });
  body.appendChild(el("div", {}, display, input, result));
}

function mount2048(body, onScore){
  const SIZE = 4;
  let grid, score, best2048=false;
  const scoreEl = el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);margin-bottom:10px;"}, "Score: 0");
  const boardEl = el("div", {style:"display:grid;grid-template-columns:repeat(4,68px);grid-template-rows:repeat(4,68px);gap:8px;background:rgba(255,255,255,.04);padding:8px;border-radius:12px;"});
  const hint = el("div", {style:"font-family:var(--font-mono);font-size:11px;color:var(--text-2);margin-top:10px;"}, "Arrow keys to slide tiles. Combine matching numbers.");
  const tileColors = {2:"#3a3a44",4:"#454552",8:"#7C5CFF",16:"#8d70ff",32:"#00E5C7",64:"#1fd4b8",128:"#FF6B4A",256:"#ff8a68",512:"#ffb020",1024:"#ffd23b",2048:"#39FF6A"};
  function reset(){ grid = Array.from({length:SIZE},()=>Array(SIZE).fill(0)); score=0; addTile(); addTile(); render(); }
  function addTile(){
    const empty = [];
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(!grid[r][c]) empty.push([r,c]);
    if(!empty.length) return;
    const [r,c] = empty[Math.floor(Math.random()*empty.length)];
    grid[r][c] = Math.random()<0.9 ? 2 : 4;
  }
  function render(){
    boardEl.innerHTML = "";
    scoreEl.textContent = `Score: ${score}`;
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++){
      const v = grid[r][c];
      boardEl.appendChild(el("div", {
        style:`display:flex;align-items:center;justify-content:center;border-radius:8px;font-family:var(--font-display);font-weight:600;
               font-size:${v>512?15:19}px;color:${v?'#0b0b0d':'transparent'};background:${v?tileColors[v]||'#39FF6A':'rgba(255,255,255,.03)'};transition:background .15s;`
      }, v ? String(v) : ""));
    }
  }
  function slide(row){
    const vals = row.filter(v=>v);
    for(let i=0;i<vals.length-1;i++){
      if(vals[i]===vals[i+1]){ vals[i]*=2; score+=vals[i]; vals.splice(i+1,1); }
    }
    while(vals.length<SIZE) vals.push(0);
    return vals;
  }
  function move(dir){
    const before = JSON.stringify(grid);
    if(dir==="left"){ grid = grid.map(row=>slide(row)); }
    else if(dir==="right"){ grid = grid.map(row=>slide([...row].reverse()).reverse()); }
    else if(dir==="up"){
      for(let c=0;c<SIZE;c++){ const col=slide(grid.map(r=>r[c])); for(let r=0;r<SIZE;r++) grid[r][c]=col[r]; }
    } else if(dir==="down"){
      for(let c=0;c<SIZE;c++){ const col=slide(grid.map(r=>r[c]).reverse()).reverse(); for(let r=0;r<SIZE;r++) grid[r][c]=col[r]; }
    }
    if(JSON.stringify(grid)!==before){
      addTile(); render();
      const isBest = lbSet("2048", score, true);
      if(grid.flat().includes(2048) && !best2048){ best2048=true; unlockAchievement("reached_2048"); notify("2048!", "You hit the 2048 tile. Keep going for a higher score.", "🎉"); }
      if(isBest && onScore) onScore();
    }
  }
  const keyHandler = (e)=>{
    const map = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
    if(!map[e.key]) return;
    e.preventDefault(); move(map[e.key]);
  };
  window.addEventListener("keydown", keyHandler);
  reset();
  body.appendChild(el("div", {tabindex:"0"}, scoreEl, boardEl, hint,
    el("button", {class:"btn", style:"margin-top:12px;", onclick:reset}, "New Game")));
  new MutationObserver(()=>{ if(!document.body.contains(boardEl)) window.removeEventListener("keydown", keyHandler); })
    .observe(document.body, {childList:true, subtree:true});
}

function mountMinesweeper(body, onScore){
  const COLS=9, ROWS=9, MINES=10;
  let cells, revealedCount, flagCount, gameOver;
  const info = el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);margin-bottom:10px;"});
  const grid = el("div", {style:`display:grid;grid-template-columns:repeat(${COLS},28px);gap:2px;`});
  function neighbors(i){
    const r = Math.floor(i/COLS), c = i%COLS, out=[];
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      if(!dr&&!dc) continue;
      const nr=r+dr, nc=c+dc;
      if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) out.push(nr*COLS+nc);
    }
    return out;
  }
  function reset(){
    const total = COLS*ROWS;
    cells = Array.from({length:total},()=>({mine:false,revealed:false,flagged:false,adj:0}));
    let placed=0;
    while(placed<MINES){ const i=Math.floor(Math.random()*total); if(!cells[i].mine){ cells[i].mine=true; placed++; } }
    cells.forEach((c,i)=>{ if(!c.mine) c.adj = neighbors(i).filter(n=>cells[n].mine).length; });
    revealedCount=0; flagCount=0; gameOver=false;
    info.textContent = `Mines: ${MINES} — left-click to reveal, right-click to flag`;
    render();
  }
  function reveal(i){
    if(gameOver || cells[i].revealed || cells[i].flagged) return;
    cells[i].revealed = true; revealedCount++;
    if(cells[i].mine){
      gameOver = true;
      cells.forEach(c=>{ if(c.mine) c.revealed = true; });
      info.textContent = "💥 Boom. Right-click to flag next time. Click New Game to retry.";
      render(); return;
    }
    if(cells[i].adj===0) neighbors(i).forEach(n=> reveal(n));
    if(revealedCount === COLS*ROWS - MINES){
      gameOver = true;
      const wins = (lbGet().minesweeper||0)+1;
      lbSet("minesweeper", wins, true);
      info.textContent = "🏁 Cleared the field! You win.";
      unlockAchievement("minesweeper_won");
      if(onScore) onScore();
    }
    render();
  }
  function toggleFlag(i, e){
    e.preventDefault();
    if(gameOver || cells[i].revealed) return;
    cells[i].flagged = !cells[i].flagged;
    render();
  }
  const numColors = ["","#3b9dff","#39c46a","#ff5470","#7C5CFF","#FF6B4A","#00E5C7","#fff","#999"];
  function render(){
    grid.innerHTML = "";
    cells.forEach((c,i)=>{
      let content = "";
      let bg = "var(--surface)";
      if(c.revealed){
        bg = c.mine ? "#5a1b1b" : "rgba(255,255,255,.02)";
        content = c.mine ? "💣" : String(c.adj || "");
      } else if(c.flagged){ content = "🚩"; }
      grid.appendChild(el("div", {
        style:`width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;
               background:${bg};border:1px solid var(--border);cursor:pointer;font-size:12px;font-weight:700;
               color:${c.revealed && !c.mine ? (numColors[c.adj]||'var(--text-1)') : 'var(--text-1)'};user-select:none;`,
        onclick:()=>reveal(i),
        oncontextmenu:(e)=>toggleFlag(i,e)
      }, content));
    });
  }
  reset();
  body.appendChild(el("div", {}, info, grid,
    el("button", {class:"btn", style:"margin-top:12px;", onclick:reset}, "New Game")));
}

function mountPixelArt(body){
  const GRID = 16;
  const PX = 22;
  let color = "#7C5CFF";
  const cellsData = Array(GRID*GRID).fill(null);
  const canvas = el("div", {style:`display:grid;grid-template-columns:repeat(${GRID},${PX}px);gap:1px;background:#050505;border-radius:8px;overflow:hidden;border:1px solid var(--border-hi);`});
  const cellEls = [];
  let painting = false;
  function paint(i){ cellsData[i] = color; cellEls[i].style.background = color; }
  function erase(i){ cellsData[i] = null; cellEls[i].style.background = "#161616"; }
  for(let i=0;i<GRID*GRID;i++){
    const c = el("div", {
      style:`width:${PX}px;height:${PX}px;background:#161616;cursor:pointer;`,
      onmousedown:(e)=>{ painting=true; e.buttons===2 ? erase(i) : paint(i); },
      onmouseenter:()=>{ if(painting) paint(i); },
      oncontextmenu:(e)=>{ e.preventDefault(); erase(i); }
    });
    cellEls.push(c); canvas.appendChild(c);
  }
  window.addEventListener("mouseup", ()=> painting=false);

  const palette = ["#7C5CFF","#00E5C7","#FF6B4A","#FF5470","#FFD23B","#39FF6A","#ffffff","#161616"];
  const paletteRow = el("div", {style:"display:flex;gap:6px;margin-bottom:12px;"});
  palette.forEach(c=> paletteRow.appendChild(el("div", {
    style:`width:22px;height:22px;border-radius:6px;background:${c};cursor:pointer;border:2px solid ${c===color?'var(--cyan)':'transparent'};`,
    onclick:(e)=>{ color=c; $all("div", paletteRow).forEach(d=>d.style.border="2px solid transparent"); e.target.style.border="2px solid var(--cyan)"; }
  })));
  const colorInput = el("input", {type:"color", value:color, onchange:(e)=>color=e.target.value});

  body.appendChild(el("div", {},
    el("div", {style:"font-family:var(--font-mono);font-size:12px;color:var(--text-1);margin-bottom:10px;"}, `${GRID}×${GRID} pixel canvas — click and drag to paint, right-click to erase.`),
    paletteRow, colorInput,
    el("div", {style:"margin-top:12px;"}, canvas),
    el("div", {style:"display:flex;gap:8px;margin-top:12px;"},
      el("button", {class:"btn", onclick:()=>{ cellEls.forEach((c,i)=>{ cellsData[i]=null; c.style.background="#161616"; }); }}, "Clear"),
      el("button", {class:"btn primary", onclick:()=>{
        const c = document.createElement("canvas"); c.width=GRID; c.height=GRID;
        const cx = c.getContext("2d");
        cellsData.forEach((col,i)=>{ if(col){ cx.fillStyle=col; cx.fillRect(i%GRID, Math.floor(i/GRID), 1, 1); } });
        const a = document.createElement("a"); a.download="hooria-os-pixel-art.png"; a.href=c.toDataURL("image/png"); a.click();
        notify("Saved", "Your pixel art was downloaded as a PNG.", "🖌");
      }}, "⬇ Save PNG")
    )
  ));
}

/* ---------------------------------------------------------
   FILE EXPLORER — with system-file personality + Recycle Bin
   --------------------------------------------------------- */
const FS_FILES = {
  "career.log": `[boot] Enrolled — Software Engineering, Lahore Garrison University
[info] Discovered Python + SQL. Life direction: acquired.
[build] CINELYTICS — bronze/silver/analytics/ml/dashboard, all green.
[build] JobPulse Pakistan — 1,000+ job records ETL'd without incident.
[build] Balochistan Complaint Analytics — HDFS + YARN configured by hand.
[ship]  DevPilot — Final Year Project. React webview talking to OpenAI. Shipped.
[status] Seeking: Data Engineering / Analytics / Business Intelligence roles.
[note] 91st percentile, NSCT. Still double-checking that number is real. It is.`,
  "dreams.txt": `Things I want to build, eventually:
— A data platform that makes "trustworthy" the default, not an afterthought.
— An AI tool that actually understands a codebase, not just autocompletes it.
— A BI dashboard nobody has to be told to double-check.
— A team that argues about schema design as much as I do.

Not dreams, exactly. More like a backlog for a career.`,
  "bugs_fixed.md": `# Bugs fixed (a very incomplete list)

- [x] Off-by-one error that cost me an entire evening (MapReduce job)
- [x] DAX measure that was technically correct and completely misleading
- [x] Skill-extraction regex that matched "Java" inside "JavaScript" (oops)
- [x] Webview ↔ extension-host message that silently vanished into the void
- [x] SQLite write that "succeeded" but wrote to the wrong local file
- [ ] The bug currently hiding in whatever I ship next`,
};
function renderFiles(container, route){
  const sidebar = el("div", {style:"width:190px;border-right:1px solid var(--border);padding:14px 10px;flex:0 0 auto;overflow-y:auto;"});
  const main = el("div", {style:"flex:1;overflow-y:auto;padding:20px 24px;"});
  const folders = [
    { id:"documents", label:"📁 Documents" },
    { id:"projects", label:"📁 Projects" },
    { id:"resume", label:"📄 Resume" },
    { id:"blog", label:"📁 Blog" },
    { id:"research", label:"📁 Research" },
    { id:"experiments", label:"📁 Experiments" },
    { id:"certifications", label:"📁 Certifications" },
    { id:"achievements", label:"🏆 Achievements" },
    { id:"contact", label:"📇 Contact" },
    { id:"secrets", label:"🔒 Secrets" },
    { id:"system", label:"⚙ System" },
    { id:"downloads", label:"⬇ Downloads" },
    { id:"recycle", label:"🗑 Recycle Bin" },
  ];
  function sideItem(f){
    return el("div", {
      style:"padding:9px 10px;border-radius:8px;font-size:13px;cursor:pointer;color:var(--text-1);margin-bottom:2px;",
      onclick:(e)=>{ $all("div", sidebar).forEach(d=>d.style.background=""); e.target.style.background="var(--surface-hi)"; showFolder(f.id); }
    }, f.label);
  }
  folders.forEach(f=> sidebar.appendChild(sideItem(f)));

  function fileRow(name, sub, onclick){
    return el("div", {class:"blog-row", onclick},
      el("div", {}, el("h4",{},name), el("div",{class:"blog-meta"},sub)),
      el("span", {}, "→")
    );
  }
  function heading(t){ return el("h1", {class:"app-h", style:"font-size:18px;"}, t); }
  function showFolder(id){
    main.innerHTML = "";
    if(id === "documents"){
      main.appendChild(heading("Documents"));
      Object.keys(FS_FILES).forEach(name=> main.appendChild(fileRow(name, "Text file", ()=> showFile(name))));
    } else if(id === "projects"){
      main.appendChild(heading("Projects"));
      CONTENT.projects.forEach(p=> main.appendChild(fileRow(p.name+"/", p.tag, ()=> openApp("projects",{route:{project:p.id}}))));
    } else if(id === "resume"){
      main.appendChild(heading("Resume"));
      main.appendChild(fileRow(CONTENT.profile.resumeFile, "Open the interactive Resume app", ()=> openApp("resume")));
    } else if(id === "blog"){
      main.appendChild(heading("Blog"));
      CONTENT.blog.forEach(p=> main.appendChild(fileRow(p.title, `${p.date} · ${p.readTime} read`, ()=> openApp("blog",{route:{post:p.id}}))));
    } else if(id === "research"){
      main.appendChild(heading("Research"));
      main.appendChild(el("p", {class:"app-sub"}, "Nothing published here yet — this folder is reserved for deeper technical write-ups (e.g. skill-extraction accuracy, DAX performance benchmarks) as they're written up properly. Check the Blog for shorter-form notes in the meantime."));
    } else if(id === "experiments"){
      main.appendChild(heading("Experiments"));
      main.appendChild(el("p", {class:"app-sub"}, "Smaller, unfinished explorations that didn't become full projects live here eventually — this OS itself started as one. Nothing archived yet."));
    } else if(id === "certifications"){
      main.appendChild(heading("Certifications"));
      main.appendChild(el("p", {class:"app-sub"}, "No formal certifications listed yet — my Bachelor's in Software Engineering and the project work throughout this OS are the current proof of work."));
    } else if(id === "achievements"){
      main.appendChild(heading("Achievements"));
      const list = getAchievements();
      list.forEach(a=> main.appendChild(el("div", {class:"blog-row", style:"cursor:default;"},
        el("div", {}, el("h4",{style:a.unlocked?'':'opacity:.5;'}, (a.unlocked?"✓ ":"○ ")+a.name), el("div",{class:"blog-meta"}, a.desc)),
        el("span", {}, a.unlocked ? "🏆" : "")
      )));
      main.appendChild(el("p", {class:"app-sub", style:"margin-top:14px;"}, `${list.filter(a=>a.unlocked).length} / ${list.length} unlocked.`));
    } else if(id === "contact"){
      main.appendChild(heading("Contact"));
      main.appendChild(fileRow("Open Contact app", "Email, phone, GitHub, LinkedIn, QR code", ()=> openApp("contact")));
    } else if(id === "secrets"){
      main.appendChild(heading("Secrets"));
      main.appendChild(el("p", {class:"app-sub", style:"margin-bottom:14px;"}, "A few things are hidden around this OS. Some hints, if you want them:"));
      [
        "There's a classic 10-key code that unlocks something called 'Developer Mode.'",
        "The Terminal accepts a certain 'sudo' command that isn't really asking permission.",
        "The topbar logo isn't just decorative if you click it enough times.",
        "Not every terminal command is listed when you type 'help'."
      ].forEach(hint=> main.appendChild(el("div", {class:"blog-row", style:"cursor:default;"}, el("p", {style:"margin:0;font-size:13px;color:var(--text-1);"}, "🔒 "+hint))));
    } else if(id === "system"){
      main.appendChild(heading("System"));
      main.appendChild(fileRow("Display Settings", "Theme & wallpaper", ()=> openApp("settings")));
      main.appendChild(fileRow("achievements.json", "Local progress file", ()=> showFolder("achievements")));
      main.appendChild(el("p", {class:"app-sub", style:"margin-top:16px;"}, `${getAchievements().filter(a=>a.unlocked).length} / ${getAchievements().length} achievements unlocked. Check the Secrets folder for hints.`));
    } else if(id === "downloads"){
      main.appendChild(heading("Downloads"));
      main.appendChild(fileRow(CONTENT.profile.resumeFile, "Resume — click to download", ()=> window.open(CONTENT.profile.resumeFile,"_blank")));
    } else if(id === "recycle"){
      unlockAchievement("recycle_opened");
      main.appendChild(heading("Recycle Bin"));
      [
        ["untitled_final_v2_FINAL.py", "Deleted for the sake of everyone who'd have to read it."],
        ["console.log('why isnt this working').txt", "It was a semicolon."],
        ["regrettable_variable_names.txt", "temp2, temp2_final, ACTUAL_temp2."],
        ["my_first_ever_project.html", "Sentimental value only. Mostly <marquee> tags."]
      ].forEach(([name,sub])=> main.appendChild(fileRow(name, sub, ()=> notify("Nice try", "There's nothing left to restore here.", "🗑"))));
      main.appendChild(el("button", {class:"btn", style:"margin-top:14px;", onclick:()=> notify("Recycle Bin", "It was already empty. You just like clicking things.", "🗑")}, "Empty Recycle Bin"));
    }
  }
  function showFile(name){
    main.innerHTML = "";
    if(name === "career.log") unlockAchievement("files_opened");
    main.appendChild(el("div", {class:"back-link", onclick:()=>showFolder("documents")}, "← Documents"));
    main.appendChild(el("h1", {class:"app-h", style:"font-size:18px;"}, name));
    main.appendChild(el("pre", {style:"white-space:pre-wrap;font-family:var(--font-mono);font-size:12.5px;line-height:1.7;color:var(--text-1);background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px;"}, FS_FILES[name]));
  }

  container.appendChild(el("div", {class:"app", style:"flex-direction:row;padding:0;"}, sidebar, main));
  showFolder((route && route.folder) || "documents");
  sidebar.firstChild.style.background = "var(--surface-hi)";
}

/* ---------------------------------------------------------
   DESKTOP WIDGETS
   --------------------------------------------------------- */
const QUOTES = [
  "Make it work, make it correct, make it fast — in that order.",
  "Data quality is a feature, not a chore.",
  "Ship the smallest thing that teaches you something real.",
  "A dashboard is a promise. Keep it.",
  "Every pipeline is a conversation between now-you and 3am-you."
];
function initWidgets(){
  const stack = $("#desktop-widgets");
  if(!stack) return;

  stack.classList.add("widget-panel");
  stack.style.position = "absolute";
  stack.style.inset = "0";
  stack.style.zIndex = "20";
  stack.style.pointerEvents = "none";
  stack.style.overflow = "visible";
  stack.style.background = "transparent";
  stack.innerHTML = "";

  const defaultPositions = {
    clock: { left: 24, top: 56 },
    focus: { left: 24, top: 210 },
    weather: { left: 24, top: 360 },
    github: { left: 24, top: 520 },
    focusText: { left: 280, top: 56 },
    quote: { left: 280, top: 230 },
    streak: { left: 280, top: 390 },
    music: { left: 280, top: 520 },
  };
  const positions = loadWidgetPositions();

  const now = new Date();
  const clockCard = widgetCard("◷", "Local Time", el("div",{},
    el("div", {style:"font-family:var(--font-display);font-size:22px;", "data-clock":""}, fmtTime(now)),
    el("div", {style:"font-size:11px;color:var(--text-2);", "data-date":""}, fmtDate(now))
  ));

  const barFill = el("div", {style:"height:100%;width:40%;background:linear-gradient(90deg,var(--violet),var(--cyan));border-radius:6px;transition:width .6s ease;"});
  const focusMeterLabel = el("div", {style:"font-size:11px;color:var(--text-2);"}, "Loading day progress…");
  const focusCard = widgetCard("⚡", "Focus Meter", el("div",{},
    el("div", {style:"height:8px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;margin-bottom:6px;"}, barFill),
    focusMeterLabel
  ));
  function refreshFocusMeter(){
    const now = new Date();
    const workStart = 8;
    const workEnd = 18;
    const hours = now.getHours() + now.getMinutes()/60;
    const progress = Math.round(Math.min(100, Math.max(12, ((hours - workStart) / (workEnd - workStart)) * 100)));
    barFill.style.width = `${progress}%`;
    focusMeterLabel.textContent = `${progress}% through the workday`;
  }
  refreshFocusMeter();
  setInterval(refreshFocusMeter, 60_000);

  const weatherStatus = el("div", {style:"font-family:var(--font-display);font-size:20px;"}, "…");
  const weatherLocation = el("div", {style:"font-size:11px;color:var(--text-2);"}, CONTENT.profile.location);
  const weatherCard = widgetCard("☁", "Weather now", el("div",{}, weatherStatus, weatherLocation));
  function weatherCodeToText(code){
    const map = {0:"Clear",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Fog",51:"Light drizzle",53:"Moderate drizzle",55:"Heavy drizzle",61:"Light rain",63:"Rain",65:"Heavy rain",71:"Snow",73:"Heavy snow",80:"Rain showers",81:"Rain showers",95:"Thunderstorm"};
    return map[code] || "Clear";
  }
  function updateWeather(temp, desc, location){
    weatherStatus.textContent = `${temp}°C · ${desc}`;
    weatherLocation.textContent = location || CONTENT.profile.location;
  }
  updateWeather("…", "Fetching weather", CONTENT.profile.location);
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true&timezone=auto`)
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(data=>{
          if(data.current_weather){
            updateWeather(Math.round(data.current_weather.temperature), weatherCodeToText(data.current_weather.weathercode), data.timezone || CONTENT.profile.location);
          } else {
            updateWeather("N/A", "Weather unavailable");
          }
        }).catch(()=> updateWeather("N/A", "Weather unavailable"));
    }, ()=> updateWeather("N/A", "Location denied"));
  } else {
    updateWeather("N/A", "Geolocation unsupported");
  }

  const ghGrid = el("div", {style:"display:grid;grid-template-columns:repeat(18,7px);gap:3px;"});
  for(let i=0;i<18*7;i++){
    const v = Math.random();
    const shade = v>0.85?"var(--cyan)":v>0.6?"rgba(0,229,199,.5)":v>0.35?"rgba(0,229,199,.22)":"rgba(255,255,255,.06)";
    ghGrid.appendChild(el("div",{style:`width:7px;height:7px;border-radius:2px;background:${shade};`}));
  }
  const ghStatus = el("div", {style:"font-size:11px;color:var(--text-2);margin-top:10px;"}, "Loading GitHub stats…");
  const ghCard = widgetCard("⌥", "GitHub snapshot", el("div",{}, ghGrid, ghStatus));
  fetch("https://api.github.com/users/hooryaa")
    .then(r=> r.ok ? r.json() : Promise.reject())
    .then(data=>{
      ghStatus.textContent = `${data.public_repos} public repos · ${data.followers} followers`;
    }).catch(()=>{
      ghStatus.textContent = "GitHub stats unavailable";
    });

  const focusTextCard = widgetCard("◎", "Currently Exploring", el("p", {style:"font-size:12px;color:var(--text-1);margin:0;line-height:1.5;"}, CONTENT.profile.focus));

  const quoteText = el("p", {style:"font-size:12px;color:var(--text-1);margin:0;line-height:1.5;font-style:italic;"}, QUOTES[0]);
  const quoteCard = widgetCard("❝", "Quote", quoteText, ()=>{ quoteText.textContent = QUOTES[Math.floor(Math.random()*QUOTES.length)]; });

  // Coding streak — a small persistent counter of consecutive days visited
  const streakCard = widgetCard("🔥", "Coding Streak", el("div", {}, buildStreakContent()));
  function buildStreakContent(){
    const key = "hooria-os-streak";
    const today = new Date().toDateString();
    let data;
    try{ data = JSON.parse(localStorage.getItem(key) || "null"); }catch(e){ data = null; }
    if(!data){ data = { count:1, last:today }; }
    else if(data.last !== today){
      const yesterday = new Date(Date.now()-86400000).toDateString();
      data.count = (data.last === yesterday) ? data.count+1 : 1;
      data.last = today;
    }
    localStorage.setItem(key, JSON.stringify(data));
    return el("div", {},
      el("div", {style:"font-family:var(--font-display);font-size:22px;"}, `${data.count} day${data.count===1?"":"s"}`),
      el("div", {style:"font-size:11px;color:var(--text-2);"}, "Consecutive days you've opened Hooria OS")
    );
  }

  // Spotify-style mini music widget, mirrors the Music Player app's live state
  const npIcon = el("span", {style:"font-size:16px;"}, "▶");
  const npTitle = el("div", {style:"font-family:var(--font-display);font-size:13px;"}, "Nothing playing");
  const npSub = el("div", {style:"font-size:11px;color:var(--text-2);"}, "Click a track in Music Player");
  const npBar = el("div", {style:"display:flex;gap:3px;align-items:flex-end;height:16px;margin-top:8px;"});
  for(let i=0;i<10;i++) npBar.appendChild(el("div", {style:"width:3px;background:var(--cyan);border-radius:2px;height:20%;transition:height .3s ease;"}));
  const musicCard = widgetCard("▶", "Now Playing", el("div",{},
    el("div", {style:"display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--text-2);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-mono);"},
      npIcon, "Music Player"
    ),
    npTitle, npSub, npBar
  ), ()=> openApp("music"));
  let barAnim = null;
  function refreshNowPlaying(playingId){
    const track = MUSIC_TRACKS.find(t=>t.id===playingId);
    npIcon.textContent = track ? "⏸" : "▶";
    npTitle.textContent = track ? track.name : "Nothing playing";
    npSub.textContent = track ? "Playing — click to open" : "Click a track in Music Player";
    if(barAnim) clearInterval(barAnim);
    if(track){
      barAnim = setInterval(()=>{
        $all("div", npBar).forEach(b=> b.style.height = (15+Math.random()*85)+"%");
      }, 260);
    } else {
      $all("div", npBar).forEach(b=> b.style.height = "20%");
    }
  }
  MusicEngine.subscribe(refreshNowPlaying);
  refreshNowPlaying(MusicEngine.playingId);
  const widgets = [
    {id:"clock", el:clockCard},
    {id:"focus", el:focusCard},
    {id:"weather", el:weatherCard},
    {id:"github", el:ghCard},
    {id:"focusText", el:focusTextCard},
    {id:"quote", el:quoteCard},
    {id:"streak", el:streakCard},
    {id:"music", el:musicCard},
  ];

  widgets.forEach(widget => {
    const pos = positions[widget.id] || defaultPositions[widget.id] || { left: 24, top: 56 };
    widget.el.style.position = "absolute";
    widget.el.style.left = `${pos.left}px`;
    widget.el.style.top = `${pos.top}px`;
    widget.el.style.pointerEvents = "auto";
    widget.el.style.zIndex = "20";
    stack.appendChild(widget.el);
    makeWidgetDraggable(widget.el, widget.id);
  });

  function loadWidgetPositions(){
    try{ return JSON.parse(localStorage.getItem("hooria-os-widget-pos") || "{}"); }catch(e){ return {}; }
  }
  function saveWidgetPosition(id, left, top){
    const data = loadWidgetPositions();
    data[id] = { left, top };
    localStorage.setItem("hooria-os-widget-pos", JSON.stringify(data));
  }
  function makeWidgetDraggable(card, id){
    let dragging=false, startX=0, startY=0, origX=0, origY=0;
    card.addEventListener("mousedown", e=>{
      if(e.button !== 0) return;
      if(e.target.closest("a,button")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = card.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
      card.style.transition = "none";
      card.style.cursor = "grabbing";
      card.style.zIndex = "999";
      document.body.style.userSelect = "none";
    });
    window.addEventListener("mousemove", e=>{
      if(!dragging) return;
      const nextX = Math.min(window.innerWidth - card.offsetWidth - 8, Math.max(8, origX + e.clientX - startX));
      const nextY = Math.min(window.innerHeight - card.offsetHeight - 8, Math.max(44, origY + e.clientY - startY));
      card.style.left = `${nextX}px`;
      card.style.top = `${nextY}px`;
    });
    window.addEventListener("mouseup", ()=>{
      if(!dragging) return;
      dragging = false;
      card.style.transition = "transform .18s ease, box-shadow .18s ease";
      card.style.cursor = "grab";
      card.style.zIndex = "20";
      document.body.style.userSelect = "";
      saveWidgetPosition(id, parseInt(card.style.left,10), parseInt(card.style.top,10));
    });
  }

  const saved = localStorage.getItem("hooria-os-widgets");
  if(saved === "0") stack.style.display = "none";
}
function widgetCard(icon, title, content, onclick){
  return el("div", {
    class:"widget-card",
    style:"width:220px;min-height:92px;background:rgba(20,20,24,.88);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;backdrop-filter:blur(16px);cursor:grab;",
    onclick: onclick || null
  },
    el("div", {class:"widget-card-header"},
      el("div", {style:"display:flex;align-items:center;gap:8px;color:var(--text-2);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-family:var(--font-mono);"},
        el("span", {}, icon), title
      ),
      el("span", {class:"widget-card-drag-handle", title:"Drag to move"}, "⠿")
    ),
    content
  );
}
function toggleWidgets(){
  const stack = $("#desktop-widgets");
  if(!stack) return;
  const hidden = stack.style.display === "none";
  stack.style.display = hidden ? "flex" : "none";
  localStorage.setItem("hooria-os-widgets", hidden ? "1":"0");
}

Object.assign(APP_REGISTRY, {
  paint: renderPaint,
  notes: renderNotes,
  music: renderMusic,
  arcade: renderArcade,
  files: renderFiles,
  settings: renderThemePicker,
});
