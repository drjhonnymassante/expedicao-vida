// Minijogos pedagógicos do Expedição Vida: o aluno monta o processo com as mãos.
// Núcleo: tela cheia, fases, pontuação, arrastar e soltar (mouse e toque), feedback e tela final.
// Uso: import { abrirMinijogo, MINIJOGOS } from '.../minijogos/minijogos.js';
//      const r = await abrirMinijogo('fabrica');  // { venceu, pontos, erros, segundos }

const CSS = `
#mj { position: fixed; inset: 0; z-index: 80; background: radial-gradient(ellipse at 50% 0%, #1c2a4a, #0b1424 70%); color: #fff; font-family: Nunito, system-ui, sans-serif; display: flex; flex-direction: column; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
#mj * { box-sizing: border-box; }
#mj .mjTopo { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(0,0,0,.25); border-bottom: 1px solid rgba(255,255,255,.08); }
#mj .mjTopo h2 { font-family: Fredoka, Nunito, sans-serif; font-size: 18px; margin: 0; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#mj .mjTopo .etq { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #7CFFB2; font-weight: 800; }
#mj .mjPlacar { display: flex; gap: 8px; font-size: 13px; font-weight: 800; }
#mj .mjPlacar span { background: rgba(255,255,255,.1); padding: 4px 9px; border-radius: 999px; }
#mj .mjBt { border: 0; border-radius: 12px; padding: 9px 14px; font: 800 14px Nunito, sans-serif; cursor: pointer; background: rgba(255,255,255,.12); color: #fff; }
#mj .mjBt.prim { background: #36D399; color: #06281a; }
#mj .mjBt.ouro { background: #FFD166; color: #3a2a00; }
#mj .mjBt.roxo { background: #8E7CFF; color: #fff; }
#mj .mjBt:disabled { opacity: .45; cursor: default; }
#mj .mjPassos { display: flex; gap: 6px; padding: 8px 14px 0; }
#mj .mjPassos i { flex: 1; height: 5px; border-radius: 4px; background: rgba(255,255,255,.14); }
#mj .mjPassos i.ok { background: #36D399; } #mj .mjPassos i.atual { background: #FFD166; }
#mj .mjInstr { padding: 10px 14px 4px; font-size: 14.5px; line-height: 1.35; color: #dfe8ff; }
#mj .mjInstr b { color: #FFD166; }
#mj .mjArea { flex: 1; position: relative; overflow: auto; padding: 8px 14px 14px; }
#mj .mjTab { position: relative; min-height: 100%; }
#mj .mjFx { position: absolute; left: 50%; bottom: 96px; transform: translateX(-50%); background: rgba(10,16,28,.92); border: 1px solid rgba(255,255,255,.15); padding: 10px 16px; border-radius: 14px; font-weight: 800; font-size: 14px; max-width: 92vw; text-align: center; opacity: 0; transition: opacity .25s, transform .25s; pointer-events: none; z-index: 5; }
#mj .mjFx.on { opacity: 1; transform: translateX(-50%) translateY(-6px); }
#mj .mjFx.erro { border-color: #ff6b6b; color: #ffb3b3; } #mj .mjFx.ok { border-color: #36D399; color: #b9ffd9; }
#mj .mjRodape { display: flex; gap: 8px; padding: 10px 14px; background: rgba(0,0,0,.25); border-top: 1px solid rgba(255,255,255,.08); align-items: center; }
#mj .mjRodape .esp { flex: 1; }
/* peças e alvos */
#mj .peca { display: inline-flex; align-items: center; justify-content: center; gap: 4px; min-width: 46px; height: 46px; padding: 0 10px; border-radius: 12px; font-weight: 900; font-size: 15px; background: #2a3b63; border: 2px solid rgba(255,255,255,.18); box-shadow: 0 4px 12px rgba(0,0,0,.35); cursor: grab; position: relative; transition: transform .12s; }
#mj .peca:active { cursor: grabbing; }
#mj .arrastando { position: fixed !important; z-index: 50; pointer-events: none; margin: 0; }
#mj .peca.arrastando { transform: scale(1.08); box-shadow: 0 14px 30px rgba(0,0,0,.5); }
#mj .peca small { font-size: 10px; font-weight: 700; opacity: .8; }
#mj .alvo { display: inline-flex; align-items: center; justify-content: center; min-width: 46px; height: 46px; border-radius: 12px; border: 2px dashed rgba(255,255,255,.35); background: rgba(255,255,255,.05); font-size: 12px; color: rgba(255,255,255,.55); transition: background .15s, border-color .15s; position: relative; }
#mj .alvo.sobre { background: rgba(255,209,102,.18); border-color: #FFD166; }
#mj .alvo.cheio { border-style: solid; border-color: #36D399; background: rgba(54,211,153,.15); color: #fff; }
#mj .alvo.errado { animation: mjTreme .4s; border-color: #ff6b6b; }
@keyframes mjTreme { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
#mj .paleta { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; border-radius: 14px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); margin-top: 10px; }
#mj .paleta .tit { width: 100%; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #9fb3d9; font-weight: 800; }
#mj .linha { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
#mj .cartao { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 12px; margin-top: 10px; }
#mj .cartao h3 { margin: 0 0 8px; font-family: Fredoka, Nunito, sans-serif; font-size: 15px; color: #FFD166; }
#mj .pulso { animation: mjPulso 1.2s infinite; } @keyframes mjPulso { 50% { box-shadow: 0 0 0 8px rgba(255,209,102,.18) } }
#mj .mjFim { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(5,10,20,.8); z-index: 20; animation: mjAparece .3s; }
@keyframes mjAparece { from { opacity: 0 } }
#mj .mjFim .cx { width: min(460px, 92vw); background: linear-gradient(160deg, #203055, #141d33); border: 1px solid rgba(255,255,255,.15); border-radius: 22px; padding: 22px; text-align: center; }
#mj .mjFim h2 { font-family: Fredoka, Nunito, sans-serif; margin: 6px 0 10px; font-size: 24px; }
#mj .mjFim .nums { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
#mj .mjFim .nums span { background: rgba(255,255,255,.1); border-radius: 999px; padding: 6px 12px; font-weight: 800; font-size: 13px; }
#mj .mjFim p { color: #cdd8f0; font-size: 14px; line-height: 1.4; }
#mj .mjAjuda { position: absolute; inset: 0; background: rgba(5,10,20,.85); z-index: 15; display: grid; place-items: center; }
#mj .mjAjuda .cx { width: min(520px, 92vw); max-height: 80vh; overflow: auto; background: #141d33; border-radius: 18px; padding: 18px; border: 1px solid rgba(255,255,255,.15); font-size: 14px; line-height: 1.45; }
#mj table.tb { border-collapse: collapse; width: 100%; font-size: 13px; } #mj table.tb td, #mj table.tb th { border: 1px solid rgba(255,255,255,.12); padding: 4px 6px; text-align: center; }
@media (max-width: 480px) { #mj .peca { min-width: 42px; height: 42px; font-size: 14px; padding: 0 8px; } #mj .alvo { min-width: 42px; height: 42px; } #mj .mjInstr { font-size: 13.5px; } }
`;

