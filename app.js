/* ============================================================
   HOORIA OS — ENGINE
   ============================================================ */

const APPS = {
  projects:    { title: "Projects",     glyph: "◆", w: 860, h: 560, group:1 },
  about:       { title: "About",        glyph: "◎", w: 640, h: 520, group:1 },
  experience:  { title: "Experience",   glyph: "▤", w: 640, h: 480, group:1 },
  skills:      { title: "Skills",       glyph: "✦", w: 760, h: 520, group:1 },
  architecture:{ title: "Architecture", glyph: "⌗", w: 900, h: 560, group:1 },
  blog:        { title: "Blog",         glyph: "✎", w: 700, h: 560, group:1 },
  resume:      { title: "Resume",       glyph: "▥", w: 620, h: 560, group:1 },
  contact:     { title: "Contact",      glyph: "◉", w: 560, h: 460, group:1 },
  terminal:    { title: "Terminal",     glyph: "❯", w: 680, h: 440, group:2 },
  files:       { title: "File Explorer",glyph: "▧", w: 780, h: 560, group:2 },
  settings:    { title: "Display",      glyph: "⚙", w: 680, h: 560, group:2 },
  paint:       { title: "Paint",        glyph: "🖌", w: 820, h: 620, group:3 },
  notes:       { title: "Sticky Notes", glyph: "▨", w: 360, h: 300, group:3 },
  music:       { title: "Music Player", glyph: "♪", w: 360, h: 420, group:3 },
  arcade:      { title: "Arcade",       glyph: "▶", w: 620, h: 560, group:3 },
};

// Registry other files (terminal.js, apps-extra.js) can add render functions into.
const APP_REGISTRY = {};

const state = {
  windows: {},      // id -> {el, appId, minimized, maxed, prevRect, z}
  zTop: 10,
  openOrder: [],
  soundOn: false,
  devMode: false,
  logoClicks: 0,
  isMobile: window.matchMedia("(max-width:760px)").matches || matchMedia("(pointer:coarse) and (max-width:900px)").matches,
};

/* ---------------- achievements ---------------- */
const ACHIEVEMENTS = {
  terminal_egg:   { name: "Digital Archaeologist", desc: "Ran 'easteregg' in the terminal." },
  konami:         { name: "Developer Mode", desc: "Entered the Konami code." },
  sudo_hire:      { name: "Hired (Unofficially)", desc: "Ran 'sudo hire-hooria'." },
  logo_clicks:    { name: "Persistent Clicker", desc: "Clicked the logo 10 times." },
  snake_played:   { name: "Snake Charmer", desc: "Played a round of Snake." },
  tictactoe_win:  { name: "Unbeaten", desc: "Won a game of Tic-Tac-Toe." },
  typing_done:    { name: "Fast Fingers", desc: "Completed the typing test." },
  minesweeper_won:{ name: "Deminer", desc: "Cleared a Minesweeper board." },
  reached_2048:   { name: "Powers of Two", desc: "Reached the 2048 tile." },
  files_opened:   { name: "Nosy", desc: "Opened career.log in File Explorer." },
  recycle_opened: { name: "Dumpster Diver", desc: "Looked inside the Recycle Bin." },
};
function unlockAchievement(id){
  const store = JSON.parse(localStorage.getItem("hooria-os-achievements") || "{}");
  if(store[id]) return;
  store[id] = true;
  localStorage.setItem("hooria-os-achievements", JSON.stringify(store));
  const a = ACHIEVEMENTS[id];
  if(a) notify("Achievement unlocked — " + a.name, a.desc, "🏆");
}
function getAchievements(){
  const store = JSON.parse(localStorage.getItem("hooria-os-achievements") || "{}");
  return Object.keys(ACHIEVEMENTS).map(id=>({ id, ...ACHIEVEMENTS[id], unlocked: !!store[id] }));
}

