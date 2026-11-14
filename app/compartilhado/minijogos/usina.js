// Usina de Energia: glicólise, oxidação do piruvato + ciclo de Krebs e cadeia respiratória com ATP sintase.
const FICHAS = { ATP: ['ATP', '#FFD166', '#3a2a00'], NADH: ['NADH', '#4fc3f7', '#062033'], FADH2: ['FADH₂', '#ffb74d', '#3a2000'], piruvato: ['piruvato', '#aed581', '#10300f'], acetil: ['acetil-CoA', '#80cbc4', '#063'], CO2: ['CO₂', '#b0bec5', '#111'], O2: ['O₂', '#ef9a9a', '#3a0000'], H2O: ['H₂O', '#90caf9', '#062033'], glicose: ['glicose', '#f48fb1', '#3a0020'] };
const saldo = { atpSub: 0, nadh: 0, fadh2: 0, atpCadeia: 0 };
const ficha = (api, tipo, extra = '') => { const [n, bg, fg] = FICHAS[tipo]; const p = api.el('div', 'peca', n); p.style.background = bg; p.style.color = fg; p.style.fontSize = '13px'; p.dataset.tipo = tipo; if (extra) p.style.cssText += extra; return p; };
const slot = (api, tipo, rotulo) => { const a = api.el('div', 'alvo', rotulo || ''); a.dataset.aceita = tipo; a.style.minWidth = '70px'; a.style.fontSize = '11px'; return a; };
const MOTIVOS = {
  glicolise: { CO2: 'A glicólise não libera CO₂: os 6 carbonos da glicose ficam nos 2 piruvatos.', O2: 'A glicólise não usa oxigênio; ela acontece até em anaerobiose.', FADH2: 'Na glicólise o transportador reduzido é o NADH, não o FADH₂.', acetil: 'Acetil-CoA só se forma na mitocôndria, a partir do piruvato.', H2O: 'Água aparece no fim da cadeia respiratória, não aqui.' },
  krebs: { O2: 'O oxigênio não entra no ciclo de Krebs; ele só é usado no fim da cadeia respiratória.', glicose: 'A glicose nunca entra na mitocôndria inteira: antes vira piruvato no citosol.', piruvato: 'O piruvato precisa virar acetil-CoA antes de entrar no ciclo.', H2O: 'A água é produto da cadeia respiratória.' },
};
function paleta(api, tipos, titulo) { const pal = api.el('div', 'paleta', `<div class="tit">${titulo}</div>`); api.tab.appendChild(pal); const pecas = tipos.map(t => { const p = ficha(api, t); pal.appendChild(p); return p; }); return { pal, pecas }; }
function ligarPaleta(api, pecas, alvos, contexto, aoPreencher) {
  for (const p of pecas) api.arrastavel(p, {
    alvos, clonar: true,
    aoSoltar(a, peca) {
      const t = peca.dataset.tipo;
      if (a.dataset.aceita !== t) { const m = (MOTIVOS[contexto] || {})[t] || `Aqui entra ${FICHAS[a.dataset.aceita][0]}, não ${FICHAS[t][0]}.`; api.erro(m); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
      api.encaixar(a, peca); api.estado.pontos += 4; aoPreencher(a); return true;
    },
  });
}
const todosCheios = alvos => alvos.every(a => a.classList.contains('cheio'));

const glicolise = {
  titulo: 'Glicólise (citosol)', instrucao: 'A glicose (6 C) é quebrada em dois piruvatos (3 C) no citosol, sem oxigênio. Preencha o balanço da via arrastando as fichas certas.',
  ajuda: `<p><b>Glicólise</b>: investe 2 ATP para ativar a glicose, produz 4 ATP (saldo <b>+2 ATP</b>), reduz 2 NAD⁺ a <b>2 NADH</b> e termina com <b>2 piruvatos</b>. Não gasta O₂ e não libera CO₂. Em anaerobiose, o piruvato segue para a fermentação só para regenerar NAD⁺.</p>`,
  async montar(api) {
    const q = api.quadro(); q.innerHTML = `<h3>Balanço da glicólise</h3>
      <div class="linha" style="margin-bottom:8px"><span class="peca" style="background:#f48fb1;color:#3a0020;cursor:default">glicose (C₆)</span><span>→</span><span id="s1" class="linha"></span></div>
      <div class="linha" style="margin-bottom:8px"><span style="width:110px;font-size:13px">Investe:</span><span id="s2" class="linha"></span></div>
      <div class="linha" style="margin-bottom:8px"><span style="width:110px;font-size:13px">Produz:</span><span id="s3" class="linha"></span></div>
      <div class="linha"><span style="width:110px;font-size:13px">Reduz:</span><span id="s4" class="linha"></span></div><div id="pergunta" style="margin-top:12px"></div>`;
    const alvos = [];
    const add = (sel, tipo, n) => { for (let k = 0; k < n; k++) { const a = slot(api, tipo, FICHAS[tipo][0]); q.querySelector(sel).appendChild(a); alvos.push(a); } };
    add('#s1', 'piruvato', 2); add('#s2', 'ATP', 2); add('#s3', 'ATP', 4); add('#s4', 'NADH', 2);
    const { pecas } = paleta(api, ['ATP', 'NADH', 'piruvato', 'CO2', 'O2', 'FADH2', 'acetil'], 'Fichas');
    ligarPaleta(api, pecas, alvos, 'glicolise', () => {
      api.status(`${alvos.filter(a => a.classList.contains('cheio')).length}/${alvos.length} fichas`);
      if (!todosCheios(alvos)) return;
      api.acerto('Balanço montado!', 10);
      const pg = q.querySelector('#pergunta'); pg.innerHTML = `<b>Saldo líquido de ATP da glicólise?</b> <div class="linha" style="margin-top:6px">${[0, 2, 4, 6].map(v => `<button class="mjBt" data-v="${v}">${v} ATP</button>`).join('')}</div>`;
      pg.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.v === '2') { saldo.atpSub += 2; saldo.nadh += 2; api.acerto('Saldo: 4 produzidos − 2 investidos = 2 ATP', 15); pg.innerHTML = '<b style="color:#36D399">Saldo: +2 ATP · 2 NADH · 2 piruvatos seguem para a mitocôndria.</b>'; api.concluirFase(); } else api.erro('Lembre: produz 4, mas investiu 2 no início.'); });
    });
    api.status('0/10 fichas');
  },
};