let folhaCss = null;
function garantirCss() { if (!folhaCss) { folhaCss = document.createElement('style'); folhaCss.textContent = CSS; document.head.appendChild(folhaCss); } }
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
export const embaralhar = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
export const espera = ms => new Promise(r => setTimeout(r, ms));

// arrastar e soltar por ponteiro: a peça segue o dedo; ao soltar, procura um alvo sob o centro da peça
export function arrastavel(peca, { alvos, aoSoltar, clonar = false, podeSoltar = () => true }) {
  let ativo = null, origem = null, dx = 0, dy = 0, x0 = 0, y0 = 0, moveu = false;
  const lista = () => (typeof alvos === 'function' ? alvos() : alvos) || [];
  const alvoSob = (x, y) => { for (const a of lista()) { if (a.classList.contains('cheio') && !a.dataset.multi) continue; const r = a.getBoundingClientRect(); if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) return a; } return null; };
  const baixo = ev => {
    if (ev.button != null && ev.button !== 0) return;
    if (peca.dataset.travada) return;
    ev.preventDefault();
    const r = peca.getBoundingClientRect();
    ativo = clonar ? peca.cloneNode(true) : peca;
    x0 = ev.clientX; y0 = ev.clientY; moveu = false;
    if (clonar) { ativo.dataset.clone = '1'; (document.getElementById('mj') || document.body).appendChild(ativo); } else { origem = { parent: peca.parentNode, next: peca.nextSibling, ph: document.createElement('span') }; peca.dataset.zOrigem = (peca.parentNode && peca.parentNode.dataset && peca.parentNode.dataset.z) || '';
      origem.ph.style.cssText = `display:inline-block;width:${r.width}px;height:${r.height}px;visibility:hidden;flex:none`; peca.parentNode.insertBefore(origem.ph, peca);   // segura o lugar para o resto não se mexer
      (document.getElementById('mj') || document.body).appendChild(ativo); }
    dx = ev.clientX - r.left; dy = ev.clientY - r.top;
    ativo.classList.add('arrastando'); ativo.style.width = r.width + 'px'; ativo.style.height = r.height + 'px';
    mover(ev);
    window.addEventListener('pointermove', mover, { passive: false }); window.addEventListener('pointerup', solta); window.addEventListener('pointercancel', solta);
  };
  const mover = ev => {
    if (!ativo) return; ev.preventDefault();
    if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) moveu = true;
    ativo.style.left = (ev.clientX - dx) + 'px'; ativo.style.top = (ev.clientY - dy) + 'px';
    const r = ativo.getBoundingClientRect(), a = alvoSob(r.left + r.width / 2, r.top + r.height / 2);
    for (const z of lista()) z.classList.toggle('sobre', z === a);
  };
  const solta = ev => {
    window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', solta); window.removeEventListener('pointercancel', solta);
    if (!ativo) return;
    const r = ativo.getBoundingClientRect(), a = alvoSob(r.left + r.width / 2, r.top + r.height / 2);
    for (const z of lista()) z.classList.remove('sobre');
    ativo.classList.remove('arrastando'); ativo.style.left = ativo.style.top = ativo.style.width = ativo.style.height = '';
    const p = ativo; ativo = null;
    let aceito = false;
    if (a && podeSoltar(a, p)) aceito = aoSoltar(a, p) !== false;
    if (!aceito) {
      if (clonar) p.remove(); else origem.ph.replaceWith(p);
      if (!moveu && !clonar) p.dispatchEvent(new CustomEvent('tap', { bubbles: false }));   // toque sem arrastar
    } else if (!clonar) { if (origem.ph.parentNode) origem.ph.remove(); } else if (clonar) { /* a peça clonada já foi colocada por aoSoltar; se não foi, remove */ if (!p.parentNode || p.parentNode === document.body || p.parentNode.id === 'mj') p.remove(); }
  };
  peca.addEventListener('pointerdown', baixo);
  return () => peca.removeEventListener('pointerdown', baixo);
}

