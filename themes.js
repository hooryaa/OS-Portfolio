/* ============================================================
   HOORIA OS — THEME + WALLPAPER ENGINE
   ============================================================ */

const THEMES = {
  dark: {
    label: "Dark", swatch: "#7C5CFF",
    vars: {} // uses the :root defaults defined in styles.css
  },
  light: {
    label: "Light", swatch: "#5B3DE0",
    vars: {
      "--bg-0":"#F4F4F7","--bg-1":"#FFFFFF","--bg-2":"#ECECF1",
      "--surface":"rgba(20,20,30,.04)","--surface-hi":"rgba(20,20,30,.08)",
      "--border":"rgba(10,10,20,.10)","--border-hi":"rgba(10,10,20,.18)",
      "--text-0":"#16161A","--text-1":"#4A4A55","--text-2":"#7A7A85",
      "--violet":"#5B3DE0","--cyan":"#0AA98C","--ember":"#D9552F"
    }
  },
  cyber: {
    label: "Cyber", swatch: "#FF2AD4",
    vars: {
      "--bg-0":"#08050C","--bg-1":"#0F0A16","--bg-2":"#160F20",
      "--surface":"rgba(255,42,212,.06)","--surface-hi":"rgba(255,42,212,.13)",
      "--border":"rgba(255,42,212,.18)","--border-hi":"rgba(255,42,212,.32)",
      "--text-0":"#F3E9FF","--text-1":"#C9AEEA","--text-2":"#8E76B0",
      "--violet":"#FF2AD4","--cyan":"#28F1FF","--ember":"#FFB020"
    }
  },
  "terminal-green": {
    label: "Terminal Green", swatch: "#39FF6A",
    vars: {
      "--bg-0":"#050805","--bg-1":"#091209","--bg-2":"#0D1A0D",
      "--surface":"rgba(57,255,106,.06)","--surface-hi":"rgba(57,255,106,.13)",
      "--border":"rgba(57,255,106,.2)","--border-hi":"rgba(57,255,106,.36)",
      "--text-0":"#D6FFDF","--text-1":"#8FE6A0","--text-2":"#5FA86D",
      "--violet":"#39FF6A","--cyan":"#B6FF3B","--ember":"#FFD23B"
    }
  },
  "midnight-blue": {
    label: "Midnight Blue", swatch: "#3B82F6",
    vars: {
      "--bg-0":"#05070F","--bg-1":"#0A0F1F","--bg-2":"#0F162B",
      "--surface":"rgba(59,130,246,.07)","--surface-hi":"rgba(59,130,246,.14)",
      "--border":"rgba(59,130,246,.18)","--border-hi":"rgba(59,130,246,.32)",
      "--text-0":"#E8EEFC","--text-1":"#AEC2EA","--text-2":"#7690BC",
      "--violet":"#3B82F6","--cyan":"#38E1D8","--ember":"#F0A23B"
    }
  },
  "purple-neon": {
    label: "Purple Neon", swatch: "#B14BFF",
    vars: {
      "--bg-0":"#0A0713","--bg-1":"#120B21","--bg-2":"#191131",
      "--surface":"rgba(177,75,255,.08)","--surface-hi":"rgba(177,75,255,.15)",
      "--border":"rgba(177,75,255,.22)","--border-hi":"rgba(177,75,255,.4)",
      "--text-0":"#F3E8FF","--text-1":"#D2ADFF","--text-2":"#9C7BC4",
      "--violet":"#B14BFF","--cyan":"#FF4BD8","--ember":"#FFC93B"
    }
  }
};