/* ---------------- utils ---------------- */
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }
function el(tag, attrs={}, ...children){
  const e = document.createElement(tag);
  for(const k in attrs){
    if(k === "class") e.className = attrs[k];
    else if(k === "html") e.innerHTML = attrs[k];
    else if(k.startsWith("on") && typeof attrs[k] === "function") e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  children.flat().forEach(c=>{
    if(c==null) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}
function fmtTime(d){
  return d.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
}
function fmtDate(d){
  return d.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric'});
}
function esc(s){ const d=document.createElement('div'); d.textContent = s; return d.innerHTML; }

/* ---------------- clock ---------------- */
function tickClocks(){
  const now = new Date();
  $all("[data-clock]").forEach(n => n.textContent = fmtTime(now));
  $all("[data-date]").forEach(n => n.textContent = fmtDate(now));
}
setInterval(tickClocks, 1000);

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
function runBoot(){
  const corePhrases = [
    "loading kernel modules…",
    "mounting /projects…",
    "calibrating aperture…",
    "warming dock…",
  ];
  const flavorPool = [
    "indexing DevPilot extension host…",
    "spinning up CINELYTICS bronze layer…",
    "warehousing JobPulse skill graph…",
    "optimizing DAX measures…",
    "configuring HDFS namenode…",
    "validating ETL checksums…",
    "resolving OpenAI API handshake…",
    "compiling TypeScript definitions…",
    "brewing coffee.exe…",
    "checking for Konami code sensors…",
  ];
  const shuffled = flavorPool.sort(()=>Math.random()-0.5).slice(0,3);
  const logs = [...corePhrases.slice(0,2), ...shuffled, "hooria-os ready."];
  const logEl = $("#boot-log");
  const bar = $("#boot-bar-fill");
  let i = 0;
  let pct = 0;
  const step = () => {
    if(i < logs.length){
      logEl.textContent = logs[i];
      i++;
      pct = Math.min(100, pct + 100/logs.length);
      bar.style.width = pct + "%";
      setTimeout(step, 340 + Math.random()*160);
    } else {
      setTimeout(()=>{
        $("#boot-screen").classList.add("hide");
        setTimeout(()=> $("#boot-screen").style.display = "none", 750);
      }, 220);
    }
  };
  step();
}

/* ============================================================
   LOCK SCREEN
   ============================================================ */
function initLock(){
  const lock = $("#lock-screen");
  const unlock = () => {
    lock.classList.add("hide");
    $("#desktop").classList.add("show");
    notify("Welcome back", "Hooria OS unlocked — explore the dock below or press ⌘K.", "◆");
  };
  lock.addEventListener("click", unlock);
  window.addEventListener("keydown", (e)=>{
    if(!lock.classList.contains("hide") && e.key !== "Tab") unlock();
  }, { once:false });
}

/* ============================================================
   NOTIFICATIONS
   ============================================================ */
function notify(title, body, icon="◆"){
  const stack = $("#notif-stack");
  const n = el("div", {class:"notif"},
    el("div", {class:"n-icon"}, icon),
    el("div", {},
      el("b", {}, title),
      el("p", {}, body)
    )
  );
  stack.appendChild(n);
  setTimeout(()=>{
    n.classList.add("out");
    setTimeout(()=> n.remove(), 300);
  }, 4200);
}

/* ============================================================
   WINDOW MANAGER
   ============================================================ */
function openApp(appId, opts={}){
  if(state.isMobile) return openMobile(appId, opts);

  if(state.windows[appId] && !opts.forceNew){
    const w = state.windows[appId];
    if(w.minimized){ w.minimized = false; w.el.classList.remove("minimized"); }
    focusWindow(appId);
    if(opts.route) renderAppRoute(appId, opts.route);
    return;
  }

  const meta = APPS[appId];
  const idx = state.openOrder.length;
  const stored = loadWindowRects()[appId];
  const baseX = stored ? parseInt(stored.left) : 90 + (idx % 6) * 34;
  const baseY = stored ? parseInt(stored.top) : 56 + (idx % 6) * 28;
  const baseW = stored ? stored.width : meta.w + "px";
  const baseH = stored ? stored.height : meta.h + "px";

  const winEl = el("div", {
    class:"win", style:`width:${baseW};height:${baseH};left:${baseX}px;top:${baseY}px;z-index:${++state.zTop}`
  });

  const titlebar = el("div", {class:"win-titlebar"},
    el("div", {class:"win-controls"},
      el("button", {class:"win-btn close", "aria-label":"Close", onclick:(e)=>{e.stopPropagation(); closeWindow(appId);}}, "×"),
      el("button", {class:"win-btn min", "aria-label":"Minimize", onclick:(e)=>{e.stopPropagation(); minimizeWindow(appId);}}, "–"),
      el("button", {class:"win-btn max", "aria-label":"Maximize", onclick:(e)=>{e.stopPropagation(); toggleMaxWindow(appId);}}, "+")
    ),
    el("div", {class:"win-title"}, el("span",{class:"glyph"}, meta.glyph), meta.title)
  );

  const body = el("div", {class:"win-body", id:`winbody-${appId}`});
  const resizeHandle = el("div", {class:"win-resize"});

  winEl.appendChild(titlebar);
  winEl.appendChild(body);
  winEl.appendChild(resizeHandle);
  $("#windows-layer").appendChild(winEl);

  state.windows[appId] = { el: winEl, appId, minimized:false, maxed:false, prevRect:null };
  state.openOrder.push(appId);

  makeDraggable(winEl, titlebar, appId);
  makeResizable(winEl, resizeHandle, appId);
  winEl.addEventListener("mousedown", ()=> focusWindow(appId));
  titlebar.addEventListener("dblclick", ()=> toggleMaxWindow(appId));

  renderApp(appId, body, opts.route);
  focusWindow(appId);
  setDockRunning(appId, true);
}

function focusWindow(appId){
  const w = state.windows[appId];
  if(!w) return;
  w.el.style.zIndex = ++state.zTop;
  $all(".win").forEach(x=>x.style.opacity = "");
}

function closeWindow(appId){
  const w = state.windows[appId];
  if(!w) return;
  w.el.classList.add("closing");
  delete state.windows[appId];
  state.openOrder = state.openOrder.filter(a=>a!==appId);
  setDockRunning(appId, false);
  setTimeout(()=>{ w.el.remove(); }, 170);
}

function minimizeWindow(appId){
  const w = state.windows[appId];
  if(!w) return;
  w.minimized = true;
  w.el.classList.add("minimized");
}

function toggleMaxWindow(appId){
  const w = state.windows[appId];
  if(!w) return;
  if(!w.maxed){
    w.prevRect = { left:w.el.style.left, top:w.el.style.top, width:w.el.style.width, height:w.el.style.height };
    w.el.style.left = "0px"; w.el.style.top = "0px";
    w.el.style.width = "100%"; w.el.style.height = "100%";
    w.el.classList.add("maxed");
    w.maxed = true;
  } else {
    Object.assign(w.el.style, w.prevRect);
    w.el.classList.remove("maxed");
    w.maxed = false;
  }
}

function setDockRunning(appId, running){
  const dot = $(`.dock-item[data-app="${appId}"] .dock-dot`);
  if(!dot) return;
  const item = dot.closest(".dock-item");
  if(running) item.classList.add("running"); else item.classList.remove("running");
}

function makeDraggable(winEl, handle, appId){
  let sx, sy, ox, oy, dragging=false;
  handle.addEventListener("mousedown", (e)=>{
    if(e.target.closest(".win-btn")) return;
    const w = state.windows[appId];
    if(w.maxed) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    const rect = winEl.getBoundingClientRect();
    ox = rect.left; oy = rect.top;
    document.body.style.userSelect = "none";
  });
  window.addEventListener("mousemove", (e)=>{
    if(!dragging) return;
    const nx = Math.max(0, ox + (e.clientX - sx));
    const ny = Math.max(34, oy + (e.clientY - sy));
    winEl.style.left = nx + "px";
    winEl.style.top = ny + "px";
  });
  window.addEventListener("mouseup", (e)=>{
    if(dragging){
      if(e.clientX < 8) snapWindow(appId, "left");
      else if(e.clientX > window.innerWidth-8) snapWindow(appId, "right");
      else saveWindowRect(appId);
    }
    dragging=false; document.body.style.userSelect = "";
  });
}

function makeResizable(winEl, handle, appId){
  let sx, sy, sw, sh, resizing=false;
  handle.addEventListener("mousedown", (e)=>{
    e.stopPropagation();
    resizing = true;
    sx = e.clientX; sy = e.clientY;
    sw = winEl.offsetWidth; sh = winEl.offsetHeight;
  });
  window.addEventListener("mousemove", (e)=>{
    if(!resizing) return;
    winEl.style.width = Math.max(340, sw + (e.clientX - sx)) + "px";
    winEl.style.height = Math.max(240, sh + (e.clientY - sy)) + "px";
  });
  window.addEventListener("mouseup", ()=>{
    if(resizing) saveWindowRect(appId);
    resizing=false;
  });
}

/* ============================================================
   APP RENDERERS
   ============================================================ */
Object.assign(APP_REGISTRY, {
  projects: renderProjects,
  about: renderAbout,
  experience: renderExperience,
  skills: renderSkills,
  architecture: renderArchitecture,
  blog: renderBlog,
  resume: renderResume,
  contact: renderContact,
});
function renderApp(appId, container, route){
  container.innerHTML = "";
  const fn = APP_REGISTRY[appId];
  if(fn) fn(container, route);
  else container.appendChild(el("div", {class:"app-scroll"}, "This app is still loading…"));
}
function renderAppRoute(appId, route){
  const w = state.windows[appId];
  if(!w) return;
  renderApp(appId, w.el.querySelector(".win-body"), route);
}

/* ---- Projects ---- */
function renderProjects(container, route){
  const wrap = el("div", {class:"app"});
  if(route && route.project){
    const p = CONTENT.projects.find(x=>x.id === route.project);
    wrap.appendChild(el("div", {class:"app-scroll"},
      el("div", {class:"back-link", onclick:()=>renderAppRoute("projects", {})}, "← All projects"),
      el("span", {class:"eyebrow"}, p.tag),
      el("h1", {class:"app-h"}, p.name),
      el("p", {class:"app-sub"}, p.summary),
      el("div", {class:"proj-stack", style:"margin-bottom:22px;"}, p.stack.map(s=>el("span",{class:"chip"},s))),
      el("div", {class:"case-links", style:"margin-bottom:8px;"},
        ...(p.demo ? [el("a", {class:"btn primary", href:p.demo, target:"_blank", rel:"noopener"}, "View demo")] : []),
        ...(p.video ? [el("a", {class:"btn", href:p.video, target:"_blank", rel:"noopener"}, "Video demo")] : []),
        ...(p.github ? [el("a", {class:"btn", href:p.github, target:"_blank", rel:"noopener"}, "GitHub ↗")] : [])
      ),
      el("div", {class:"divider"}),
      caseSection("Overview", p.overview),
      caseSection("Problem", p.problem),
      caseSection("Research", p.research),
      caseSection("Architecture", p.architecture),
      caseSection("Implementation", p.implementation),
      p.id === "jobpulse" ? renderJobPulseMap() : null,
      caseSection("Challenges", p.challenges),
      caseSection("Lessons learned", p.lessons),
      caseSection("Future improvements", p.future),
      el("div", {class:"case-section"},
        el("h4", {}, "At a glance"),
        el("div", {class:"case-result"}, p.highlights.map(r=>
          el("div", {class:"stat"}, el("b",{style:"font-size:15px;"}, r.value), el("span",{}, r.label))
        ))
      )
    ));
  } else {
    wrap.appendChild(el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Selected work"),
      el("h1", {class:"app-h"}, "Projects"),
      el("p", {class:"app-sub"}, "Seven real projects — the problem, the architecture, and what I actually learned building each one."),
      el("div", {class:"proj-grid"}, CONTENT.projects.map(p=>
        el("div", {class:"proj-card", tabindex:"0", onclick:()=>renderAppRoute("projects", {project:p.id})},
          el("span", {class:"proj-tag"}, p.tag),
          el("h3", {}, `${p.glyph}  ${p.name}`),
          el("p", {}, p.summary),
          el("div", {class:"proj-stack"}, p.stack.slice(0,4).map(s=>el("span",{class:"chip"},s)))
        )
      ))
    ));
  }
  container.appendChild(wrap);
}
function caseSection(title, text, list){
  const s = el("div", {class:"case-section"}, el("h4", {}, title));
  if(text) s.appendChild(el("p", {}, text));
  if(list) s.appendChild(el("ul", {style:"margin:0;padding-left:18px;"}, list.map(li=>el("li",{},li))));
  return s;
}

function renderJobPulseMap(){
  const cities = [
    { name:"Lahore", x:62, y:46, size:34, note:"Highest listing volume" },
    { name:"Karachi", x:38, y:78, size:30, note:"Strong fintech & BI demand" },
    { name:"Islamabad", x:56, y:20, size:24, note:"Gov + telecom hiring" },
    { name:"Peshawar", x:34, y:16, size:14, note:"Emerging tech hub" },
    { name:"Faisalabad", x:56, y:60, size:16, note:"Industrial + automation roles" },
  ];
  const wrap = el("div", {class:"case-section"},
    el("h4", {}, "Regional hiring activity (illustrative)"),
    el("p", {style:"margin-bottom:12px;"}, "A simplified, stylized view of where JobPulse sees the most hiring activity — not to scale, for illustration only. Click a city for a quick note.")
  );
  const mapBox = el("div", {style:"position:relative;height:230px;border-radius:14px;border:1px solid var(--border-hi);background:radial-gradient(600px 400px at 50% 30%, rgba(124,92,255,.08), transparent 60%);overflow:hidden;"});
  const note = el("div", {style:"margin-top:10px;font-size:12.5px;color:var(--cyan);min-height:18px;"}, "Click a city marker above.");
  cities.forEach(c=>{
    const dot = el("div", {
      style:`position:absolute;left:${c.x}%;top:${c.y}%;width:${c.size}px;height:${c.size}px;margin:-${c.size/2}px 0 0 -${c.size/2}px;
             border-radius:50%;background:rgba(0,229,199,.22);border:1.5px solid var(--cyan);cursor:pointer;
             display:flex;align-items:center;justify-content:center;transition:transform .15s ease;`,
      onclick:()=>{ note.textContent = `${c.name} — ${c.note}`; }
    });
    dot.onmouseenter = ()=> dot.style.transform = "scale(1.18)";
    dot.onmouseleave = ()=> dot.style.transform = "scale(1)";
    const label = el("div", {style:`position:absolute;left:${c.x}%;top:calc(${c.y}% + ${c.size/2 + 6}px);transform:translateX(-50%);font-family:var(--font-mono);font-size:10px;color:var(--text-2);white-space:nowrap;`}, c.name);
    mapBox.appendChild(dot); mapBox.appendChild(label);
  });
  wrap.appendChild(mapBox);
  wrap.appendChild(note);
  return wrap;
}

/* ---- About ---- */
function renderAbout(container){
  const e = CONTENT.profile.education;
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "How I got here"),
      el("h1", {class:"app-h"}, "About"),
      el("p", {class:"app-sub"}, CONTENT.profile.summary),
      el("div", {class:"status-pill", style:"margin-bottom:24px;"},
        el("span",{class:"dot"}), `${e.degree}, ${e.school} · ${e.year} · ${e.note}`
      ),
      el("div", {class:"timeline"}, CONTENT.about.map(t=>
        el("div", {class:"tl-item"},
          el("div", {class:"tl-dot"}),
          el("div", {class:"tl-year"}, t.year),
          el("h4", {}, t.title),
          el("p", {}, t.body)
        )
      ))
    )
  ));
}

