// Jardim de Mendel: gametas, quadro de Punnett, cruzamento-teste, heredograma e diibridismo.
const ficha = (api, n, t, cor = '#2a3b63') => { const p = api.el('div', 'peca', n); p.dataset.tipo = t; p.style.background = cor; p.style.fontSize = '14px'; return p; };
const slot = (api, aceita, rot) => { const a = api.el('div', 'alvo', rot); a.dataset.aceita = aceita; a.style.minWidth = '62px'; a.style.fontSize = '11px'; return a; };
function ligar(api, pecas, alvos, motivo, aoAcertar) {
  for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { const t = peca.dataset.tipo; if (!a.dataset.aceita.split('|').includes(t)) { api.erro(motivo(t, a)); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } api.encaixar(a, peca); api.estado.pontos += 6; aoAcertar(a, t); return true; } });
}
const cheios = alvos => alvos.filter(a => a.classList.contains('cheio')).length;
function pergunta(api, cont, texto, opcoes, certa, expOk, expErro, depois) {
  const d = api.el('div', '', `<p style="margin:12px 0 6px"><b>${texto}</b></p><div class="linha">${opcoes.map(o => `<button class="mjBt" data-o="${o}">${o}</button>`).join('')}</div>`); cont.appendChild(d);
  d.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.o === certa) { api.acerto(expOk, 15); d.querySelectorAll('button').forEach(x => x.disabled = true); depois && depois(); } else api.erro(expErro); });
}