// coloca uma peça (ou cópia) dentro de um alvo e marca como cheio
export function encaixar(alvo, peca, { travar = true } = {}) {
  alvo.innerHTML = ''; alvo.appendChild(peca); alvo.classList.add('cheio'); alvo.classList.remove('errado');
  peca.classList.remove('arrastando'); peca.style.cssText = ''; if (travar) peca.dataset.travada = '1';
}

export function abrirMinijogo(id, opts = {}) {
  garantirCss();
  const def = MINIJOGOS[id]; if (!def) return Promise.reject(new Error('minijogo desconhecido: ' + id));
  return new Promise(async resolve => {
    const raiz = el('div'); raiz.id = 'mj';
    raiz.innerHTML = `<div class="mjTopo"><div style="min-width:0;flex:1"><div class="etq">Laboratório · ${esc(def.area)}</div><h2>${esc(def.titulo)}</h2></div><div class="mjPlacar"><span id="mjPts">⭐ 0</span><span id="mjErr">❌ 0</span></div><button class="mjBt" id="mjSair" title="Sair">✕</button></div>
      <div class="mjPassos" id="mjPassos"></div><div class="mjInstr" id="mjInstr"></div><div class="mjArea"><div class="mjTab" id="mjTab"></div><div class="mjFx" id="mjFx"></div></div>
      <div class="mjRodape"><button class="mjBt" id="mjAjuda">💡 Ajuda</button><span class="esp" id="mjStatus" style="font-size:13px;color:#9fb3d9"></span><button class="mjBt prim" id="mjProx" disabled>Próxima etapa →</button></div>`;
    document.body.appendChild(raiz);
    const $ = s => raiz.querySelector(s);
    const estado = { pontos: 0, erros: 0, fase: 0, t0: Date.now(), fechado: false };
    let fxT = null, resolverFase = null;
    const fx = (msg, tipo) => { const f = $('#mjFx'); f.textContent = msg; f.className = 'mjFx on ' + (tipo || ''); clearTimeout(fxT); fxT = setTimeout(() => f.classList.remove('on'), tipo === 'erro' ? 2600 : 1700); };
    const placar = () => { $('#mjPts').textContent = '⭐ ' + estado.pontos; $('#mjErr').textContent = '❌ ' + estado.erros; };
    const { modulo } = await import(def.arquivo);
    const fases = modulo.fases;
    const api = {
      raiz, tab: $('#mjTab'), estado, el, esc, embaralhar, espera, arrastavel, encaixar,
      acerto(msg, pts = 10) { estado.pontos += pts; placar(); if (msg) fx('✅ ' + msg, 'ok'); },
      erro(msg) { estado.erros++; estado.pontos = Math.max(0, estado.pontos - 3); placar(); fx('✖ ' + msg, 'erro'); if (navigator.vibrate) navigator.vibrate(40); },
      info(msg) { fx(msg, ''); },
      status(txt) { $('#mjStatus').textContent = txt || ''; },
      instrucao(html) { $('#mjInstr').innerHTML = html; },
      concluirFase(msg) { $('#mjProx').disabled = false; $('#mjProx').classList.add('pulso'); if (msg) fx('🎉 ' + msg, 'ok'); api.status('Etapa concluída.'); },
      ajuda(html) { api._ajuda = html; },
      quadro() { const d = el('div', 'cartao'); api.tab.appendChild(d); return d; },
    };
    const desenharPassos = () => { $('#mjPassos').innerHTML = fases.map((_, i) => `<i class="${i < estado.fase ? 'ok' : i === estado.fase ? 'atual' : ''}"></i>`).join(''); };
    const abrirFase = async () => {
      const f = fases[estado.fase]; desenharPassos();
      api.tab.innerHTML = ''; $('#mjProx').disabled = true; $('#mjProx').classList.remove('pulso'); api.status(''); api._ajuda = f.ajuda || def.ajuda || '';
      api.instrucao(`<b>${esc(f.titulo)}</b> · ${f.instrucao}`);
      $('#mjProx').textContent = estado.fase === fases.length - 1 ? 'Concluir ✓' : 'Próxima etapa →';
      await f.montar(api);
    };
    const fim = venceu => {
      if (estado.fechado) return; estado.fechado = true;
      const seg = Math.round((Date.now() - estado.t0) / 1000);
      const bonus = venceu ? Math.max(0, 60 - estado.erros * 10) : 0; estado.pontos += bonus;
      const resumo = (modulo.resumo && modulo.resumo(api)) || '';
      const cx = el('div', 'mjFim', `<div class="cx"><div style="font-size:44px">${venceu ? '🏆' : '🧪'}</div><h2>${venceu ? 'Processo concluído!' : 'Experimento interrompido'}</h2>
        <div class="nums"><span>⭐ ${estado.pontos} pontos</span><span>❌ ${estado.erros} ${estado.erros === 1 ? 'erro' : 'erros'}</span><span>⏱ ${Math.floor(seg / 60)}m${String(seg % 60).padStart(2, '0')}s</span>${bonus ? `<span>🎁 +${bonus} precisão</span>` : ''}</div>
        ${venceu ? `<p>${resumo}</p>` : '<p>Você pode voltar quando quiser; o laboratório fica aberto.</p>'}
        <button class="mjBt prim" id="mjFechar">${venceu ? 'Receber recompensa' : 'Sair'}</button></div>`);
      raiz.appendChild(cx);
      cx.querySelector('#mjFechar').onclick = () => { raiz.remove(); resolve({ venceu, pontos: estado.pontos, erros: estado.erros, segundos: seg, id }); };
    };
    $('#mjSair').onclick = () => { if (confirmaSair) { fim(false); return; } confirmaSair = true; $('#mjSair').textContent = 'Sair?'; setTimeout(() => { confirmaSair = false; $('#mjSair').textContent = '✕'; }, 2500); };
    let confirmaSair = false;
    $('#mjProx').onclick = () => { if ($('#mjProx').disabled) return; estado.fase++; if (estado.fase >= fases.length) { desenharPassos(); fim(true); } else abrirFase(); };
    $('#mjAjuda').onclick = () => { const a = el('div', 'mjAjuda', `<div class="cx">${api._ajuda || 'Siga a instrução da etapa.'}<div style="text-align:right;margin-top:12px"><button class="mjBt prim" id="mjFechaAjuda">Entendi</button></div></div>`); raiz.appendChild(a); a.querySelector('#mjFechaAjuda').onclick = () => a.remove(); };
    abrirFase();
  });
}