/* ---- Experience ---- */
function renderExperience(container){
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Career timeline"),
      el("h1", {class:"app-h"}, "Experience"),
      el("p", {class:"app-sub"}, "Freelance work, internships, and the roles that shaped how I build."),
      el("div", {class:"timeline"}, CONTENT.experience.map(t=>
        el("div", {class:"tl-item"},
          el("div", {class:"tl-dot"}),
          el("div", {class:"tl-year"}, t.year),
          el("h4", {}, t.role),
          el("p", {}, t.body)
        )
      ))
    )
  ));
}

/* ---- Skills ---- */
function renderSkills(container){
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Capabilities, not bars"),
      el("h1", {class:"app-h"}, "Skills"),
      el("p", {class:"app-sub"}, "What I actually do, grouped by capability rather than a meaningless percentage."),
      el("div", {class:"skill-grid"}, CONTENT.skills.map(s=>
        el("div", {class:"skill-card"},
          el("div", {class:"sk-icon"}, s.icon),
          el("h4", {}, s.title),
          el("p", {}, s.body)
        )
      ))
    )
  ));
}

/* ---- Architecture (zoomable diagram playground) ---- */
function renderArchitecture(container){
  let activeIdx = 0, scale = 1, panX = 40, panY = 20;

  const tabs = el("div", {class:"arch-tabs"});
  const canvasWrap = el("div", {class:"arch-canvas-wrap"});
  const canvas = el("div", {class:"arch-canvas"});
  const detailPanel = el("div", {class:"arch-detail"}, el("p",{},"Click any stage above to read what it does."));
  const zoomCtl = el("div", {class:"arch-zoom-controls"},
    el("button", {onclick:()=>setScale(scale+0.15), "aria-label":"Zoom in"}, "+"),
    el("button", {onclick:()=>setScale(scale-0.15), "aria-label":"Zoom out"}, "–"),
    el("button", {onclick:()=>{scale=1;panX=40;panY=20;applyT();}, "aria-label":"Reset view"}, "⟳")
  );
  canvasWrap.appendChild(canvas);
  canvasWrap.appendChild(zoomCtl);

  function applyT(){ canvas.style.transform = `translate(${panX}px,${panY}px) scale(${scale})`; }
  function setScale(v){ scale = Math.min(2.2, Math.max(0.4, v)); applyT(); }

  function drawDiagram(idx){
    activeIdx = idx;
    const d = CONTENT.architectures[idx];
    canvas.innerHTML = "";
    canvas.style.width = "1200px"; canvas.style.height = "360px";
    detailPanel.innerHTML = "";
    detailPanel.appendChild(el("p",{}, `Click any stage in "${d.label}" to read what it does.`));

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width","1200"); svg.setAttribute("height","360");
    svg.style.position = "absolute"; svg.style.left="0"; svg.style.top="0"; svg.style.pointerEvents="none";
    const sorted = [...d.nodes].sort((a,b)=>a.x-b.x);
    for(let i=0;i<sorted.length-1;i++){
      const a = sorted[i], b = sorted[i+1];
      const x1=a.x+a.w, y1=a.y+20, x2=b.x, y2=b.y+20;
      const line = document.createElementNS("http://www.w3.org/2000/svg","line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      line.setAttribute("stroke", "rgba(255,255,255,.18)");
      line.setAttribute("stroke-width","1.5");
      svg.appendChild(line);
      // animated flow dot travelling along this connector
      const dot = document.createElementNS("http://www.w3.org/2000/svg","circle");
      dot.setAttribute("r","3.2"); dot.setAttribute("fill","var(--cyan)");
      const anim = document.createElementNS("http://www.w3.org/2000/svg","animateMotion");
      anim.setAttribute("dur", (2.2 + i*0.35).toFixed(2)+"s");
      anim.setAttribute("repeatCount","indefinite");
      anim.setAttribute("path", `M${x1},${y1} L${x2},${y2}`);
      dot.appendChild(anim);
      svg.appendChild(dot);
    }
    canvas.appendChild(svg);

    d.nodes.forEach(n=>{
      const node = el("div", {
        class:`arch-node ${n.cls}`, tabindex:"0",
        style:`left:${n.x}px;top:${n.y}px;width:${n.w}px;cursor:pointer;`,
        onclick:()=>showDetail(n)
      }, n.label, el("small",{}, n.sub));
      canvas.appendChild(node);
    });
    applyT();
    $all(".arch-tab", tabs).forEach((t,i)=>t.classList.toggle("active", i===idx));
  }

  function showDetail(n){
    detailPanel.innerHTML = "";
    detailPanel.appendChild(el("div", {style:"display:flex;align-items:baseline;gap:10px;margin-bottom:4px;"},
      el("h4", {style:"margin:0;font-family:var(--font-display);font-size:14.5px;color:var(--text-0);"}, n.label),
      el("span", {style:"font-family:var(--font-mono);font-size:10.5px;color:var(--text-2);"}, n.sub)
    ));
    detailPanel.appendChild(el("p", {}, n.detail || `Part of the pipeline — ${n.label} handles "${n.sub}" before passing data to the next stage.`));
  }

  CONTENT.architectures.forEach((d,i)=>{
    tabs.appendChild(el("div", {class:"arch-tab", onclick:()=>drawDiagram(i)}, d.label));
  });

  let panning=false, psx,psy,ppx,ppy, movedDuringDrag=false;
  canvasWrap.addEventListener("mousedown",(e)=>{
    if(e.target.closest(".arch-zoom-controls")) return;
    panning=true; movedDuringDrag=false; psx=e.clientX; psy=e.clientY; ppx=panX; ppy=panY;
  });
  window.addEventListener("mousemove",(e)=>{
    if(!panning) return;
    if(Math.abs(e.clientX-psx)>3 || Math.abs(e.clientY-psy)>3) movedDuringDrag=true;
    panX = ppx + (e.clientX-psx); panY = ppy + (e.clientY-psy);
    applyT();
  });
  window.addEventListener("mouseup",()=>panning=false);
  canvasWrap.addEventListener("wheel",(e)=>{
    e.preventDefault();
    setScale(scale + (e.deltaY < 0 ? 0.08 : -0.08));
  }, {passive:false});

  container.appendChild(el("div", {class:"app", style:"padding:0;"},
    el("div", {style:"padding:20px 24px 0;"},
      el("span", {class:"eyebrow"}, "Interactive playground"),
      el("h1", {class:"app-h", style:"margin-bottom:2px;"}, "Architecture"),
      el("p", {class:"app-sub", style:"margin-bottom:6px;"}, "Drag to pan, scroll or use the controls to zoom, and click any stage for an explanation.")
    ),
    tabs, canvasWrap, detailPanel
  ));
  drawDiagram(0);
}

/* ---- Terminal ---- */
function renderTerminal(container){
  const history = [];
  const lines = el("div", {});
  const inputRow = el("div", {class:"term-input-row"},
    el("span", {class:"prompt"}, "hooria@os"), el("span",{},":"), el("span",{class:"path"},"~"), el("span",{},"$"),
  );
  const input = el("input", {type:"text", autocomplete:"off", spellcheck:"false", "aria-label":"Terminal input"});
  inputRow.appendChild(input);

  const termWrap = el("div", {class:"terminal", tabindex:"0"});
  termWrap.appendChild(lines);
  termWrap.appendChild(inputRow);
  container.appendChild(el("div", {class:"app"}, termWrap));

  function print(text, cls=""){
    lines.appendChild(el("div", {class:`tl-line ${cls}`}, text));
    termWrap.scrollTop = termWrap.scrollHeight;
  }
  function printHTML(html){
    const d = el("div", {class:"tl-line", html});
    lines.appendChild(d);
    termWrap.scrollTop = termWrap.scrollHeight;
  }

  print("Hooria OS Terminal v1.0 — type 'help' to see available commands.");
  print("");

  const commands = {
    help(){
      print("Available commands:");
      ["about","projects","skills","experience","resume","contact","github","linkedin",
       "open <app>","theme","whoami","search <query>","easteregg","clear","date"]
        .forEach(c=>print("  " + c));
    },
    about(){ print(CONTENT.profile.tagline); openApp("about"); },
    projects(){
      CONTENT.projects.forEach(p=>print(`  ${p.glyph}  ${p.id.padEnd(18)} ${p.tag}`));
      openApp("projects");
    },
    skills(){ CONTENT.skills.forEach(s=>print(`  ${s.icon}  ${s.title}`)); openApp("skills"); },
    experience(){ openApp("experience"); print("Opened Experience."); },
    resume(){ openApp("resume"); print("Opened Resume."); },
    contact(){ openApp("contact"); print(`Email: ${CONTENT.profile.email}`); },
    github(){ print(CONTENT.profile.github); window.open(CONTENT.profile.github, "_blank"); },
    linkedin(){ print(CONTENT.profile.linkedin); window.open(CONTENT.profile.linkedin, "_blank"); },
    whoami(){ print(`${CONTENT.profile.name} — ${CONTENT.profile.role}`); },
    theme(){ document.body.classList.toggle("theme-alt"); print("theme toggled."); },
    date(){ print(new Date().toString()); },
    clear(){ lines.innerHTML = ""; },
    easteregg(){
      printHTML(`<pre style="margin:0;font-size:10px;line-height:1.1;color:var(--cyan)">   ▲ ▲\n  ( ◕ ‿ ◕ )\n   you found the aperture's secret.\n   thanks for reading this deep. — hooria</pre>`);
    },
    open(arg){
      const id = (arg||"").replace(/^open\s+/,"").trim();
      const map = { devpilot:"devpilot", cinelytics:"cinelytics", "prestige":"prestige", simplewrite:"simplewrite", jobpulse:"jobpulse" };
      if(map[id]){ openApp("projects", {route:{project:id}}); print(`Opening ${id}…`); }
      else if(APPS[id]){ openApp(id); print(`Opening ${id}…`); }
      else print(`open: unknown target '${id}'`);
    },
    search(arg){
      const q = (arg||"").toLowerCase();
      const hits = CONTENT.projects.filter(p=> (p.name+p.summary+p.stack.join(" ")).toLowerCase().includes(q));
      if(!hits.length) print(`No results for "${arg}".`);
      else hits.forEach(h=>print(`  match → ${h.name}`));
    }
  };

  input.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      const raw = input.value;
      print(`hooria@os:~$ ${esc(raw)}`);
      history.push(raw); 
      const [cmd, ...rest] = raw.trim().split(/\s+/);
      const arg = rest.join(" ");
      if(cmd === "search") commands.search(arg);
      else if(cmd === "open") commands.open(rest.join(" "));
      else if(commands[cmd]) commands[cmd](arg);
      else if(cmd) print(`command not found: ${cmd} (try 'help')`);
      input.value = "";
    }
  });
  termWrap.addEventListener("click", ()=> input.focus());
  setTimeout(()=>input.focus(), 60);
}