const gametas = {
  titulo: 'Gametas', instrucao: 'Ervilha amarela <b>Aa</b> × ervilha amarela <b>Aa</b> (A = amarelo, dominante; a = verde). Na meiose cada alelo vai para um gameta diferente. Arraste os alelos para os gametas de cada genitor.',
  ajuda: '<p><b>1ª Lei de Mendel</b> (segregação): cada indivíduo tem dois alelos de cada gene, e eles se separam na formação dos gametas; cada gameta leva só um. Um heterozigoto Aa forma 50% de gametas A e 50% a.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Formação de gametas</h3><div class="linha" style="gap:24px"><div><div style="font-weight:800;margin-bottom:6px">♂ Aa → gametas</div><div class="linha" id="p1"></div></div><div><div style="font-weight:800;margin-bottom:6px">♀ Aa → gametas</div><div class="linha" id="p2"></div></div></div>';
    const alvos = []; for (const sel of ['#p1', '#p2']) for (const t of ['A', 'a']) { const a = slot(api, t, '?'); q.querySelector(sel).appendChild(a); alvos.push(a); }
    const pal = api.el('div', 'paleta', '<div class="tit">Alelos</div>'); api.tab.appendChild(pal);
    const pecas = [['A', 'A', '#f9a825'], ['a', 'a', '#43a047'], ['Aa', 'Aa', '#78909c']].map(([n, t, c]) => { const p = ficha(api, n, t, c); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, t => t === 'Aa' ? 'Um gameta leva UM alelo de cada gene, nunca os dois: a segregação separa A de a.' : 'Cada genitor Aa forma um gameta A e um gameta a. Falta o outro alelo.', () => { api.status(`${cheios(alvos)}/4`); if (cheios(alvos) === 4) api.concluirFase('Cada genitor forma gametas A e a (1:1)'); });
  },
};
const punnett = {
  titulo: 'Quadro de Punnett', instrucao: 'Combine os gametas: arraste o <b>genótipo</b> do descendente para cada célula do quadro. Depois responda as proporções.',
  ajuda: '<p>Cada célula do quadro junta o gameta da linha com o da coluna. Aa × Aa dá <b>1 AA : 2 Aa : 1 aa</b> (genótipos) e <b>3 amarelas : 1 verde</b> (fenótipos), porque AA e Aa são amarelas.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Aa × Aa</h3><table class="tb" style="width:auto"><tr><th></th><th>♀ A</th><th>♀ a</th></tr><tr><th>♂ A</th><td id="c1"></td><td id="c2"></td></tr><tr><th>♂ a</th><td id="c3"></td><td id="c4"></td></tr></table><div id="pg"></div>';
    const alvos = [['#c1', 'AA'], ['#c2', 'Aa'], ['#c3', 'Aa'], ['#c4', 'aa']].map(([s, t]) => { const a = slot(api, t, '?'); q.querySelector(s).appendChild(a); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Genótipos</div>'); api.tab.appendChild(pal);
    const pecas = [['AA', '#f9a825'], ['Aa', '#fbc02d'], ['aa', '#43a047']].map(([t, c]) => { const p = ficha(api, t, t, c); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, (t, a) => `Essa célula junta ${a.parentNode.parentNode.firstElementChild.textContent.replace('♂ ', '')} (linha) com ${['', '♀ A', '♀ a'][a.parentNode.cellIndex].replace('♀ ', '')} (coluna).`, () => {
      api.status(`${cheios(alvos)}/4`); if (cheios(alvos) < 4) return;
      const pg = q.querySelector('#pg');
      pergunta(api, pg, 'Proporção de FENÓTIPOS (amarelas : verdes)?', ['1:1', '3:1', '1:2:1', '9:3:3:1'], '3:1', 'AA e Aa são amarelas (3), aa é verde (1).', 'Conte no quadro: quantas células têm pelo menos um A?', () => {
        pergunta(api, pg, 'Proporção de GENÓTIPOS (AA : Aa : aa)?', ['1:1', '3:1', '1:2:1', '2:1:1'], '1:2:1', 'Uma célula AA, duas Aa, uma aa.', 'Olhe as quatro células: Aa aparece duas vezes.', () => api.concluirFase('Quadro completo: 3:1 e 1:2:1'));
      });
    });
  },
};
const teste = {
  titulo: 'Cruzamento-teste', instrucao: 'Uma ervilha amarela pode ser AA ou Aa. Para descobrir, cruza-se com uma <b>verde (aa)</b>. Analise os resultados.',
  ajuda: '<p>No <b>cruzamento-teste</b> usa-se o homozigoto recessivo (aa), que só dá gametas a. Se o desconhecido for AA, todos os filhos são Aa (amarelos). Se for Aa, metade Aa (amarela) e metade aa (verde).</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Qual é o genótipo da planta amarela?</h3><div id="pg"></div>';
    const pg = q.querySelector('#pg');
    pergunta(api, pg, 'Cruzamento 1: amarela × verde → 50% amarelas e 50% verdes. Genótipo da amarela?', ['AA', 'Aa', 'aa'], 'Aa', 'Só o heterozigoto Aa forma gametas a, que com o a da verde dão filhos verdes.', 'Apareceram filhos verdes (aa): de onde veio o segundo a?', () => {
      pergunta(api, pg, 'Cruzamento 2: outra amarela × verde → 100% amarelas (80 plantas). Genótipo mais provável?', ['AA', 'Aa', 'aa'], 'AA', 'Com 80 filhos todos amarelos, a planta só produz gametas A: homozigota AA.', 'Se fosse Aa, esperaríamos metade verde. Nenhuma verde em 80 filhos...', () => api.concluirFase('Cruzamento-teste dominado'));
    });
  },
};
const heredograma = {
  titulo: 'Heredograma', instrucao: 'Uma característica <b>recessiva</b> (aa) aparece na filha II-1, mas não nos pais. Arraste o genótipo possível de cada pessoa. Use <b>A_</b> quando não dá para saber se é AA ou Aa.',
  ajuda: '<p>Regra de ouro: se dois pais normais têm um filho afetado por característica recessiva, <b>os dois pais são heterozigotos (Aa)</b>. Filhos normais desse casal podem ser AA ou Aa (A_): só outro cruzamento revelaria.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = `<h3>Família</h3><div class="linha" style="justify-content:center;gap:28px"><div style="text-align:center">◻ I-1 (pai, normal)<br><div id="i1"></div></div><div style="text-align:center">◯ I-2 (mãe, normal)<br><div id="i2"></div></div></div>
      <div style="text-align:center;color:#9fb3d9;margin:6px">│</div>
      <div class="linha" style="justify-content:center;gap:18px"><div style="text-align:center">⬤ II-1 (filha, <b style="color:#ff8a80">afetada</b>)<br><div id="ii1"></div></div><div style="text-align:center">◻ II-2 (filho, normal)<br><div id="ii2"></div></div><div style="text-align:center">◯ II-3 (filha, normal)<br><div id="ii3"></div></div></div>`;
    const alvos = [['#i1', 'Aa'], ['#i2', 'Aa'], ['#ii1', 'aa'], ['#ii2', 'A_'], ['#ii3', 'A_']].map(([s, t]) => { const a = slot(api, t, '?'); a.style.margin = '4px auto 0'; q.querySelector(s).appendChild(a); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Genótipos</div>'); api.tab.appendChild(pal);
    const pecas = [['AA', '#f9a825'], ['Aa', '#fbc02d'], ['aa', '#43a047'], ['A_', '#78909c']].map(([t, c]) => { const p = ficha(api, t, t, c); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, (t, a) => { const esp = a.dataset.aceita; if (esp === 'Aa') return t === 'AA' ? 'Se esse genitor fosse AA, não poderia ter uma filha aa: ela recebeu um a de cada pai.' : t === 'aa' ? 'Pessoa normal não pode ser aa (a característica é recessiva).' : 'Sabemos com certeza: cada genitor passou um a para a filha afetada, logo é Aa.'; if (esp === 'aa') return 'Afetada por característica recessiva é obrigatoriamente aa.'; return t === 'aa' ? 'Normal não pode ser aa.' : 'Esse filho normal pode ser AA ou Aa: não dá para saber só pelo heredograma. Use A_.'; }, () => { api.status(`${cheios(alvos)}/5`); if (cheios(alvos) === 5) api.concluirFase('Heredograma resolvido'); });
  },
};
const dihibrido = {
  titulo: 'Diibridismo', instrucao: 'Agora dois genes: <b>AaBb</b> (amarela e lisa). Pela 2ª Lei, os pares segregam de forma independente. Arraste os 4 tipos de gameta que essa planta forma.',
  ajuda: '<p><b>2ª Lei de Mendel</b>: genes em cromossomos diferentes se distribuem independentemente. AaBb forma <b>AB, Ab, aB, ab</b> (1:1:1:1). AaBb × AaBb dá a clássica proporção <b>9:3:3:1</b>.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Gametas de AaBb</h3><div class="linha" id="g"></div><div id="pg"></div>';
    const alvos = ['AB', 'Ab', 'aB', 'ab'].map(t => { const a = slot(api, 'AB|Ab|aB|ab', '?'); q.querySelector('#g').appendChild(a); return a; });
    const usados = new Set();
    const pal = api.el('div', 'paleta', '<div class="tit">Combinações</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(['AB', 'Ab', 'aB', 'ab', 'AA', 'Bb', 'aa', 'Aa']).map(t => { const p = ficha(api, t, t, /^[Aa][Bb]$/.test(t) ? '#5c6bc0' : '#78909c'); pal.appendChild(p); return p; });
    for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { const t = peca.dataset.tipo; if (!/^[Aa][Bb]$/.test(t)) { api.erro('Um gameta leva UM alelo de CADA gene: uma letra do par A/a e uma do par B/b.'); return false; } if (usados.has(t)) { api.erro('Esse gameta já está na lista.'); return false; } usados.add(t); api.encaixar(a, peca); api.estado.pontos += 6; api.status(`${usados.size}/4`); if (usados.size === 4) pergunta(api, q.querySelector('#pg'), 'AaBb × AaBb: proporção fenotípica?', ['3:1', '1:1:1:1', '9:3:3:1', '1:2:1'], '9:3:3:1', '9 amarelas lisas : 3 amarelas rugosas : 3 verdes lisas : 1 verde rugosa.', '3:1 de cada gene, combinados de forma independente: (3:1) × (3:1).', () => api.concluirFase('Segregação independente dominada')); return true; } });
  },
};
export const modulo = { fases: [gametas, punnett, teste, heredograma, dihibrido], resumo: () => 'Você formou gametas pela segregação, montou o quadro de Punnett (3:1 e 1:2:1), usou o cruzamento-teste para descobrir genótipos, resolveu um heredograma de herança recessiva e aplicou a 2ª Lei (gametas AB, Ab, aB, ab e 9:3:3:1).' };
