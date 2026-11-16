// Estufa de Carbono: etapa fotoquímica, ciclo de Calvin e fatores limitantes da fotossíntese.
const CORES = { H2O: ['H₂O', '#90caf9', '#062033'], luz: ['luz ☀️', '#fff59d', '#3a3000'], O2: ['O₂', '#ef9a9a', '#3a0000'], ATP: ['ATP', '#FFD166', '#3a2a00'], NADPH: ['NADPH', '#80deea', '#063'], NADH: ['NADH', '#4fc3f7', '#062033'], CO2: ['CO₂', '#b0bec5', '#111'], glicose: ['glicose', '#f48fb1', '#3a0020'], RuBP: ['RuBP (5 C)', '#ce93d8', '#2a0033'], G3P: ['G3P (3 C)', '#a5d6a7', '#0a2a10'] };
const ficha = (api, t) => { const [n, bg, fg] = CORES[t]; const p = api.el('div', 'peca', n); p.dataset.tipo = t; p.style.background = bg; p.style.color = fg; p.style.fontSize = '13px'; return p; };
const slot = (api, t, rot) => { const a = api.el('div', 'alvo', rot || CORES[t][0]); a.dataset.aceita = t; a.style.minWidth = '82px'; a.style.fontSize = '11px'; return a; };
function ligar(api, pecas, alvos, motivos, aoAcertar) {
  for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { const t = peca.dataset.tipo; if (a.dataset.aceita !== t) { api.erro(motivos[t] || `Aqui entra ${CORES[a.dataset.aceita][0]}, não ${CORES[t][0]}.`); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } api.encaixar(a, peca); api.estado.pontos += 5; aoAcertar(a); return true; } });
}
const cheios = alvos => alvos.filter(a => a.classList.contains('cheio')).length;