/* ---- Blog ---- */
function renderBlog(container, route){
  const wrap = el("div", {class:"app"});
  if(route && route.post){
    const p = CONTENT.blog.find(x=>x.id===route.post);
    wrap.appendChild(el("div", {class:"app-scroll"},
      el("div", {class:"back-link", onclick:()=>renderAppRoute("blog",{})}, "← All posts"),
      el("span", {class:"eyebrow"}, `${p.date} · ${p.readTime} read`),
      el("h1", {class:"app-h"}, p.title),
      el("div", {class:"blog-body"}, el("p",{},p.body))
    ));
  } else {
    wrap.appendChild(el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Field notes"),
      el("h1", {class:"app-h"}, "Blog"),
      el("p", {class:"app-sub"}, "Short essays on AI, architecture, and what building these projects actually taught me."),
      el("div", {class:"blog-list"}, CONTENT.blog.map(p=>
        el("div", {class:"blog-row", onclick:()=>renderAppRoute("blog",{post:p.id})},
          el("div", {},
            el("h4", {}, p.title),
            el("div", {class:"blog-meta"}, `${p.date} · ${p.readTime} read`)
          ),
          el("span", {}, "→")
        )
      ))
    ));
  }
  container.appendChild(wrap);
}

/* ---- Resume ---- */
function renderResume(container){
  const skillLevels = [
    { name:"Data Engineering", pct:90 }, { name:"Business Intelligence", pct:85 },
    { name:"Python / SQL", pct:88 }, { name:"AI / LLM Integration", pct:75 },
    { name:"Full-Stack Development", pct:78 }, { name:"Big Data (Hadoop)", pct:65 },
  ];
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll", id:"resume-print-area"},
      el("div", {style:"display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;"},
        el("div",{},
          el("span", {class:"eyebrow"}, "Interactive"),
          el("h1", {class:"app-h"}, "Resume"),
          el("p", {class:"app-sub"}, `${CONTENT.profile.name} — ${CONTENT.profile.role}. ${CONTENT.profile.location}.`)
        ),
        el("div", {style:"display:flex;gap:8px;"},
          el("button", {class:"btn", onclick:()=>window.print()}, "🖨 Print"),
          el("a", {class:"btn primary", href:CONTENT.profile.resumeFile, target:"_blank"}, "⬇ Download PDF")
        )
      ),
      el("div", {class:"divider"}),
      el("h4", {style:"font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin:0 0 14px;"}, "Skills graph"),
      el("div", {style:"display:flex;flex-direction:column;gap:10px;margin-bottom:26px;max-width:480px;"}, skillLevels.map(s=>
        el("div", {},
          el("div", {style:"display:flex;justify-content:space-between;font-size:12px;color:var(--text-1);margin-bottom:4px;"},
            el("span",{},s.name), el("span",{style:"color:var(--text-2);"}, s.pct+"%")
          ),
          el("div", {style:"height:7px;border-radius:5px;background:rgba(255,255,255,.07);overflow:hidden;"},
            el("div", {style:`height:100%;width:${s.pct}%;border-radius:5px;background:linear-gradient(90deg,var(--violet),var(--cyan));`})
          )
        )
      )),
      el("h4", {style:"font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin:0 0 14px;"}, "Experience timeline"),
      el("div", {class:"timeline"}, CONTENT.experience.map(t=>
        el("div", {class:"tl-item"},
          el("div", {class:"tl-dot"}),
          el("div", {class:"tl-year"}, t.year),
          el("h4", {}, t.role),
          el("p", {}, t.body)
        )
      ))
    )
  ));
}

