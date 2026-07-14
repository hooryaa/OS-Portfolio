/* ============================================================
   HOORIA OS — TERMINAL
   ============================================================ */

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my ETL pipeline a joke. It transformed it, then loaded it into the wrong table.",
  "There are 10 types of people: those who understand binary, and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "My code doesn't have bugs. It has undocumented features with strong opinions.",
  "Why did the developer go broke? Because they used up all their cache."
];
const FORTUNES = [
  "A clean data model will save you three debugging sessions this week.",
  "The bug is never where you think it is. Check the null check first.",
  "Somewhere, a dashboard is about to be trusted more than it should be. Validate first.",
  "Your next great idea is one refactor away from being obvious.",
  "The pipeline you build today is the 3am page you don't get next month."
];

function renderTerminal(container, route){
  const history = [];
  let historyIdx = -1;
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
    lines.appendChild(el("div", {class:"tl-line", html}));
    termWrap.scrollTop = termWrap.scrollHeight;
  }
  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  print("Hooria OS Terminal v2.0 — type 'help' to see available commands.");
  print("");

  const commands = {
    help(){
      print("Available commands:");
      [
        "help","whoami","projects","skills","experience","resume [download]","contact",
        "github","linkedin","clear","theme [name]","wallpaper [name]","date","time","clock","calendar",
        "open <project|app>","project <devpilot|cinelytics|jobpulse|simplewrite|prestige>",
        "pipeline","architecture","neofetch","joke","fortune","coffee","ascii","matrix",
        "sudo <cmd>","music","paint","notes","snake","2048","minesweeper","leaderboard",
        "achievements","search <query>","easteregg"
      ].forEach(c=>print("  " + c));
      print("(a few commands aren't listed here — exploring never hurt anyone)");
    },
    whoami(){ print(`${CONTENT.profile.name} — ${CONTENT.profile.role}, ${CONTENT.profile.location}`); },
    about(){ openApp("about"); print("Opened About."); },
    projects(){
      CONTENT.projects.forEach(p=>print(`  ${p.glyph}  ${p.id.padEnd(14)} ${p.tag}`));
      openApp("projects");
    },
    skills(){ CONTENT.skills.forEach(s=>print(`  ${s.icon}  ${s.title}`)); openApp("skills"); },
    experience(){ openApp("experience"); print("Opened Experience."); },
    resume(arg){
      openApp("resume");
      if((arg||"").trim()==="download") window.open(CONTENT.profile.resumeFile,"_blank");
      print(`Resume: ${CONTENT.profile.resumeFile}${arg==="download"?" — downloading…":" (try 'resume download')"}`);
    },
    contact(){ openApp("contact"); print(`Email: ${CONTENT.profile.email}  ·  Phone: ${CONTENT.profile.phone}`); },
    github(){ print(CONTENT.profile.github); window.open(CONTENT.profile.github, "_blank"); },
    linkedin(){ print(CONTENT.profile.linkedin); window.open(CONTENT.profile.linkedin, "_blank"); },
    date(){ print(new Date().toDateString()); },
    time(){ print(new Date().toLocaleTimeString()); },
    clock(){ print(new Date().toLocaleTimeString()); print("(the topbar clock is always live, top-right)"); },
    calendar(){
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      let row = "  ".repeat(first.getDay());
      let out = `${now.toLocaleString([], {month:'long', year:'numeric'})}\nSu Mo Tu We Th Fr Sa\n` + row;
      for(let d=1; d<=daysInMonth; d++){
        out += (d===now.getDate() ? `[${String(d).padStart(1)}]` : String(d).padStart(2)) + " ";
        if((d+first.getDay()) % 7 === 0) out += "\n";
      }
      printHTML(`<pre style="margin:0;font-size:11px;">${out}</pre>`);
    },
    pipeline(){ openApp("architecture"); print("Opened the Architecture playground — try the CINELYTICS or JobPulse tabs for pipeline views."); },
    architecture(){ openApp("architecture"); print("Opened Architecture."); },
    project(arg){ commands.open(arg); },
    "2048"(){ openApp("arcade", {route:{game:"2048"}}); print("Opened Arcade → 2048."); },
    minesweeper(){ openApp("arcade", {route:{game:"minesweeper"}}); print("Opened Arcade → Minesweeper."); },
    snake(){ openApp("arcade", {route:{game:"snake"}}); print("Opened Arcade → Snake."); },
    leaderboard(){
      const lb = lbGet();
      Object.entries(lb).forEach(([k,v])=> print(`  ${k}: ${v}`));
      if(!Object.keys(lb).length) print("No scores yet — go play something in the Arcade.");
    },
    secret(){ print("You found a hidden command. Try 'sudo hire-hooria', the Konami code, or clicking the logo 10 times."); },
    clear(){ lines.innerHTML = ""; },
    theme(arg){
      const id = (arg||"").trim().toLowerCase().replace(/\s+/g,"-");
      if(id && THEMES[id]){ applyTheme(id); print(`Theme set to ${THEMES[id].label}.`); }
      else { cycleTheme(); print("Cycled to next theme. Try: theme cyber | theme light | theme terminal-green | theme midnight-blue | theme purple-neon | theme dark"); }
    },
    wallpaper(arg){
      const id = (arg||"").trim().toLowerCase().replace(/\s+/g,"-");
      const match = WALLPAPERS.find(w=>w.id===id);
      if(match){ applyWallpaper(match.id); print(`Wallpaper set to ${match.label}.`); }
      else { cycleWallpaper(); print("Cycled to next wallpaper. Try: " + WALLPAPERS.map(w=>w.id).join(", ")); }
    },
    neofetch(){
      const themeId = localStorage.getItem("hooria-os-theme") || "dark";
      printHTML(`<pre style="margin:0;font-size:11.5px;line-height:1.5;color:var(--cyan)">        .--.
       |o_o |      <b style="color:var(--text-0)">hooria@hooria-os</b>
       |:_/ |      -----------------
      //   \\ \\     OS: Hooria OS (fictional, v2.0)
     (|     | )    Host: ${CONTENT.profile.location}
    /'\\_   _/\`\\   Stack: Python · TypeScript · SQL · Power BI
    \\___)=(___/   Theme: ${THEMES[themeId].label}
                   Focus: ${CONTENT.profile.focus}</pre>`);
    },
    joke(){ print(rand(JOKES)); },
    fortune(){ print("🥠 " + rand(FORTUNES)); },
    coffee(){ printHTML(`<pre style="margin:0;font-size:11px;line-height:1.2;color:var(--ember)">     ( (\n      ) )\n   ..........\n   |        |]\n   \\        /\n    \`------\`</pre>` ); print("Fuel acquired. Productivity +15%."); },
    ascii(){
      printHTML(`<pre style="margin:0;font-size:9px;line-height:1.05;color:var(--violet)">██╗  ██╗ ██████╗  ██████╗ ██████╗ ██╗ █████╗
██║  ██║██╔═══██╗██╔═══██╗██╔══██╗██║██╔══██╗
███████║██║   ██║██║   ██║██████╔╝██║███████║
██╔══██║██║   ██║██║   ██║██╔══██╗██║██╔══██║
██║  ██║╚██████╔╝╚██████╔╝██║  ██║██║██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝</pre>`);
    },
    matrix(){ runMatrixRain(); print("Entering the matrix for a few seconds…"); },
    sudo(arg){
      if((arg||"").trim() === "hire-hooria"){
        print("Access granted. Welcome aboard.");
        notify("sudo hire-hooria", "Access granted. Welcome aboard.", "✓");
        unlockAchievement("sudo_hire");
      } else if(!arg){
        print("usage: sudo <command>");
      } else {
        print(`sudo: permission denied for '${arg}'. Nice try though.`);
      }
    },
    music(){ openApp("music"); print("Opened Music Player."); },
    paint(){ openApp("paint"); print("Opened Paint."); },
    notes(){ openApp("notes"); print("Opened Sticky Notes."); },
    achievements(){
      const list = getAchievements();
      list.forEach(a=> print(`  ${a.unlocked ? "✓":"○"} ${a.name} — ${a.desc}`));
      print(`${list.filter(a=>a.unlocked).length}/${list.length} unlocked.`);
    },
    easteregg(){
      unlockAchievement("terminal_egg");
      printHTML(`<pre style="margin:0;font-size:10px;line-height:1.1;color:var(--cyan)">   ▲ ▲
  ( ◕ ‿ ◕ )
   you found the aperture's secret.
   thanks for reading this deep. — hooria</pre>`);
    },
    open(arg){
      const id = (arg||"").trim().toLowerCase();
      const projectIds = CONTENT.projects.map(p=>p.id);
      if(projectIds.includes(id)){ openApp("projects", {route:{project:id}}); print(`Opening ${id}…`); }
      else if(APPS[id]){ openApp(id); print(`Opening ${id}…`); }
      else print(`open: unknown target '${id}'. Try: ${projectIds.join(", ")}`);
    },
    search(arg){
      const q = (arg||"").toLowerCase();
      const hits = CONTENT.projects.filter(p=> (p.name+p.summary+p.stack.join(" ")).toLowerCase().includes(q));
      if(!hits.length) print(`No results for "${arg}".`);
      else hits.forEach(h=>print(`  match → ${h.name}`));
    }
  };

  function run(raw){
    print(`hooria@os:~$ ${esc(raw)}`);
    history.push(raw); historyIdx = history.length;
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    if(commands[cmd]) commands[cmd](arg);
    else if(cmd) print(`command not found: ${cmd} (try 'help')`);
  }

  input.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      const raw = input.value;
      run(raw);
      input.value = "";
    } else if(e.key === "ArrowUp"){
      e.preventDefault();
      if(historyIdx > 0){ historyIdx--; input.value = history[historyIdx] || ""; }
    } else if(e.key === "ArrowDown"){
      e.preventDefault();
      if(historyIdx < history.length-1){ historyIdx++; input.value = history[historyIdx] || ""; }
      else { historyIdx = history.length; input.value = ""; }
    }
  });
  termWrap.addEventListener("click", ()=> input.focus());
  setTimeout(()=>input.focus(), 60);

  if(route && route.run){ setTimeout(()=> run(route.run), 200); }
}

/* ---- Matrix rain easter egg (canvas overlay) ---- */
function runMatrixRain(){
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed"; canvas.style.inset = "0"; canvas.style.zIndex = "85";
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const cols = Math.floor(canvas.width/16);
  const drops = new Array(cols).fill(0);
  const chars = "01アイウエオHOORIADEVPILOTETL";
  let frames = 0;
  const draw = () => {
    ctx.fillStyle = "rgba(5,8,5,0.15)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#39FF6A";
    ctx.font = "14px monospace";
    drops.forEach((y,i)=>{
      const ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch, i*16, y*16);
      drops[i] = (y*16 > canvas.height && Math.random() > 0.975) ? 0 : y+1;
    });
    frames++;
    if(frames < 140) requestAnimationFrame(draw);
    else canvas.remove();
  };
  draw();
}

Object.assign(APP_REGISTRY, { terminal: renderTerminal });