const WALLPAPERS = [
  { id:"minimal-dark", label:"Minimal Dark", css:"radial-gradient(1400px 900px at 12% -10%, rgba(124,92,255,.10), transparent 55%), radial-gradient(1100px 800px at 95% 105%, rgba(0,229,199,.08), transparent 55%), #0A0A0D" },
  { id:"aurora", label:"Aurora", css:"radial-gradient(1200px 800px at 20% -10%, rgba(0,229,199,.22), transparent 55%), radial-gradient(1100px 900px at 80% 10%, rgba(124,92,255,.22), transparent 55%), radial-gradient(1000px 700px at 50% 100%, rgba(255,107,74,.12), transparent 60%), #06060A" },
  { id:"cyberpunk", label:"Cyberpunk", css:"radial-gradient(900px 600px at 15% 20%, rgba(255,42,212,.28), transparent 55%), radial-gradient(900px 700px at 85% 80%, rgba(40,241,255,.22), transparent 55%), #0A0410" },
  { id:"synthwave", label:"Synthwave", css:"linear-gradient(180deg, rgba(255,42,212,.18), transparent 40%), radial-gradient(1200px 500px at 50% 100%, rgba(255,107,74,.28), transparent 60%), radial-gradient(800px 500px at 50% 0%, rgba(124,92,255,.25), transparent 60%), #0B0414" },
  { id:"space", label:"Space", css:"radial-gradient(2px 2px at 20% 30%, #fff, transparent), radial-gradient(1.5px 1.5px at 60% 70%, #fff, transparent), radial-gradient(1px 1px at 80% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 33% 82%, #fff, transparent), radial-gradient(1px 1px at 90% 60%, #fff, transparent), radial-gradient(1400px 900px at 50% 30%, rgba(124,92,255,.14), transparent 60%), #05050B" },
  { id:"mountains", label:"Mountains", css:"linear-gradient(180deg, rgba(124,92,255,.14) 0%, transparent 40%), radial-gradient(1600px 500px at 50% 100%, rgba(0,229,199,.14), transparent 60%), #0A0A10" },
  { id:"abstract", label:"Abstract", css:"radial-gradient(700px 500px at 10% 90%, rgba(255,107,74,.18), transparent 55%), radial-gradient(800px 600px at 90% 10%, rgba(124,92,255,.2), transparent 55%), radial-gradient(600px 600px at 50% 50%, rgba(0,229,199,.1), transparent 60%), #0A0A0D" },
  { id:"anime", label:"Anime-Inspired", css:"radial-gradient(1000px 700px at 30% 0%, rgba(255,150,220,.18), transparent 55%), radial-gradient(900px 700px at 90% 100%, rgba(124,180,255,.18), transparent 55%), #0B0810" },
  { id:"data-viz", label:"Data Visualization", css:"repeating-linear-gradient(90deg, rgba(0,229,199,.05) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, rgba(0,229,199,.05) 0 1px, transparent 1px 48px), radial-gradient(1200px 800px at 50% 0%, rgba(124,92,255,.1), transparent 60%), #08080B" },
  { id:"matrix", label:"Matrix", css:"repeating-linear-gradient(0deg, rgba(57,255,106,.05) 0 2px, transparent 2px 26px), radial-gradient(1200px 900px at 50% 0%, rgba(57,255,106,.08), transparent 60%), #030603" },
  { id:"blueprint", label:"Blueprint", css:"repeating-linear-gradient(90deg, rgba(124,170,255,.09) 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, rgba(124,170,255,.09) 0 1px, transparent 1px 40px), #071224" },
  { id:"glass", label:"Glass Gradient", css:"linear-gradient(135deg, rgba(124,92,255,.16), rgba(0,229,199,.1) 50%, rgba(255,107,74,.08)), #0A0A0D" },
];

function initThemeEngine(){
  const savedTheme = localStorage.getItem("hooria-os-theme") || "dark";
  const savedWallpaper = localStorage.getItem("hooria-os-wallpaper") || "minimal-dark";
  applyTheme(savedTheme, false);
  applyWallpaper(savedWallpaper, false);
}

function applyTheme(id, announce=true){
  const t = THEMES[id] || THEMES.dark;
  const root = document.documentElement;
  // reset to defaults first (dark theme has no overrides)
  Object.keys(THEMES.cyber.vars).forEach(k=> root.style.removeProperty(k));
  Object.entries(t.vars).forEach(([k,v])=> root.style.setProperty(k, v));
  document.body.setAttribute("data-theme", id);
  localStorage.setItem("hooria-os-theme", id);
  if(announce) notify("Theme changed", `Now running the "${t.label}" theme.`, "◐");
}
function cycleTheme(){
  const ids = Object.keys(THEMES).filter(id => !THEMES[id].secret || isSecretThemeUnlocked());
  const current = localStorage.getItem("hooria-os-theme") || "dark";
  const next = ids[(ids.indexOf(current)+1) % ids.length];
  applyTheme(next);
}

function applyWallpaper(id, announce=true){
  if(id === "custom"){
    const custom = localStorage.getItem("hooria-os-custom-wallpaper-data");
    if(!custom){ if(announce) notify("No custom wallpaper yet", "Upload an image first from Display Settings.", "◈"); return; }
    const desktop = document.getElementById("desktop");
    if(desktop) desktop.style.background = `center/cover no-repeat url("${custom}"), #0A0A0D`;
    localStorage.setItem("hooria-os-wallpaper", "custom");
    if(announce) notify("Wallpaper changed", `Now showing your custom wallpaper.`, "◈");
    return;
  }
  const wp = WALLPAPERS.find(w=>w.id===id) || WALLPAPERS[0];
  const desktop = document.getElementById("desktop");
  if(desktop) desktop.style.background = wp.css;
  localStorage.setItem("hooria-os-wallpaper", id);
  if(announce) notify("Wallpaper changed", `Now showing "${wp.label}".`, "◈");
}
function cycleWallpaper(){
  const current = localStorage.getItem("hooria-os-wallpaper") || "minimal-dark";
  const idx = WALLPAPERS.findIndex(w=>w.id===current);
  const next = WALLPAPERS[(idx+1) % WALLPAPERS.length];
  applyWallpaper(next.id);
}
function uploadCustomWallpaper(file, onDone){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      localStorage.setItem("hooria-os-custom-wallpaper-data", e.target.result);
      applyWallpaper("custom");
      if(onDone) onDone();
    }catch(err){
      notify("Upload failed", "That image was too large to store locally. Try a smaller file.", "◈");
    }
  };
  reader.readAsDataURL(file);
}