/* ---- Contact ---- */
function copyToClipboard(text, label){
  navigator.clipboard?.writeText(text).then(()=>{
    notify("Copied", `${label} copied to clipboard.`, "⧉");
  }).catch(()=>{
    notify("Couldn't copy", "Your browser blocked clipboard access.", "⧉");
  });
}
function renderContact(container){
  const c = CONTENT.profile;
  container.appendChild(el("div", {class:"app"},
    el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Let's talk"),
      el("h1", {class:"app-h"}, "Contact"),
      el("p", {class:"app-sub"}, "Email is the fastest way to reach me — I check it daily."),
      el("div", {class:"status-pill", style:"margin-bottom:20px;"}, el("span",{class:"dot"}), `${c.availability}`),
      el("div", {class:"contact-grid"},
        el("div", {class:"contact-card"},
          el("span",{class:"cc-icon"},"✉"), el("h4",{},"Email"), el("span",{},c.email),
          el("div", {style:"display:flex;gap:6px;margin-top:8px;"},
            el("a", {class:"btn", href:`mailto:${c.email}`, style:"font-size:11px;padding:6px 10px;"}, "Send"),
            el("button", {class:"btn", style:"font-size:11px;padding:6px 10px;", onclick:()=>copyToClipboard(c.email,"Email")}, "Copy")
          )
        ),
        el("div", {class:"contact-card"},
          el("span",{class:"cc-icon"},"☎"), el("h4",{},"Phone"), el("span",{},c.phone),
          el("button", {class:"btn", style:"font-size:11px;padding:6px 10px;margin-top:8px;width:fit-content;", onclick:()=>copyToClipboard(c.phone,"Phone number")}, "Copy")
        ),
        el("a", {class:"contact-card", href:c.github, target:"_blank"},
          el("span",{class:"cc-icon"},"⌥"), el("h4",{},"GitHub"), el("span",{},"github.com/hooryaa")),
        el("a", {class:"contact-card", href:c.linkedin, target:"_blank"},
          el("span",{class:"cc-icon"},"in"), el("h4",{},"LinkedIn"), el("span",{},"linkedin.com/in/hooryaa")),
        el("a", {class:"contact-card", href:c.portfolio, target:"_blank"},
          el("span",{class:"cc-icon"},"◈"), el("h4",{},"Portfolio"), el("span",{},"hooria-portfolio.vercel.app")),
        el("div", {class:"contact-card"},
          el("span",{class:"cc-icon"},"◷"), el("h4",{},"Location"), el("span",{},`${c.location} · ${c.timezone}`))
      ),
      el("div", {class:"divider"}),
      el("h4", {style:"font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin:0 0 14px;"}, "Scan to save my contact"),
      buildQrBox(c.portfolio)
    )
  ));
}
function buildQrBox(url){
  const box = el("div", {style:"width:150px;height:150px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;padding:10px;"});
  const holder = el("div", {id:"qr-holder"});
  box.appendChild(holder);
  // Feature-detected: uses the qrcodejs library if it loaded (CDN); otherwise a graceful text fallback.
  if(window.QRCode){
    try{ new QRCode(holder, { text:url, width:130, height:130, colorDark:"#111114", colorLight:"#ffffff" }); }
    catch(e){ holder.appendChild(el("div",{style:"font-size:10px;color:#333;text-align:center;"},"QR unavailable")); }
  } else {
    holder.appendChild(el("div", {style:"font-size:10.5px;color:#333;text-align:center;line-height:1.4;"}, "QR code needs an internet connection to load. Visit: ", el("br"), url));
  }
  return box;
}