const BASE = new URL('./', import.meta.url).href;
export const MINIJOGOS = {
  fabrica: { titulo: 'Fábrica de Proteínas', area: 'DNA → RNA → proteína', arquivo: BASE + 'fabrica.js', icone: '🧬', desc: 'Transcreva o DNA, processe o RNA e traduza códon por códon até fechar a proteína.', topicos: ['acidos-nucleicos-estrutura', 'transcricao-rna', 'codigo-genetico-traducao', 'duplicacao-dna'] },
  usina: { titulo: 'Usina de Energia', area: 'Respiração celular', arquivo: BASE + 'usina.js', icone: '⚡', desc: 'Da glicose ao ATP: monte a glicólise, gire o ciclo de Krebs e opere a cadeia respiratória.', topicos: ['atp-metabolismo', 'respiracao-glicolise-krebs', 'cadeia-respiratoria', 'fermentacao-quimiossintese'] },
  oficina: { titulo: 'Oficina da Divisão Celular', area: 'Mitose e meiose', arquivo: BASE + 'oficina.js', icone: '🔬', desc: 'Duplique, alinhe e separe os cromossomos: faça a mitose e a meiose acontecerem e veja a variabilidade nascer.', topicos: ['ciclo-celular-interfase', 'mitose', 'meiose', 'controle-ciclo-cancer'] },
};
export const minijogoDoTopico = id => Object.keys(MINIJOGOS).find(k => MINIJOGOS[k].topicos.includes(id)) || null;