const fotoquimica = {
  titulo: 'Etapa fotoquímica (tilacoide)', instrucao: 'Na membrana do tilacoide, a luz é capturada pela clorofila. Monte o que <b>entra</b> e o que <b>sai</b> dessa etapa.',
  ajuda: '<p>A luz excita a clorofila; a <b>água é quebrada (fotólise)</b>, liberando <b>O₂</b>, elétrons e H⁺. A energia dos elétrons produz <b>ATP</b> (fotofosforilação) e <b>NADPH</b>. Nenhum açúcar é feito aqui: ATP e NADPH vão alimentar o ciclo de Calvin. O O₂ que respiramos vem da água, não do CO₂.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Tilacoide</h3><div class="linha" style="margin-bottom:8px"><span style="width:70px;font-size:13px">Entra:</span><span id="entra" class="linha"></span></div><div class="linha"><span style="width:70px;font-size:13px">Sai:</span><span id="sai" class="linha"></span></div>';
    const alvos = []; for (const t of ['H2O', 'luz']) { const a = slot(api, t); q.querySelector('#entra').appendChild(a); alvos.push(a); } for (const t of ['O2', 'ATP', 'NADPH']) { const a = slot(api, t); q.querySelector('#sai').appendChild(a); alvos.push(a); }
    const pal = api.el('div', 'paleta', '<div class="tit">Fichas</div>'); api.tab.appendChild(pal);
    const pecas = ['H2O', 'luz', 'O2', 'ATP', 'NADPH', 'CO2', 'glicose', 'NADH'].map(t => { const p = ficha(api, t); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, { CO2: 'O CO₂ não entra na etapa fotoquímica: ele é fixado depois, no ciclo de Calvin.', glicose: 'Nenhum açúcar é produzido no tilacoide; a glicose vem do ciclo de Calvin.', NADH: 'NADH é da respiração celular. Na fotossíntese o transportador é o NADPH.' }, () => { api.status(`${cheios(alvos)}/${alvos.length}`); if (cheios(alvos) === alvos.length) api.concluirFase('Luz + água → O₂, ATP e NADPH'); });
  },
};
const calvin = {
  titulo: 'Ciclo de Calvin (estroma)', instrucao: 'Agora o carbono: o ciclo tem três etapas. Arraste as moléculas certas para cada uma.',
  ajuda: '<p><b>Fixação</b>: a rubisco liga o <b>CO₂</b> à <b>RuBP</b> (5 C). <b>Redução</b>: gasta <b>ATP e NADPH</b> (da etapa fotoquímica) para formar <b>G3P</b> (3 C). <b>Regeneração</b>: gasta <b>ATP</b> para refazer a <b>RuBP</b>. A cada 3 voltas sobra 1 G3P; <b>6 voltas</b> (6 CO₂) rendem os 2 G3P que formam 1 glicose. O ciclo não usa luz diretamente, mas depende do ATP e do NADPH que a luz produziu.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = `<h3>Três etapas do ciclo</h3>
      <div class="linha" style="margin-bottom:8px"><span style="width:112px;font-size:13px"><b>1. Fixação</b><br><small>rubisco</small></span><span id="f1" class="linha"></span></div>
      <div class="linha" style="margin-bottom:8px"><span style="width:112px;font-size:13px"><b>2. Redução</b><br><small>gasta energia</small></span><span id="f2" class="linha"></span></div>
      <div class="linha"><span style="width:112px;font-size:13px"><b>3. Regeneração</b></span><span id="f3" class="linha"></span></div><div id="pg" style="margin-top:12px"></div>`;
    const alvos = []; const add = (sel, t, rot) => { const a = slot(api, t, rot); q.querySelector(sel).appendChild(a); alvos.push(a); };
    add('#f1', 'CO2', 'entra: CO₂'); add('#f1', 'RuBP', 'liga-se a: RuBP'); add('#f2', 'ATP', 'usa: ATP'); add('#f2', 'NADPH', 'usa: NADPH'); add('#f2', 'G3P', 'forma: G3P'); add('#f3', 'ATP', 'usa: ATP'); add('#f3', 'RuBP', 'refaz: RuBP');
    const pal = api.el('div', 'paleta', '<div class="tit">Fichas</div>'); api.tab.appendChild(pal);
    const pecas = ['CO2', 'RuBP', 'ATP', 'NADPH', 'G3P', 'O2', 'glicose', 'luz'].map(t => { const p = ficha(api, t); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, { O2: 'O O₂ é liberado na etapa fotoquímica; o ciclo de Calvin não o usa (a rubisco até o "confunde" com CO₂ na fotorrespiração).', glicose: 'A glicose se forma FORA do ciclo, a partir de G3P. O produto direto do ciclo é o G3P.', luz: 'O ciclo não usa luz diretamente: usa o ATP e o NADPH que a luz produziu.' }, () => {
      api.status(`${cheios(alvos)}/${alvos.length}`);
      if (cheios(alvos) < alvos.length) return;
      const pg = q.querySelector('#pg'); pg.innerHTML = '<b>Quantas voltas do ciclo (quantos CO₂) para formar 1 glicose?</b><div class="linha" style="margin-top:6px">' + [1, 2, 3, 6].map(v => `<button class="mjBt" data-v="${v}">${v}</button>`).join('') + '</div>';
      pg.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.v === '6') { api.acerto('6 CO₂ → 2 G3P → 1 glicose (C₆)', 20); api.concluirFase(); } else api.erro('Cada volta fixa 1 carbono; a glicose tem 6. A cada 3 voltas sobra 1 G3P (3 C), e são precisos 2 G3P.'); });
    });
  },
};
const fatores = {
  titulo: 'Fatores limitantes', instrucao: 'A taxa de fotossíntese é limitada pelo fator que está <b>mais escasso</b>. Em cada situação, toque no fator que está limitando.',
  ajuda: '<p>Lei do mínimo: aumentar um fator que já está em excesso não muda nada; a taxa só sobe se aumentar o fator <b>limitante</b>. Luz, CO₂ e temperatura são os principais. Temperatura alta demais desnatura enzimas (rubisco) e a taxa cai.</p>',
  async montar(api) {
    const cen = [
      { t: 'Estufa com lâmpadas fortes e 25 °C. Aumentar a luz não muda a taxa; injetar CO₂ no ar faz a taxa subir.', ok: 'CO₂', exp: 'Se adicionar CO₂ aumenta a taxa, o CO₂ era o fator limitante (por isso estufas comerciais enriquecem o ar com CO₂).' },
      { t: 'Manhã nublada de inverno, CO₂ normal, 20 °C. A taxa está baixa e sobe quando o sol aparece.', ok: 'luz', exp: 'Pouca luz = poucos elétrons excitados = pouco ATP/NADPH para o Calvin.' },
      { t: 'Tarde de 45 °C com luz forte e CO₂ abundante. A taxa despencou.', ok: 'temperatura', exp: 'Calor em excesso desnatura enzimas e fecha estômatos (menos CO₂ entra): a temperatura virou o fator limitante.' },
    ];
    let i = 0, acertos = 0; const q = api.quadro();
    const mostrar = () => {
      if (i >= cen.length) { q.innerHTML = `<h3>Concluído</h3><p>${acertos}/${cen.length} situações diagnosticadas.</p>`; api.concluirFase('Fatores limitantes identificados'); return; }
      const c = cen[i]; q.innerHTML = `<h3>Situação ${i + 1}/${cen.length}</h3><p style="font-size:14.5px">${c.t}</p><div class="linha">${['luz', 'CO₂', 'temperatura'].map(f => `<button class="mjBt" data-f="${f}">${f}</button>`).join('')}</div><div id="exp" style="margin-top:10px;font-size:13.5px;color:#cdd8f0"></div>`;
      q.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.f === c.ok) { acertos++; api.acerto(c.exp, 15); q.querySelector('#exp').textContent = c.exp; q.querySelectorAll('button').forEach(x => x.disabled = true); setTimeout(() => { i++; mostrar(); }, 1600); } else api.erro('Pense: qual fator, se aumentado, faria a taxa subir? ' + c.exp); });
    };
    mostrar();
  },
};
export const modulo = { fases: [fotoquimica, calvin, fatores], resumo: () => 'Você montou a fotossíntese inteira: na etapa fotoquímica a água é quebrada e saem O₂, ATP e NADPH; no ciclo de Calvin o CO₂ é fixado pela rubisco, reduzido a G3P com ATP e NADPH e a RuBP é regenerada (6 voltas por glicose); e diagnosticou luz, CO₂ e temperatura como fatores limitantes.' };