/* ============================================================
   DOCK
   ============================================================ */
function initDock(){
  const dock = $("#dock");
  let lastGroup = null;
  Object.keys(APPS).forEach((id)=>{
    const meta = APPS[id];
    if(lastGroup !== null && meta.group !== lastGroup) dock.appendChild(el("div",{class:"dock-sep"}));
    lastGroup = meta.group;
    const item = el("div", {class:"dock-item", "data-app":id, tabindex:"0", "aria-label":meta.title, title:`Open ${meta.title}`,
      onclick:()=>openApp(id)},
      meta.glyph,
      el("div", {class:"dock-tooltip"}, meta.title),
      el("div", {class:"dock-dot"})
    );
    dock.appendChild(item);
  });
}

/* ============================================================
   SPOTLIGHT
   ============================================================ */
function buildSearchIndex(){
  const idx = [];
  Object.keys(APPS).forEach(id => idx.push({type:"app", glyph:APPS[id].glyph, title:APPS[id].title, sub:"Application", action:()=>openApp(id)}));
  CONTENT.projects.forEach(p => idx.push({type:"project", glyph:p.glyph, title:p.name, sub:p.tag, action:()=>openApp("projects",{route:{project:p.id}})}));
  CONTENT.blog.forEach(p => idx.push({type:"post", glyph:"✎", title:p.title, sub:"Blog post", action:()=>openApp("blog",{route:{post:p.id}})}));
  idx.push({type:"action", glyph:"✉", title:"Email me", sub:CONTENT.profile.email, action:()=>window.open(`mailto:${CONTENT.profile.email}`)});
  idx.push({type:"action", glyph:"⌥", title:"Open GitHub", sub:CONTENT.profile.github, action:()=>window.open(CONTENT.profile.github,"_blank")});
  idx.push({type:"action", glyph:"in", title:"Open LinkedIn", sub:CONTENT.profile.linkedin, action:()=>window.open(CONTENT.profile.linkedin,"_blank")});
  idx.push({type:"action", glyph:"⬇", title:"Download Resume", sub:"PDF", action:()=>window.open(CONTENT.profile.resumeFile,"_blank")});
  ["help","whoami","neofetch","joke","matrix","fortune","coffee","sudo hire-hooria"].forEach(cmd=>
    idx.push({type:"command", glyph:"❯", title:cmd, sub:"Terminal command", action:()=>openApp("terminal",{route:{run:cmd}})})
  );
  return idx;
}
function initSpotlight(){
  const overlay = $("#spotlight-overlay");
  const input = $("#spotlight-input");
  const results = $("#spotlight-results");
  const index = buildSearchIndex();
  let activeI = 0, filtered = index.slice(0, 8);

  function open(){
    overlay.classList.add("show");
    input.value = "";
    filtered = index.slice(0,8);
    activeI = 0;
    render();
    setTimeout(()=>input.focus(), 30);
  }
  function close(){ overlay.classList.remove("show"); }
  function render(){
    results.innerHTML = "";
    if(!filtered.length){ results.appendChild(el("div",{class:"spot-empty"},"No matches. Try 'projects' or 'blog'.")); return; }
    filtered.forEach((r,i)=>{
      results.appendChild(el("div", {class:`spot-item ${i===activeI?'active':''}`, onclick:()=>{ r.action(); close(); }},
        el("div",{class:"si-glyph"}, r.glyph),
        el("div",{class:"si-text"}, el("b",{},r.title), el("span",{},r.sub))
      ));
    });
  }
  input.addEventListener("input", ()=>{
    const q = input.value.toLowerCase().trim();
    filtered = !q ? index.slice(0,8) : index.filter(r => r.title.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)).slice(0,10);
    activeI = 0; render();
  });
  window.addEventListener("keydown",(e)=>{
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); overlay.classList.contains("show") ? close() : open(); return; }
    if(!overlay.classList.contains("show")) return;
    if(e.key==="Escape") close();
    if(e.key==="ArrowDown"){ e.preventDefault(); activeI = Math.min(filtered.length-1, activeI+1); render(); }
    if(e.key==="ArrowUp"){ e.preventDefault(); activeI = Math.max(0, activeI-1); render(); }
    if(e.key==="Enter" && filtered[activeI]){ filtered[activeI].action(); close(); }
  });
  overlay.addEventListener("mousedown",(e)=>{ if(e.target===overlay) close(); });
  $("#spotlight-trigger").addEventListener("click", open);
}

