export default function showAbilitiesInfo(abilityManager) {
    const overlay = document.createElement("div");
    overlay.id = "abilities-info";
    overlay.style.position = "fixed";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.8)";
    overlay.style.color = "#fff";
    overlay.style.zIndex = "2000";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.fontFamily = "monospace";
    overlay.innerHTML = `<h2>Abilities</h2>`;
    for (const ab of Object.values(abilityManager.getAll())) {
        overlay.innerHTML += `<div style="margin:8px 0">${ab.label}: <b>${ab.max === Infinity ? "∞" : ab.max}</b> uses</div>`;
    }
    overlay.innerHTML += `<div style="margin-top:2em;font-size:1em;color:#aaa">Press ESC to close</div>`;
    document.body.appendChild(overlay);

    function close() {
        overlay.remove();
        window.removeEventListener("keydown", onKey);
    }
    function onKey(e) {
        if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
}