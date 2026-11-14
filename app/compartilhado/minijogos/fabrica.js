// Fábrica de Proteínas: transcrição (DNA → RNA), processamento (splicing, cap e cauda) e tradução (códon a códon).
const COMP_DNA_RNA = { A: 'U', T: 'A', C: 'G', G: 'C' };
const COMP_RNA = { A: 'U', U: 'A', C: 'G', G: 'C' };
const COR = { A: '#4fc3f7', U: '#ffb74d', T: '#ff8a80', C: '#aed581', G: '#ce93d8' };
// gene curto: Met-Phe-Gly-Lys-STOP
const RNA = ['AUG', 'UUU', 'GGC', 'AAA', 'UAG'];
const DNA_MOLDE = RNA.map(c => [...c].map(b => ({ U: 'A', A: 'T', G: 'C', C: 'G' })[b]).join(''));   // TAC AAA CCG TTT ATC
const AA = { AUG: 'Met', UUU: 'Phe', GGC: 'Gly', AAA: 'Lys', UAG: 'STOP', UUC: 'Phe', GGU: 'Gly', AAG: 'Lys', CCG: 'Pro', UAC: 'Tyr', ACC: 'Thr', GAA: 'Glu', CUU: 'Leu' };
const anticodon = c => [...c].map(b => COMP_RNA[b]).join('');
const base = (b, extra = '') => `<span class="peca" style="background:${COR[b]};color:#111;min-width:40px;height:40px;cursor:default;${extra}">${b}</span>`;

const transcricao = {
  titulo: 'Transcrição', instrucao: 'A RNA polimerase lê a fita <b>molde</b> do DNA (3\'→5\') e monta o RNA mensageiro (5\'→3\'). Arraste o nucleotídeo de RNA que pareia com cada base, <b>na ordem</b>.',
  ajuda: `<h3>Pareamento na transcrição</h3><table class="tb"><tr><th>DNA molde</th><th>RNA</th></tr><tr><td>A</td><td>U</td></tr><tr><td>T</td><td>A</td></tr><tr><td>C</td><td>G</td></tr><tr><td>G</td><td>C</td></tr></table><p>No RNA não existe timina (T): no lugar dela entra a <b>uracila (U)</b>. A polimerase avança numa só direção, por isso você preenche base a base.</p>`,
  async montar(api) {
    const { el, arrastavel, encaixar } = api;
    const q = api.quadro(); q.innerHTML = `<h3>Fita molde do DNA (3' → 5')</h3><div class="linha" id="fitaDna"></div><h3 style="margin-top:12px">RNA mensageiro (5' → 3')</h3><div class="linha" id="fitaRna"></div>`;
    const dna = q.querySelector('#fitaDna'), rna = q.querySelector('#fitaRna');
    const bases = DNA_MOLDE.join('').split(''); const alvos = [];
    bases.forEach((b, i) => {
      if (i && i % 3 === 0) { dna.appendChild(el('span', '', '&nbsp;')); rna.appendChild(el('span', '', '&nbsp;')); }
      dna.insertAdjacentHTML('beforeend', base(b));
      const a = el('div', 'alvo'); a.dataset.i = i; a.dataset.b = b; a.textContent = '?'; rna.appendChild(a); alvos.push(a);
    });
    let prox = 0; const marcar = () => alvos.forEach((a, i) => { a.style.opacity = i === prox ? 1 : i < prox ? 1 : .45; a.classList.toggle('pulso', i === prox); });
    marcar();
    const pal = el('div', 'paleta', '<div class="tit">Nucleotídeos de RNA (arraste)</div>'); api.tab.appendChild(pal);
    for (const b of ['A', 'U', 'C', 'G', 'T']) {
      const p = el('div', 'peca', b); p.style.background = COR[b]; p.style.color = '#111'; pal.appendChild(p);
      arrastavel(p, {
        alvos, clonar: true,
        aoSoltar(a, peca) {
          const i = +a.dataset.i;
          if (i !== prox) { api.erro(`A polimerase avança na ordem: a próxima base é a ${prox + 1}ª.`); a.classList.add('errado'); return false; }
          if (b === 'T') { api.erro('O RNA não tem timina (T). No lugar dela entra a uracila (U).'); a.classList.add('errado'); return false; }
          if (COMP_DNA_RNA[a.dataset.b] !== b) { api.erro(`${a.dataset.b} do DNA pareia com ${COMP_DNA_RNA[a.dataset.b]} no RNA, não com ${b}.`); a.classList.add('errado'); return false; }
          encaixar(a, peca); prox++; marcar();
          if (prox % 3 === 0) api.acerto(`Códon ${prox / 3} transcrito: ${RNA[prox / 3 - 1]}`, 8); else api.estado.pontos += 2;
          api.status(`${prox}/${bases.length} nucleotídeos`);
          if (prox === bases.length) api.concluirFase('RNA mensageiro transcrito: ' + RNA.join(' '));
          return true;
        },
      });
    }
  },
};