/* ============================================================
   CONTEXT MENU
   ============================================================ */
function initContextMenu(){
  const menu = $("#ctx-menu");
  document.addEventListener("contextmenu",(e)=>{
    if(e.target.closest(".win")) return;
    e.preventDefault();
    menu.style.left = Math.min(e.clientX, window.innerWidth-230)+"px";
    menu.style.top = Math.min(e.clientY, window.innerHeight-220)+"px";
    menu.classList.add("show");
  });
  document.addEventListener("click", ()=> menu.classList.remove("show"));
  $all(".ctx-item", menu).forEach(item=>{
    item.addEventListener("click", ()=>{
      const action = item.dataset.action;
      if(action==="spotlight") $("#spotlight-trigger").click();
      if(action==="sound") toggleSound();
      if(action==="about") openApp("about");
      if(action==="refresh") location.reload();
      if(action==="wallpaper") cycleWallpaper();
      if(action==="theme") cycleTheme();
      if(action==="cursorglow") toggleCursorGlow();
      if(action==="files") openApp("files");
      if(action==="achievements") openAchievementsPanel();
      if(action==="shutdown") beginShutdown();
    });
  });
}
function openAchievementsPanel(){
  const list = getAchievements();
  const unlocked = list.filter(a=>a.unlocked).length;
  notify(`Achievements: ${unlocked}/${list.length}`, list.map(a=> (a.unlocked?"✓ ":"○ ")+a.name).join("  ·  "), "🏆");
}
function toggleSound(){
  state.soundOn = !state.soundOn;
  localStorage.setItem("hooria-os-sound", state.soundOn ? "1":"0");
  notify("Sound " + (state.soundOn ? "on" : "off"), "UI sound effects " + (state.soundOn?"enabled.":"disabled."), "♪");
  playBeep(state.soundOn ? 660 : 220);
}
let _actx;
function playBeep(freq=520, dur=0.07, type="sine", gain=0.05){
  if(!state.soundOn) return;
  try{
    _actx = _actx || new (window.AudioContext||window.webkitAudioContext)();
    const osc = _actx.createOscillator(); const g = _actx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g); g.connect(_actx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + dur);
    osc.stop(_actx.currentTime + dur + 0.02);
  }catch(e){}
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function initCursorGlow(){
  const glow = $("#cursor-glow");
  if(!glow) return;
  const on = localStorage.getItem("hooria-os-cursorglow") !== "0";
  glow.style.display = on ? "block" : "none";
  let raf = null, tx=0, ty=0;
  window.addEventListener("mousemove", (e)=>{
    tx = e.clientX; ty = e.clientY;
    if(raf) return;
    raf = requestAnimationFrame(()=>{ glow.style.transform = `translate(${tx}px,${ty}px)`; raf=null; });
  });
}
function toggleCursorGlow(){
  const glow = $("#cursor-glow");
  const on = glow.style.display !== "none";
  glow.style.display = on ? "none" : "block";
  localStorage.setItem("hooria-os-cursorglow", on ? "0":"1");
  notify("Cursor glow " + (on?"off":"on"), "Toggle again any time from the right-click menu.", "◐");
}

/* ============================================================
   FICTIONAL SYSTEM INDICATORS — Wi-Fi / Battery / Dev Mode button
   ============================================================ */
function initTopbar(){
  $all(".tb-menu").forEach(menu=>{
    menu.classList.add("clickable");
    menu.addEventListener("click", ()=>{
      const title = menu.textContent.trim();
      if(title === "Portfolio") openApp("projects");
      else if(title === "File") openApp("files");
      else if(title === "View") openApp("settings");
      else if(title === "Help") openApp("about");
      $all(".tb-menu").forEach(t=>t.classList.toggle("active", t===menu));
    });
  });
  const wifi = $("#wifi-indicator");
  if(wifi) wifi.addEventListener("click", ()=> notify("Network status", wifi.title, "📶"));
  const batt = $("#battery-indicator");
  if(batt) batt.addEventListener("click", ()=> notify("Battery", batt.title, "🔋"));
}

function initSystemIndicators(){
  const battFill = $("#battery-fill");
  const battIndicator = $("#battery-indicator");
  let pct = 78;
  function renderBattery(){
    if(!battFill) return;
    battFill.setAttribute("width", (14*pct/100).toFixed(1));
    battIndicator.title = `Battery: ${pct}%${pct<20?' (low — maybe take a break)':''}`;
  }
  renderBattery();
  setInterval(()=>{
    pct = pct - 1; if(pct < 15) pct = 92; // fictional slow drain that "recharges" for the demo
    renderBattery();
  }, 45000);

  const devBtn = $("#devmode-trigger");
  if(devBtn) devBtn.addEventListener("click", activateDevMode);
}

/* ============================================================
   TIME-AWARE DESKTOP LIGHTING
   ============================================================ */
function applyTimeAwareLighting(){
  const desktop = $("#desktop");
  if(!desktop) return;
  const hour = new Date().getHours();
  let tint;
  if(hour < 6) tint = "rgba(30,20,70,.16)";        // late night — deep violet
  else if(hour < 9) tint = "rgba(255,170,120,.08)"; // early morning — warm
  else if(hour < 17) tint = "rgba(255,255,255,.02)"; // daytime — neutral, minimal
  else if(hour < 20) tint = "rgba(255,120,80,.09)";  // evening — warm amber
  else tint = "rgba(80,60,180,.12)";                 // night — cool violet
  desktop.style.setProperty("--time-tint", tint);
  let overlay = $("#time-tint-overlay");
  if(!overlay){
    overlay = el("div", {id:"time-tint-overlay", style:"position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;transition:background 2s ease;"});
    desktop.appendChild(overlay);
  }
  overlay.style.background = tint;
}