const krebs = {
  titulo: 'Mitocôndria: piruvato e ciclo de Krebs', instrucao: 'Na <b>matriz</b>, cada piruvato perde CO₂ e vira acetil-CoA (com 1 NADH). O acetil-CoA entra no ciclo de Krebs, que gira <b>duas vezes</b> por glicose. Monte os produtos.',
  ajuda: `<p><b>Oxidação do piruvato</b> (por piruvato): 1 CO₂, 1 NADH, 1 acetil-CoA (2 C).<br><b>Ciclo de Krebs</b> (por volta): 3 NADH, 1 FADH₂, 1 ATP (GTP), 2 CO₂. Como são 2 acetil-CoA por glicose, tudo dobra. Ao fim, os 6 carbonos da glicose já saíram como 6 CO₂; a energia está guardada em <b>10 NADH e 2 FADH₂</b>.</p>`,
  async montar(api) {
    const q = api.quadro(); q.innerHTML = `<h3>1) Oxidação do piruvato (×2)</h3><div class="linha" id="ox"><span class="peca" style="background:#aed581;color:#10300f;cursor:default">piruvato</span><span>→</span></div>
      <h3 style="margin-top:12px">2) Ciclo de Krebs (uma volta)</h3><div class="linha" id="kr"><div class="alvo" id="entrada" data-aceita="acetil" style="min-width:92px;height:56px">entra: acetil-CoA</div><span>⟳</span><span id="saida" class="linha"></span></div><div id="volta2" style="margin-top:10px"></div>`;
    const alvosOx = [], alvosKr = [];
    for (const t of ['CO2', 'NADH', 'acetil']) { const a = slot(api, t, FICHAS[t][0]); q.querySelector('#ox').appendChild(a); alvosOx.push(a); }
    const entrada = q.querySelector('#entrada'); alvosKr.push(entrada);
    for (const [t, n] of [['NADH', 3], ['FADH2', 1], ['ATP', 1], ['CO2', 2]]) for (let k = 0; k < n; k++) { const a = slot(api, t, FICHAS[t][0]); q.querySelector('#saida').appendChild(a); alvosKr.push(a); }
    alvosKr.slice(1).forEach(a => a.style.opacity = .4);
    const { pecas } = paleta(api, ['CO2', 'NADH', 'acetil', 'ATP', 'FADH2', 'O2', 'glicose', 'piruvato'], 'Fichas');
    let voltas = 0;
    ligarPaleta(api, pecas, () => [...alvosOx, ...(todosCheios(alvosOx) ? alvosKr : [])], 'krebs', a => {
      if (a === entrada) { alvosKr.slice(1).forEach(x => x.style.opacity = 1); api.info('Acetil-CoA entrou: o ciclo gira.'); }
      if (todosCheios(alvosOx) && !entrada.classList.contains('cheio')) api.info('Agora arraste o acetil-CoA para o ciclo.');
      if (todosCheios(alvosKr) && !voltas) {
        voltas = 1; api.acerto('Primeira volta do ciclo completa', 15);
        const v = q.querySelector('#volta2'); v.innerHTML = `<p style="font-size:13.5px;color:#cdd8f0">O segundo piruvato faz o mesmo caminho. Quantas <b>voltas do ciclo</b> por molécula de glicose?</p><div class="linha">${[1, 2, 3, 6].map(n => `<button class="mjBt" data-n="${n}">${n}</button>`).join('')}</div>`;
        v.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.n === '2') { saldo.nadh += 2 + 6; saldo.fadh2 += 2; saldo.atpSub += 2; api.acerto('2 voltas: no total 8 NADH, 2 FADH₂, 2 ATP e 6 CO₂ nesta etapa', 20); v.innerHTML = `<b style="color:#36D399">Até aqui: ${saldo.atpSub} ATP diretos · ${saldo.nadh} NADH · ${saldo.fadh2} FADH₂. Carbono da glicose: todo liberado como CO₂.</b>`; api.concluirFase(); } else api.erro('Uma glicose gera 2 acetil-CoA, então são 2 voltas.'); });
      }
      api.status(`${[...alvosOx, ...alvosKr].filter(x => x.classList.contains('cheio')).length}/${alvosOx.length + alvosKr.length} fichas`);
    });
  },
};