const processamento = {
  titulo: 'Processamento do RNA', instrucao: 'Nos eucariontes o pré-RNA é editado antes de sair do núcleo: <b>corte os íntrons</b> (toque neles), una os éxons e coloque o <b>cap 5\'</b> e a <b>cauda poli-A</b> nas pontas.',
  ajuda: `<p><b>Éxons</b> são as partes que ficam e codificam a proteína; <b>íntrons</b> são removidos (splicing). O <b>cap 5'</b> (7-metilguanosina) protege a ponta inicial e ajuda o ribossomo a reconhecer o RNA; a <b>cauda poli-A</b> (muitas adeninas) protege a ponta 3'. Sem esse processamento o RNA seria degradado e a proteína sairia errada.</p>`,
  async montar(api) {
    const { el, arrastavel, encaixar } = api;
    const q = api.quadro(); q.innerHTML = `<h3>Pré-RNA mensageiro</h3><div class="linha" id="pre"></div><div id="acoes" style="margin-top:10px"></div>`;
    const pre = q.querySelector('#pre');
    const capA = el('div', 'alvo', "5'"); capA.dataset.tipo = 'cap'; pre.appendChild(capA);
    const segs = [['E1', 'exon'], ['Íntron 1', 'intron'], ['E2', 'exon'], ['Íntron 2', 'intron'], ['E3', 'exon']];
    const blocos = segs.map(([n, t]) => { const b = el('div', 'peca', n); b.dataset.tipo = t; b.style.cursor = 'pointer'; b.style.background = t === 'exon' ? '#2e7d5b' : '#5c4a7a'; b.style.minWidth = t === 'exon' ? '58px' : '74px'; b.style.fontSize = '13px'; pre.appendChild(b); return b; });
    const caudaA = el('div', 'alvo', "3'"); caudaA.dataset.tipo = 'cauda'; pre.appendChild(caudaA);
    let cortados = 0, unido = false, cap = false, cauda = false;
    const checa = () => { api.status(`Íntrons cortados ${cortados}/2 · éxons ${unido ? 'unidos' : 'separados'} · cap ${cap ? '✓' : '–'} · cauda ${cauda ? '✓' : '–'}`); if (cortados === 2 && unido && cap && cauda) api.concluirFase('RNA maduro pronto para sair do núcleo'); };
    blocos.forEach(b => b.onclick = () => {
      if (b.dataset.tipo === 'exon') { api.erro('Esse é um éxon: ele codifica a proteína e fica no RNA. Corte só os íntrons.'); b.classList.add('errado'); setTimeout(() => b.classList.remove('errado'), 500); return; }
      if (b.dataset.cortado) return;
      b.dataset.cortado = '1'; b.style.opacity = .25; b.style.textDecoration = 'line-through'; cortados++; api.acerto('Íntron removido', 10);
      if (cortados === 2) { const bt = el('button', 'mjBt ouro', '🧵 Unir os éxons (splicing)'); q.querySelector('#acoes').appendChild(bt); bt.onclick = () => { blocos.filter(x => x.dataset.cortado).forEach(x => x.remove()); unido = true; bt.remove(); api.acerto('Éxons unidos: E1-E2-E3', 12); checa(); }; }
      checa();
    });
    const pal = el('div', 'paleta', '<div class="tit">Modificações das pontas (arraste)</div>'); api.tab.appendChild(pal);
    const pecas = [['Cap 5\'', 'cap', '#f9a825'], ['Cauda poli-A (AAAA…)', 'cauda', '#f06292'], ['Cauda poli-U (UUUU…)', 'poliU', '#90a4ae'], ['Íntron', 'intronExtra', '#5c4a7a']];
    for (const [nome, tipo, cor] of pecas) {
      const p = el('div', 'peca', nome); p.style.background = cor; p.style.fontSize = '12px'; p.style.color = tipo === 'cap' ? '#111' : '#fff'; pal.appendChild(p);
      arrastavel(p, {
        alvos: [capA, caudaA], clonar: true,
        aoSoltar(a, peca) {
          if (tipo === 'poliU') { api.erro('A cauda é de adeninas (poli-A), não de uracilas.'); a.classList.add('errado'); return false; }
          if (tipo === 'intronExtra') { api.erro('Íntrons são removidos, não adicionados.'); a.classList.add('errado'); return false; }
          if (a.dataset.tipo !== tipo) { api.erro(tipo === 'cap' ? "O cap vai na ponta 5', o início do RNA." : "A cauda poli-A vai na ponta 3', o fim do RNA."); a.classList.add('errado'); return false; }
          encaixar(a, peca); if (tipo === 'cap') cap = true; else cauda = true; api.acerto(tipo === 'cap' ? "Cap 5' colocado" : 'Cauda poli-A colocada', 10); checa(); return true;
        },
      });
    }
    checa();
  },
};