const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let konamiBuf = [];
function initKeyboard(){
  window.addEventListener("keydown",(e)=>{
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==="w"){
      const top = state.openOrder[state.openOrder.length-1];
      if(top){ e.preventDefault(); closeWindow(top); }
    }
    if((e.metaKey||e.ctrlKey) && (e.key==="ArrowLeft" || e.key==="ArrowRight")){
      const top = state.openOrder[state.openOrder.length-1];
      if(top){ e.preventDefault(); snapWindow(top, e.key==="ArrowLeft" ? "left":"right"); }
    }
    if(e.key === "Escape"){
      $("#ctx-menu").classList.remove("show");
    }
    // konami code
    konamiBuf.push(e.key);
    konamiBuf = konamiBuf.slice(-KONAMI.length);
    if(konamiBuf.length===KONAMI.length && konamiBuf.every((k,i)=>k===KONAMI[i])){
      activateDevMode();
    }
  });
}
function activateDevMode(){
  state.devMode = !state.devMode;
  document.body.classList.toggle("dev-mode", state.devMode);
  unlockAchievement("konami");
  notify(state.devMode ? "Developer Mode enabled" : "Developer Mode disabled",
    state.devMode ? "You found the Konami code. Scanlines on, achievements unlocked." : "Back to normal.", "⌨");
}
function snapWindow(appId, side){
  const w = state.windows[appId];
  if(!w) return;
  w.maxed = false; w.el.classList.remove("maxed");
  const halfW = Math.floor(window.innerWidth/2);
  w.el.style.top = "34px";
  w.el.style.height = (window.innerHeight-34) + "px";
  w.el.style.width = halfW + "px";
  w.el.style.left = (side==="left" ? 0 : halfW) + "px";
  saveWindowRect(appId);
}

/* ============================================================
   WINDOW POSITION MEMORY
   ============================================================ */
function loadWindowRects(){
  try{ return JSON.parse(localStorage.getItem("hooria-os-winpos")||"{}"); }catch(e){ return {}; }
}
function saveWindowRect(appId){
  const w = state.windows[appId];
  if(!w) return;
  const rects = loadWindowRects();
  rects[appId] = { left:w.el.style.left, top:w.el.style.top, width:w.el.style.width, height:w.el.style.height };
  localStorage.setItem("hooria-os-winpos", JSON.stringify(rects));
}

/* ============================================================
   POWER MENU — SHUTDOWN / RESTART
   ============================================================ */
function initPowerMenu(){
  const btn = $("#power-trigger");
  const menu = $("#power-menu");
  if(!btn) return;
  btn.addEventListener("click",(e)=>{ e.stopPropagation(); menu.classList.toggle("show"); });
  document.addEventListener("click", ()=> menu.classList.remove("show"));
  $("#power-restart").addEventListener("click", ()=> location.reload());
  $("#power-shutdown").addEventListener("click", beginShutdown);
}
function beginShutdown(){
  const s = $("#shutdown-screen");
  s.classList.add("show");
  setTimeout(()=> s.classList.add("dark"), 550);
}

/* ============================================================
   LOGO EASTER EGG — 10 CLICKS → ARCADE
   ============================================================ */
function initLogoEgg(){
  const brand = $(".tb-brand");
  if(!brand) return;
  brand.style.cursor = "pointer";
  brand.addEventListener("click", ()=>{
    state.logoClicks++;
    if(state.logoClicks === 10){
      unlockAchievement("logo_clicks");
      notify("🎮 Retro mode unlocked", "Opening the Arcade…", "▶");
      openApp("arcade");
      state.logoClicks = 0;
    }
  });
}

/* ============================================================
   MOBILE FALLBACK
   ============================================================ */
function initMobile(){
  if(!state.isMobile) return;
  const root = $("#mobile-app");
  root.style.display = "flex";
  root.appendChild(el("div", {class:"m-header"},
    el("div", {class:"m-brand"}, el("span",{class:"dot"}), "Hooria OS"),
    el("div", {class:"m-time", "data-clock":""}, fmtTime(new Date()))
  ));
  const list = el("div", {class:"m-list"});
  Object.keys(APPS).forEach(id=>{
    const meta = APPS[id];
    list.appendChild(el("div", {class:"m-row", onclick:()=>openMobile(id)},
      el("div", {class:"m-glyph"}, meta.glyph),
      el("div", {}, el("b",{},meta.title), el("span",{}, mobileSub(id)))
    ));
  });
  root.appendChild(list);
  document.body.appendChild(buildMobileFullScreens());
}
function mobileSub(id){
  const subs = {
    projects:"7 real case studies", about:"My story", experience:"Career timeline",
    skills:"What I build with", architecture:"Interactive diagrams", terminal:"Type a command",
    blog:"Field notes", resume:"Download & timeline", contact:"Get in touch",
    files:"career.log, dreams.txt & more", settings:"Theme & wallpaper", paint:"Lightweight drawing app",
    notes:"Sticky notes", music:"Lofi / synthwave / rain", arcade:"Snake, Memory, Tic-Tac-Toe, Typing Test"
  };
  return subs[id] || "";
}
function buildMobileFullScreens(){
  const wrap = el("div", {});
  Object.keys(APPS).forEach(id=>{
    const meta = APPS[id];
    const header = el("div", {class:"m-full-header"},
      el("button", {class:"m-back", onclick:()=>screen.classList.remove("open")}, "← Back"),
      el("b", {}, meta.title)
    );
    const screen = el("div", {class:"m-full", id:`mfull-${id}`},
      header,
      el("div", {class:"m-full-body", id:`mfullbody-${id}`})
    );
    initSwipeToClose(screen, header);
    wrap.appendChild(screen);
  });
  return wrap;
}
function initSwipeToClose(screen, handle){
  let sy=0, dy=0, dragging=false;
  handle.addEventListener("touchstart", (e)=>{ sy = e.touches[0].clientY; dragging=true; screen.style.transition="none"; }, {passive:true});
  handle.addEventListener("touchmove", (e)=>{
    if(!dragging) return;
    dy = Math.max(0, e.touches[0].clientY - sy);
    screen.style.transform = `translateY(${dy}px)`;
  }, {passive:true});
  handle.addEventListener("touchend", ()=>{
    dragging = false;
    screen.style.transition = "";
    screen.style.transform = "";
    if(dy > 100) screen.classList.remove("open");
    dy = 0;
  });
}
function openMobile(appId, opts={}){
  const screen = $(`#mfull-${appId}`);
  const body = $(`#mfullbody-${appId}`);
  if(!screen) return;
  renderApp(appId, body, opts.route);
  screen.classList.add("open");
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */
window.addEventListener("DOMContentLoaded", ()=>{
  tickClocks();
  state.soundOn = localStorage.getItem("hooria-os-sound") === "1";
  initThemeEngine();
  runBoot();
  initLock();
  initDock();
  initSpotlight();
  initContextMenu();
  initTopbar();
  initKeyboard();
  initMobile();
  initPowerMenu();
  initLogoEgg();
  initWidgets();
  initCursorGlow();
  initSystemIndicators();
  applyTimeAwareLighting();
  setInterval(applyTimeAwareLighting, 10*60*1000);

  $("#profile-initial").textContent = CONTENT.profile.initials;
  $("#profile-name").textContent = CONTENT.profile.name;

  // desktop icons open a couple of "signature" apps directly
  $all(".dicon").forEach(d=>{
    d.addEventListener("click", ()=> openApp(d.dataset.app));
    d.addEventListener("keydown", e=>{
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault(); openApp(d.dataset.app);
      }
    });
  });
});