const cadeia = {
  titulo: 'Cadeia respiratória e ATP sintase', instrucao: 'Entregue os <b>NADH</b> ao complexo I e os <b>FADH₂</b> ao complexo II: os elétrons passam pela cadeia e bombeiam H⁺ para o espaço intermembranas. Coloque o <b>aceptor final</b> no complexo IV e gire a <b>ATP sintase</b> para transformar o gradiente em ATP.',
  ajuda: `<p>Os elétrons do NADH entram no <b>complexo I</b>; os do FADH₂, no <b>complexo II</b> (por isso rendem menos). Ao passar pelos complexos I, III e IV, a energia bombeia H⁺ para fora da matriz. O <b>O₂</b> é o aceptor final: recebe elétrons e H⁺ e vira <b>H₂O</b>. Sem O₂ a cadeia trava e o NADH não é reoxidado. Os H⁺ voltam pela <b>ATP sintase</b>, que gira e fosforila ADP em ATP (quimiosmose): cerca de 2,5 ATP por NADH e 1,5 por FADH₂, totalizando ~30 a 32 ATP por glicose.</p>`,
  async montar(api) {
    const { el } = api;
    let nadh = saldo.nadh || 10, fadh2 = saldo.fadh2 || 2, h = 0, atp = 0, o2 = false, entregues = 0;
    const totalEntregas = nadh + fadh2;
    const q = api.quadro(); q.innerHTML = `<h3>Membrana interna da mitocôndria</h3>
      <div style="font-size:12px;color:#9fb3d9;margin-bottom:4px">espaço intermembranas · H⁺: <b id="hcount" style="color:#FFD166;font-size:15px">0</b> <span id="hdots"></span></div>
      <div class="linha" style="gap:8px;align-items:stretch;padding:8px;border-radius:14px;background:linear-gradient(#3b4a6b,#263352)">
        <div class="alvo" id="c1" data-aceita="NADH" data-multi="1" style="flex:1;min-width:64px;height:64px;flex-direction:column;font-size:11px"><b>I</b>NADH</div>
        <div class="alvo" id="c2" data-aceita="FADH2" data-multi="1" style="flex:1;min-width:64px;height:64px;flex-direction:column;font-size:11px"><b>II</b>FADH₂</div>
        <div class="peca" style="flex:1;min-width:48px;height:64px;cursor:default;background:#5c6bc0;font-size:12px">III</div>
        <div class="alvo" id="c4" data-aceita="O2" style="flex:1.3;min-width:78px;height:64px;flex-direction:column;font-size:11px"><b>IV</b>aceptor?</div>
        <button class="mjBt ouro" id="sintase" disabled style="flex:1.2;min-width:84px;height:64px;font-size:12px;line-height:1.15">ATP sintase<br>⟳ girar</button>
      </div>
      <div style="font-size:12px;color:#9fb3d9;margin-top:4px">matriz · ATP produzidos aqui: <b id="atpcount" style="color:#FFD166;font-size:15px">0</b> · elétrons: <span id="ele">aguardando</span></div>
      <div class="cartao" style="margin-top:8px"><div class="linha" style="justify-content:space-between"><span style="font-size:13px">Transportadores reduzidos vindos das etapas anteriores:</span></div><div class="linha" id="estoque" style="margin-top:6px"></div></div>`;
    const estoque = q.querySelector('#estoque'), hcount = q.querySelector('#hcount'), hdots = q.querySelector('#hdots'), atpcount = q.querySelector('#atpcount'), ele = q.querySelector('#ele'), sintase = q.querySelector('#sintase');
    const c1 = q.querySelector('#c1'), c2 = q.querySelector('#c2'), c4 = q.querySelector('#c4');
    const pilhaN = ficha(api, 'NADH'), pilhaF = ficha(api, 'FADH2'); const badge = (p, n) => { p.innerHTML = `${FICHAS[p.dataset.tipo][0]} <small>×${n}</small>`; p.style.display = n > 0 ? '' : 'none'; };
    badge(pilhaN, nadh); badge(pilhaF, fadh2); estoque.append(pilhaN, pilhaF);
    const atualizar = () => { hcount.textContent = h; hdots.textContent = '•'.repeat(Math.min(40, Math.floor(h / 3))); atpcount.textContent = atp; sintase.disabled = h < 4; sintase.classList.toggle('pulso', h >= 4 && o2); api.status(`Entregas ${entregues}/${totalEntregas} · O₂ ${o2 ? '✓' : 'faltando'} · ATP da cadeia: ${atp}`); checa(); };
    const checa = () => { if (entregues === totalEntregas && o2 && h < 4 && !cadeia._fim) { cadeia._fim = true; saldo.atpCadeia = atp; const total = saldo.atpSub + atp; api.acerto(`Cadeia concluída: ${atp} ATP por quimiosmose`, 25); const r = el('div', 'cartao', `<h3>Balanço final por glicose</h3><p style="font-size:14px">ATP diretos (glicólise + Krebs): <b>${saldo.atpSub}</b> · ATP da cadeia: <b>${atp}</b> · <b style="color:#FFD166;font-size:17px">Total ≈ ${total} ATP</b><br><span style="font-size:13px;color:#9fb3d9">Sem oxigênio, a cadeia para, o NADH não é regenerado e a célula só consegue os 2 ATP da glicólise (fermentação).</span></p>`); api.tab.appendChild(r); api.concluirFase(); } };
    const entregar = (tipo, alvo) => {
      if (!o2 && entregues >= 3) { api.erro('A cadeia travou: sem aceptor final os elétrons não têm para onde ir. Coloque o O₂ no complexo IV.'); return false; }
      if (tipo === 'NADH') { nadh--; badge(pilhaN, nadh); h += 10; } else { fadh2--; badge(pilhaF, fadh2); h += 6; }
      entregues++; alvo.classList.add('cheio'); setTimeout(() => alvo.classList.remove('cheio'), 350);
      ele.textContent = tipo === 'NADH' ? 'I → III → IV (bombeia H⁺ em I, III e IV)' : 'II → III → IV (bombeia H⁺ em III e IV)';
      api.estado.pontos += 3; atualizar(); return true;
    };
    for (const [p, tipo] of [[pilhaN, 'NADH'], [pilhaF, 'FADH2']]) api.arrastavel(p, {
      alvos: [c1, c2, c4], clonar: true,
      aoSoltar(a, peca) {
        if (a === c4) { api.erro('O complexo IV recebe o aceptor final (O₂), não transportadores.'); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
        if (a.dataset.aceita !== tipo) { api.erro(tipo === 'NADH' ? 'O NADH entrega seus elétrons ao complexo I.' : 'O FADH₂ entra pelo complexo II (por isso rende menos ATP).'); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
        const ok = entregar(tipo, a); peca.remove(); return ok;
      },
    });
    const { pecas } = paleta(api, ['O2', 'CO2', 'H2O', 'glicose'], 'Aceptor final para o complexo IV');
    for (const p of pecas) api.arrastavel(p, {
      alvos: [c4], clonar: true,
      aoSoltar(a, peca) {
        const t = peca.dataset.tipo;
        if (t !== 'O2') { api.erro({ CO2: 'CO₂ é produto do Krebs, não aceita elétrons.', H2O: 'A água é o produto formado depois que o O₂ recebe os elétrons.', glicose: 'A glicose é o combustível inicial, não o aceptor final.' }[t]); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
        api.encaixar(a, peca); o2 = true; a.innerHTML = '<b>IV</b><span class="peca" style="background:#90caf9;color:#062033;height:28px;min-width:40px;font-size:12px;cursor:default">O₂ → H₂O</span>'; api.acerto('O₂ aceita os elétrons e vira água', 15); atualizar(); return true;
      },
    });
    sintase.onclick = () => { if (h < 4) return; if (!o2) { api.erro('Sem O₂ o fluxo de elétrons para e o gradiente não se mantém.'); return; } h -= 4; atp++; sintase.style.transform = `rotate(${atp * 90}deg)`; api.estado.pontos += 1; atualizar(); };
    atualizar();
  },
};

export const modulo = {
  fases: [glicolise, krebs, cadeia],
  resumo: () => `Você operou a usina inteira: glicólise no citosol (+2 ATP, 2 NADH), oxidação do piruvato e duas voltas do ciclo de Krebs na matriz (CO₂ liberado, 10 NADH e 2 FADH₂ no total) e a cadeia respiratória na membrana interna, onde o O₂ é o aceptor final e a ATP sintase converte o gradiente de H⁺ em ≈ ${saldo.atpSub + saldo.atpCadeia || 32} ATP.`,
};