/* Secret theme — only offered in the picker after the Konami code has been found. */
function isSecretThemeUnlocked(){
  try{ return !!JSON.parse(localStorage.getItem("hooria-os-achievements")||"{}").konami; }catch(e){ return false; }
}
THEMES["matrix-mode"] = {
  label: "Matrix Mode (secret)", swatch: "#39FF6A", secret:true,
  vars: {
    "--bg-0":"#020402","--bg-1":"#040804","--bg-2":"#061006",
    "--surface":"rgba(57,255,106,.05)","--surface-hi":"rgba(57,255,106,.12)",
    "--border":"rgba(57,255,106,.22)","--border-hi":"rgba(57,255,106,.4)",
    "--text-0":"#CFFFDA","--text-1":"#7FE896","--text-2":"#3E9C55",
    "--violet":"#39FF6A","--cyan":"#B6FF3B","--ember":"#39FF6A"
  }
};

/* Settings-style picker apps can call into (used by a small "Display" section
   inside the Files app System folder, and reachable from the context menu). */
function renderThemePicker(container){
  container.innerHTML = "";
  const current = localStorage.getItem("hooria-os-theme") || "dark";
  const currentWp = localStorage.getItem("hooria-os-wallpaper") || "minimal-dark";
  const unlocked = isSecretThemeUnlocked();
  const visibleThemes = Object.entries(THEMES).filter(([id,t]) => !t.secret || unlocked);

  const uploadInput = el("input", {type:"file", accept:"image/*", style:"display:none;", onchange:(e)=>{
    const file = e.target.files[0];
    if(file) uploadCustomWallpaper(file, ()=> renderThemePicker(container));
  }});

  const hasCustom = !!localStorage.getItem("hooria-os-custom-wallpaper-data");

  const wrap = el("div", {class:"app"},
    el("div", {class:"app-scroll"},
      el("span", {class:"eyebrow"}, "Personalize"),
      el("h1", {class:"app-h"}, "Display Settings"),
      el("p", {class:"app-sub"}, "Pick a theme and a wallpaper — both are remembered on this device."),
      el("h4", {style:"font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin:0 0 10px;"}, "Theme"),
      el("div", {class:"skill-grid", style:"margin-bottom:8px;"}, visibleThemes.map(([id,t])=>
        el("div", {class:"skill-card", style:`cursor:pointer;${id===current?'border-color:var(--violet);':''}`, onclick:()=>{ applyTheme(id); renderThemePicker(container); }},
          el("div", {class:"sk-icon", style:`color:${t.swatch}`}, "●"),
          el("h4", {}, t.label),
          el("p", {}, id===current ? "Active" : "Click to apply")
        )
      )),
      !unlocked ? el("p", {style:"font-size:11.5px;color:var(--text-2);margin:0 0 26px;"}, "🔒 One more theme is hidden — find the Konami code to unlock it.") : el("div",{style:"margin-bottom:26px;"}),
      el("h4", {style:"font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin:0 0 10px;"}, "Wallpaper"),
      el("div", {class:"skill-grid"},
        WALLPAPERS.map(w=>
          el("div", {class:"skill-card", style:`cursor:pointer;${w.id===currentWp?'border-color:var(--cyan);':''}`, onclick:()=>{ applyWallpaper(w.id); renderThemePicker(container); }},
            el("div", {style:`height:36px;border-radius:8px;margin-bottom:10px;background:${w.css};background-size:cover;`}),
            el("h4", {}, w.label)
          )
        ),
        el("div", {class:"skill-card", style:`cursor:pointer;${currentWp==='custom'?'border-color:var(--cyan);':''}`, onclick:()=>{ hasCustom ? applyWallpaper("custom") : uploadInput.click(); renderThemePicker(container); }},
          el("div", {style:`height:36px;border-radius:8px;margin-bottom:10px;${hasCustom?`background:center/cover no-repeat url("${localStorage.getItem("hooria-os-custom-wallpaper-data")}");`:'background:repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 6px, transparent 6px 12px);display:flex;align-items:center;justify-content:center;'}`},
            hasCustom ? "" : el("span",{style:"font-size:11px;color:var(--text-2);"},"+ Upload")),
          el("h4", {}, "Custom"),
          hasCustom ? el("p",{style:"font-size:11px;color:var(--text-2);margin:0;cursor:pointer;", onclick:(e)=>{ e.stopPropagation(); uploadInput.click(); }}, "Replace image") : null
        )
      ),
      uploadInput
    )
  );
  container.appendChild(wrap);
}
