// Quartel de Defesa: imunidade inata × adaptativa, especificidade anticorpo-antígeno, vacina × soro e memória imunológica.
const ficha = (api, n, t, cor = '#2a3b63') => { const p = api.el('div', 'peca', n); p.dataset.tipo = t; p.style.background = cor; p.style.fontSize = '13px'; return p; };
const bin = (api, t, n) => { const cx = api.el('div', ''); cx.style.flex = '1'; cx.style.minWidth = '170px'; cx.innerHTML = `<div style="font-size:12.5px;font-weight:800;margin-bottom:4px">${n}</div>`; const a = api.el('div', 'alvo'); a.dataset.aceita = t; a.dataset.multi = '1'; a.style.cssText = 'min-height:70px;flex-wrap:wrap;gap:6px;padding:6px;justify-content:flex-start;align-items:flex-start'; cx.appendChild(a); return { cx, a }; };
function ligarBins(api, pecas, bins, motivo, aoAcertar) {
  for (const p of pecas) api.arrastavel(p, { alvos: bins, clonar: true, aoSoltar(a, peca) { const t = peca.dataset.tipo; if (a.dataset.aceita !== t) { api.erro(motivo(t, peca)); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } a.appendChild(peca); peca.classList.remove('arrastando'); peca.style.cssText = ''; peca.dataset.travada = '1'; p.style.display = 'none'; api.estado.pontos += 6; aoAcertar(); return true; } });
}
const linhas = {
  titulo: 'Linhas de defesa', instrucao: 'O corpo tem defesas <b>inatas</b> (nascem com você, agem contra qualquer invasor, rápido) e <b>adaptativas</b> (específicas para cada antígeno, com memória). Separe as peças.',
  ajuda: '<p><b>Inata</b>: pele e mucosas, muco e cílios, acidez do estômago, lisozima, fagócitos (macrófagos, neutrófilos), inflamação, febre, interferons. Age em horas, igual para tudo.<br><b>Adaptativa</b>: linfócitos <b>B</b> (anticorpos), linfócitos <b>T</b> (auxiliares e citotóxicos), células de memória. Demora dias na primeira vez, mas é específica e aprende.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Classifique</h3><div class="linha" id="bins" style="gap:10px;align-items:stretch"></div>';
    const b1 = bin(api, 'inata', '🛡️ Imunidade inata (inespecífica)'), b2 = bin(api, 'adapt', '🎯 Imunidade adaptativa (específica)'); q.querySelector('#bins').append(b1.cx, b2.cx);
    const itens = [['pele e mucosas', 'inata'], ['muco e cílios', 'inata'], ['fagócitos (macrófagos)', 'inata'], ['inflamação', 'inata'], ['febre', 'inata'], ['linfócitos B', 'adapt'], ['anticorpos', 'adapt'], ['linfócitos T', 'adapt'], ['células de memória', 'adapt']];
    const pal = api.el('div', 'paleta', '<div class="tit">Peças</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(itens).map(([n, t]) => { const p = ficha(api, n, t, t === 'inata' ? '#37474f' : '#37474f'); pal.appendChild(p); return p; });
    let n = 0; ligarBins(api, pecas, [b1.a, b2.a], (t, peca) => t === 'inata' ? `"${peca.textContent}" age contra qualquer invasor, sem reconhecer o antígeno: é inata.` : `"${peca.textContent}" reconhece um antígeno específico e cria memória: é adaptativa.`, () => { api.status(`${++n}/${itens.length}`); if (n === itens.length) api.concluirFase('Duas linhas de defesa organizadas'); });
  },
};
const chave = {
  titulo: 'Chave e fechadura', instrucao: 'Cada <b>anticorpo</b> reconhece um <b>antígeno</b> pelo formato. Arraste o anticorpo cujo encaixe combina com cada antígeno.',
  ajuda: '<p>Anticorpos (imunoglobulinas) têm uma região variável que se encaixa em um único antígeno (ou parte dele, o epítopo), como chave e fechadura. É por isso que a vacina contra sarampo não protege contra gripe, e por que o vírus da gripe muda de "formato" todo ano.</p>',
  async montar(api) {
    const formas = [['▲', 'tri'], ['●', 'cir'], ['■', 'qua'], ['★', 'est']];
    const q = api.quadro(); q.innerHTML = '<h3>Antígenos na superfície dos invasores</h3><div class="linha" id="ant" style="gap:16px"></div>';
    const alvos = formas.map(([s, t]) => { const cx = api.el('div', '', `<div style="text-align:center;font-size:30px">🦠<span style="font-size:18px;color:#ff8a80">${s}</span></div>`); const a = api.el('div', 'alvo', 'anticorpo?'); a.dataset.aceita = t; a.style.minWidth = '96px'; cx.appendChild(a); q.querySelector('#ant').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Anticorpos (Y) com sítio de ligação</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(formas).map(([s, t]) => { const p = ficha(api, `Y <span style="color:#7CFFB2">${s}</span>`, t, '#1f4a6e'); pal.appendChild(p); return p; });
    let n = 0; for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { if (a.dataset.aceita !== peca.dataset.tipo) { api.erro('Formato errado: o anticorpo só se liga ao antígeno complementar ao seu sítio de ligação (especificidade).'); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } api.encaixar(a, peca); api.estado.pontos += 8; api.status(`${++n}/4`); if (n === 4) api.concluirFase('Todos os antígenos neutralizados'); return true; } });
  },
};
const vacinaSoro = {
  titulo: 'Vacina ou soro?', instrucao: 'A <b>vacina</b> ensina o corpo a produzir os próprios anticorpos (lento, duradouro). O <b>soro</b> entrega anticorpos prontos (imediato, passageiro). Para cada situação, arraste o tratamento certo.',
  ajuda: '<p><b>Vacina</b> = imunização <b>ativa</b>: antígeno inofensivo, o corpo responde e forma memória; leva semanas; prevenção.<br><b>Soro</b> = imunização <b>passiva</b>: anticorpos prontos (de cavalo ou humanos); age na hora; dura semanas; tratamento de urgência (picada de cobra, tétano em ferido não vacinado, raiva após mordida).</p>',
  async montar(api) {
    const cen = [['Picada de jararaca há 20 minutos', 'soro'], ['Viagem para área de febre amarela daqui a 2 meses', 'vacina'], ['Mordida de cão com suspeita de raiva, hoje', 'soro'], ['Campanha infantil contra o sarampo', 'vacina'], ['Ferimento profundo em pessoa nunca vacinada contra tétano', 'soro']];
    const q = api.quadro(); q.innerHTML = '<h3>Situações</h3><div id="lista"></div>';
    const alvos = cen.map(([t, r]) => { const l = api.el('div', 'linha', `<span style="flex:1;min-width:200px;font-size:13.5px">${t}</span>`); l.style.cssText += 'justify-content:space-between;margin:6px 0;gap:10px'; const a = api.el('div', 'alvo', '?'); a.dataset.aceita = r; a.style.minWidth = '90px'; l.appendChild(a); q.querySelector('#lista').appendChild(l); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Tratamentos</div>'); api.tab.appendChild(pal);
    const pecas = [['💉 vacina', 'vacina', '#2e7d5b'], ['🧪 soro', 'soro', '#8e24aa']].map(([n, t, c]) => { const p = ficha(api, n, t, c); pal.appendChild(p); return p; });
    let n = 0; for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { if (a.dataset.aceita !== peca.dataset.tipo) { api.erro(peca.dataset.tipo === 'vacina' ? 'Vacina demora semanas para gerar anticorpos: numa urgência o veneno ou o vírus agem antes. Aqui é soro.' : 'Soro protege só por algumas semanas e não cria memória: para prevenir, o certo é vacina.'); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } api.encaixar(a, peca); api.estado.pontos += 8; api.status(`${++n}/${cen.length}`); if (n === cen.length) api.concluirFase('Vacina para prevenir, soro para socorrer'); return true; } });
  },
};
const memoria = {
  titulo: 'Memória imunológica', instrucao: 'Compare a resposta ao <b>primeiro</b> contato com um antígeno e ao <b>segundo</b>. Toque na curva certa para cada pergunta.',
  ajuda: '<p>Na <b>resposta primária</b> o corpo leva de 7 a 14 dias para produzir anticorpos, em pouca quantidade. Na <b>secundária</b>, as células de memória respondem em 1 a 3 dias, com muito mais anticorpos e por mais tempo. É isso que a vacina (e o reforço) aproveita.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = `<h3>Anticorpos no sangue ao longo do tempo</h3>
      <svg viewBox="0 0 420 180" style="width:100%;max-width:520px;background:rgba(255,255,255,.04);border-radius:12px"><line x1="30" y1="150" x2="410" y2="150" stroke="#9fb3d9"/><line x1="30" y1="150" x2="30" y2="15" stroke="#9fb3d9"/><text x="36" y="26" fill="#9fb3d9" font-size="11">anticorpos</text><text x="340" y="168" fill="#9fb3d9" font-size="11">tempo (dias)</text>
      <path id="c1" d="M40 150 L90 150 Q120 140 140 100 Q160 70 200 150" fill="none" stroke="#4fc3f7" stroke-width="4" style="cursor:pointer"/><text x="110" y="92" fill="#4fc3f7" font-size="12">1º contato</text><text x="60" y="166" fill="#fff" font-size="11">▲ antígeno</text>
      <path id="c2" d="M230 150 L245 150 Q255 120 270 40 Q300 20 400 120" fill="none" stroke="#FFD166" stroke-width="4" style="cursor:pointer"/><text x="300" y="36" fill="#FFD166" font-size="12">2º contato</text><text x="226" y="166" fill="#fff" font-size="11">▲ antígeno</text></svg>
      <div id="pg"></div>`;
    const perguntas = [['Qual resposta é mais rápida e intensa?', 'c2', 'A resposta secundária: células de memória já existem, então a produção é rápida e abundante.', 'Veja a altura e o tempo até subir: a curva amarela sobe em poucos dias e vai muito mais alto.'], ['Qual curva corresponde ao que a VACINA provoca na 1ª dose?', 'c1', 'A vacina é um primeiro contato controlado: resposta primária, que deixa memória para a próxima vez.', 'A vacina apresenta o antígeno pela primeira vez: resposta primária.'], ['Se a pessoa vacinada encontrar o vírus de verdade, qual curva ela terá?', 'c2', 'Graças à memória, a infecção real encontra uma resposta secundária e costuma nem causar doença.', 'Depois da vacina, o corpo já tem memória: o contato real é um "segundo contato".']];
    let i = 0; const pg = q.querySelector('#pg');
    const mostrar = () => { if (i >= perguntas.length) { pg.innerHTML = '<p style="color:#36D399;font-weight:800">Memória imunológica entendida.</p>'; api.concluirFase('Resposta primária × secundária'); return; } const [t, ok, exOk, exErr] = perguntas[i]; pg.innerHTML = `<p style="margin:10px 0 4px"><b>${i + 1}/${perguntas.length} · ${t}</b> <small style="color:#9fb3d9">(toque numa curva)</small></p>`; for (const id of ['c1', 'c2']) q.querySelector('#' + id).onclick = () => { if (id === ok) { api.acerto(exOk, 15); i++; setTimeout(mostrar, 900); } else api.erro(exErr); }; };
    mostrar();
  },
};
export const modulo = { fases: [linhas, chave, vacinaSoro, memoria], resumo: () => 'Você organizou as defesas inatas e adaptativas, aplicou a especificidade anticorpo-antígeno, decidiu entre vacina (ativa, preventiva, com memória) e soro (passiva, imediata, passageira) e leu as curvas de resposta primária e secundária.' };