const traducao = {
  titulo: 'Tradução', instrucao: 'No ribossomo, cada códon do RNA mensageiro recebe o <b>RNA transportador</b> com o anticódon complementar, que traz o aminoácido. Arraste o tRNA certo para o <b>sítio A</b>. No códon de parada, chame o <b>fator de liberação</b>.',
  ajuda: `<h3>Códons deste gene</h3><table class="tb"><tr><th>Códon (mRNA)</th><th>Anticódon (tRNA)</th><th>Aminoácido</th></tr>${RNA.map(c => `<tr><td>${c}</td><td>${c === 'UAG' ? '—' : anticodon(c)}</td><td>${AA[c]}</td></tr>`).join('')}</table><p>O anticódon é <b>complementar</b> ao códon (A–U, G–C), não igual a ele. AUG é o códon de início (metionina). UAA, UAG e UGA são códons de parada: nenhum tRNA os reconhece; um fator de liberação solta a proteína.</p>`,
  async montar(api) {
    const { el, arrastavel, encaixar, embaralhar } = api;
    const q = api.quadro(); q.innerHTML = `<h3>Ribossomo</h3>
      <div class="linha" id="mrna" style="margin-bottom:8px"></div>
      <div class="linha" style="gap:14px;align-items:flex-end"><div><div style="font-size:11px;color:#9fb3d9;text-align:center">sítio P</div><div class="alvo" id="sitioP" style="min-width:92px;height:62px"></div></div><div><div style="font-size:11px;color:#FFD166;text-align:center;font-weight:800">sítio A</div><div class="alvo pulso" id="sitioA" style="min-width:92px;height:62px"></div></div></div>
      <h3 style="margin-top:12px">Cadeia polipeptídica</h3><div class="linha" id="cadeia"><span style="color:#9fb3d9;font-size:13px">(vazia)</span></div>`;
    const mrna = q.querySelector('#mrna'), sitioP = q.querySelector('#sitioP'), sitioA = q.querySelector('#sitioA'), cadeia = q.querySelector('#cadeia');
    const pal = el('div', 'paleta', '<div class="tit">tRNAs disponíveis</div><div class="linha" id="opcoes"></div>'); api.tab.appendChild(pal);
    const opcoes = pal.querySelector('#opcoes');
    let i = 0; const peptideo = [];
    const desenharRna = () => { mrna.innerHTML = RNA.map((c, k) => `<span class="peca" style="cursor:default;min-width:60px;background:${k === i ? '#FFD166' : k < i ? '#2e7d5b' : '#2a3b63'};color:${k === i ? '#111' : '#fff'}">${c}</span>`).join(''); };
    const cartaoT = (ac, aa, extra = {}) => { const p = el('div', 'peca', `<div style="text-align:center;line-height:1.1"><div>${ac}</div><small>${aa}</small></div>`); p.style.height = '58px'; p.style.minWidth = '84px'; p.style.background = extra.cor || '#1f4a6e'; Object.assign(p.dataset, extra.dados || {}); return p; };
    const passo = () => {
      desenharRna(); opcoes.innerHTML = ''; sitioA.innerHTML = ''; sitioA.classList.remove('cheio');
      const codon = RNA[i];
      if (codon === 'UAG') {
        const certos = [cartaoT('fator de liberação', 'termina', { cor: '#8E7CFF', dados: { ok: '1' } })];
        const errados = [cartaoT('AUC', 'Ile?', { dados: { msg: 'Nenhum tRNA reconhece UAG: é um códon de parada. Quem entra é o fator de liberação.' } }), cartaoT('UAG', 'Tyr?', { dados: { msg: 'Esse anticódon é igual ao códon; teria de ser complementar. E UAG é parada: ninguém traz aminoácido.' } })];
        embaralhar([...certos, ...errados]).forEach(c => opcoes.appendChild(c));
      } else {
        const ac = anticodon(codon);
        const certo = cartaoT(ac, AA[codon], { dados: { ok: '1' } });
        const igual = cartaoT(codon, AA[anticodon(codon)] || '?', { dados: { msg: `Anticódon igual ao códon não pareia. O complementar de ${codon} é ${ac}.` } });
        const outro = (() => { const alt = Object.keys(AA).filter(c => c !== codon && c !== 'UAG' && anticodon(c) !== codon)[(i * 7 + 3) % 9]; return cartaoT(anticodon(alt), AA[alt], { dados: { msg: `${anticodon(alt)} pareia com ${alt}, não com ${codon}.` } }); })();
        embaralhar([certo, igual, outro]).forEach(c => opcoes.appendChild(c));
      }
      for (const c of opcoes.children) arrastavel(c, {
        alvos: [sitioA, sitioP],
        aoSoltar(a, peca) {
          if (a === sitioP) { api.erro('O tRNA novo entra pelo sítio A; o sítio P segura a cadeia em crescimento.'); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
          if (!peca.dataset.ok) { api.erro(peca.dataset.msg); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
          encaixar(a, peca);
          if (codon === 'UAG') { api.acerto('Fator de liberação: a proteína é solta!', 20); sitioA.classList.remove('pulso'); setTimeout(() => api.concluirFase(`Peptídeo pronto: ${peptideo.join('–')}`), 500); return true; }
          peptideo.push(AA[codon]); cadeia.innerHTML = peptideo.map((a, k) => `<span class="peca" style="cursor:default;background:hsl(${(k * 67) % 360},55%,45%);min-width:52px;font-size:13px">${a}</span>${k < peptideo.length - 1 ? '<span style="opacity:.6">–</span>' : ''}`).join('');
          api.acerto(`${AA[codon]} adicionado${peptideo.length > 1 ? ' (ligação peptídica)' : ' (início: metionina)'}`, 12);
          setTimeout(() => { sitioP.innerHTML = `<span style="font-size:12px">${anticodon(codon)}<br><small>${AA[codon]}</small></span>`; sitioP.classList.add('cheio'); i++; passo(); }, 650);
          return true;
        },
      });
      api.status(`Códon ${i + 1}/${RNA.length}: ${codon}`);
    };
    passo();
  },
};

export const modulo = {
  fases: [transcricao, processamento, traducao],
  resumo: () => `Você fez o caminho inteiro da informação genética: o DNA foi transcrito em RNA (${RNA.join(' ')}), o RNA foi processado e traduzido em ${RNA.slice(0, -1).map(c => AA[c]).join('–')}. É exatamente isso que o ENEM cobra: direção 5'→3', U no lugar de T, anticódon complementar e códon de parada sem aminoácido.`,
};
