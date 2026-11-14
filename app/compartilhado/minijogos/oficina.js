// Oficina da Divisão Celular: o aluno duplica, alinha e separa cromossomos; faz mitose e meiose completas
// e vê a variabilidade (crossing-over e segregação independente) nos gametas.
const CSS = `
#mj .celula { position: relative; border: 3px solid rgba(255,255,255,.35); border-radius: 46% / 40%; background: radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.08), rgba(255,255,255,.02)); padding: 8px; margin: 6px 0; }
#mj .zona { min-height: 64px; border-radius: 14px; border: 2px dashed rgba(255,255,255,.18); display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; padding: 6px; margin: 4px 0; position: relative; }
#mj .zona.placa { border-color: rgba(255,209,102,.6); background: rgba(255,209,102,.07); }
#mj .zona .rot { position: absolute; left: 8px; top: 2px; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.5); font-weight: 800; }
#mj .zona.sobre { background: rgba(255,209,102,.18); }
#mj .crom { display: inline-flex; gap: 3px; align-items: center; padding: 4px; border-radius: 10px; cursor: grab; background: rgba(0,0,0,.25); border: 2px solid transparent; position: relative; }
#mj .crom.sel { border-color: #FFD166; }
#mj .crom.arrastando { position: fixed; z-index: 50; pointer-events: none; }
#mj .ctd { width: 16px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; font-size: 9px; font-weight: 900; color: #fff; padding: 3px 0; text-shadow: 0 1px 1px #000; }
#mj .ctd.p { background: linear-gradient(#64b5f6, #1e88e5); } #mj .ctd.m { background: linear-gradient(#ef9a9a, #e53935); }
#mj .ctd .cen { width: 10px; height: 10px; border-radius: 50%; background: #0b1424; border: 2px solid #fff; }
#mj .tetrade { display: inline-flex; gap: 6px; padding: 6px; border-radius: 12px; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.25); cursor: grab; position: relative; }
#mj .tetrade .flip { position: absolute; right: -8px; top: -10px; font-size: 11px; background: #FFD166; color: #111; border-radius: 999px; padding: 2px 6px; font-weight: 900; cursor: pointer; }
#mj .contador { display: flex; gap: 6px; flex-wrap: wrap; font-size: 12px; margin: 6px 0; } #mj .contador span { background: rgba(255,255,255,.1); border-radius: 999px; padding: 3px 9px; font-weight: 800; }
#mj .gametas { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
#mj .gameta { border: 2px solid rgba(255,255,255,.3); border-radius: 40% / 36%; padding: 8px; text-align: center; }
`;
let css = false; const garantir = () => { if (!css) { css = true; const s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); } };

// genes: par 1 (longo) carrega A e D; par 2 (curto) carrega B. Origem p = paterno (azul), m = materno (vermelho).
const ORIGINAIS = [
  { par: 1, origem: 'p', alelos: ['A', 'D'] }, { par: 1, origem: 'm', alelos: ['a', 'd'] },
  { par: 2, origem: 'p', alelos: ['B'] }, { par: 2, origem: 'm', alelos: ['b'] },
];
let uid = 0;
function novoCrom(api, dados) {
  // dados: { par, origem, cromatides: [ {alelos, origem} , ... ] }
  const c = api.el('div', 'crom'); c.dataset.id = dados.id || ('c' + (++uid)); c.dataset.par = dados.par; c.dataset.origem = dados.origem; c._d = dados;
  const alt = dados.par === 1 ? 64 : 44;
  c.innerHTML = dados.cromatides.map(k => `<div class="ctd ${k.origem}" style="height:${alt}px" title="${k.alelos.join(' ')}"><span>${k.alelos[0]}</span><span class="cen"></span><span>${k.alelos[1] || ''}</span></div>`).join('');
  return c;
}
const contagem = (api, alvo, croms) => { const nC = croms.length, nK = croms.reduce((s, c) => s + c._d.cromatides.length, 0); alvo.innerHTML = `<span>cromossomos: ${nC}</span><span>cromátides: ${nK}</span><span>DNA: ${nK}C</span>`; };
const genotipo = ks => ks.map(k => k.alelos.join('')).join(' ');

function celula(api, { id, titulo, placa = true }) {
  const c = api.el('div', 'celula'); c.id = id;
  c.innerHTML = `<div style="font-size:12px;color:#9fb3d9;font-weight:800;margin:0 0 2px 8px">${titulo || ''}</div><div class="zona" data-z="cima"><span class="rot">polo ↑</span></div>${placa ? '<div class="zona placa" data-z="placa"><span class="rot">placa equatorial</span></div>' : ''}<div class="zona" data-z="baixo"><span class="rot">polo ↓</span></div>`;
  const z = n => c.querySelector(`[data-z="${n}"]`);
  return { el: c, cima: z('cima'), placa: z('placa'), baixo: z('baixo'), zonas: () => [z('cima'), z('placa'), z('baixo')].filter(Boolean) };
}
// arrasta cromossomos entre zonas de uma célula (zonas aceitam vários)
function moverEntreZonas(api, croms, zonas, aoMover) {
  zonas.forEach(z => z.dataset.multi = '1');
  for (const c of croms) api.arrastavel(c, { alvos: zonas, aoSoltar(z, peca) { const ok = aoMover(z, peca); if (ok === false) return false; z.appendChild(peca); peca.classList.remove('arrastando'); peca.style.cssText = ''; return true; } });
}

// ---------- fases comuns ----------
const interfase = modo => ({
  titulo: 'Interfase (fase S)', instrucao: `A célula-mãe é diploide: <b>2n = 4</b> (dois pares de homólogos; azul = paterno, vermelho = materno). Antes de dividir, ela <b>duplica o DNA</b>. Toque no botão e responda.`,
  ajuda: `<p>Na fase S cada cromossomo é copiado e passa a ter <b>duas cromátides-irmãs</b> unidas pelo centrômero. O número de cromossomos <b>não muda</b> (conta-se pelo centrômero): continua 2n = 4, mas a quantidade de DNA dobra (2C → 4C).</p>`,
  async montar(api) {
    garantir(); const { el } = api;
    const q = api.quadro(); q.innerHTML = `<h3>Célula-mãe · ${modo === 'mitose' ? 'vai fazer MITOSE' : 'vai fazer MEIOSE'}</h3><div class="contador" id="cont"></div><div class="linha" id="nuc" style="justify-content:center;padding:10px;border:3px solid rgba(255,255,255,.35);border-radius:46%/40%"></div><div style="margin-top:10px" id="acao"></div>`;
    const nuc = q.querySelector('#nuc');
    const croms = ORIGINAIS.map(o => novoCrom(api, { par: o.par, origem: o.origem, cromatides: [{ alelos: o.alelos, origem: o.origem }] }));
    croms.forEach(c => { c.style.cursor = 'default'; nuc.appendChild(c); }); contagem(api, q.querySelector('#cont'), croms);
    const bt = el('button', 'mjBt ouro', '🧬 Duplicar o DNA'); q.querySelector('#acao').appendChild(bt);
    bt.onclick = () => {
      bt.remove(); croms.forEach(c => { c._d.cromatides = [{ ...c._d.cromatides[0], alelos: [...c._d.cromatides[0].alelos] }, { ...c._d.cromatides[0], alelos: [...c._d.cromatides[0].alelos] }]; c.replaceWith(Object.assign(novoCrom(api, c._d), { style: 'cursor:default' })); });
      const novos = [...nuc.querySelectorAll('.crom')]; contagem(api, q.querySelector('#cont'), novos);
      api.acerto('DNA duplicado: cada cromossomo agora tem duas cromátides-irmãs', 10);
      const pg = el('div', '', `<b>Quantos cromossomos a célula tem agora?</b><div class="linha" style="margin-top:6px">${[2, 4, 8].map(n => `<button class="mjBt" data-n="${n}">${n}</button>`).join('')}</div>`); q.querySelector('#acao').appendChild(pg);
      pg.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.n === '4') { api.acerto('Continua 2n = 4: cromossomo se conta pelo centrômero. O que dobrou foi o DNA (4C).', 15); api.estado.croms = novos.map(c => c._d); api.concluirFase(); } else api.erro(b.dataset.n === '8' ? 'Cromátides-irmãs unidas contam como UM cromossomo.' : 'Nada foi perdido: a célula ainda tem os 4 cromossomos.'); });
    };
  },
});

function faseMetafase(opts) {
  return {
    titulo: opts.titulo, instrucao: opts.instrucao, ajuda: opts.ajuda,
    async montar(api) {
      garantir();
      const cel = celula(api, { id: 'cel', titulo: opts.rotulo }); api.tab.appendChild(cel.el);
      const itens = opts.itens(api);   // elementos arrastáveis
      itens.forEach((c, k) => (k % 2 ? cel.cima : cel.baixo).appendChild(c));
      const cont = api.el('div', 'contador'); api.tab.prepend(cont); if (opts.contar) opts.contar(api, cont);
      moverEntreZonas(api, itens, cel.zonas(), (z, peca) => {
        if (z !== cel.placa) { api.erro('Na metáfase todos se alinham na placa equatorial, presos às fibras do fuso.'); return false; }
        setTimeout(() => { if ([...cel.placa.children].filter(x => itens.includes(x)).length === itens.length) { api.estado.cel = cel; api.estado.itens = itens; api.concluirFase(opts.fim); } else api.status(`${[...cel.placa.children].filter(x => itens.includes(x)).length}/${itens.length} na placa`); }, 0);
        return true;
      });
      if (opts.extras) opts.extras(api, cel, itens);
      api.status(`0/${itens.length} na placa`);
    },
  };
}

function faseAnafase(opts) {
  // separa: toque no item da placa para dividi-lo em duas partes; arraste cada parte para um polo
  return {
    titulo: opts.titulo, instrucao: opts.instrucao, ajuda: opts.ajuda,
    async montar(api) {
      garantir();
      const cel = celula(api, { id: 'cel', titulo: opts.rotulo }); api.tab.appendChild(cel.el);
      const itens = opts.itens(api); itens.forEach(c => cel.placa.appendChild(c));
      api.tab.prepend(api.el('div', '', `<p style="font-size:13px;color:#cdd8f0;margin:0 0 6px">Toque em cada ${opts.nomeItem} para separá-lo; depois arraste as partes para polos <b>opostos</b>.</p>`));
      const partes = []; let colocadas = 0; const total = itens.length * 2;
      const ligar = (p, irmao) => api.arrastavel(p, {
        alvos: [cel.cima, cel.baixo].map(z => (z.dataset.multi = '1', z)),
        aoSoltar(z, peca) {
          const outro = irmao(); const zonaOutro = outro && outro.parentNode && outro.parentNode.dataset.z;
          if (zonaOutro && zonaOutro !== 'placa' && zonaOutro === z.dataset.z) { api.erro(opts.erroMesmoPolo); return false; }
          const antes = peca.dataset.zOrigem;
          z.appendChild(peca); peca.classList.remove('arrastando'); peca.style.cssText = '';
          if (antes === 'placa') { colocadas++; api.estado.pontos += 5; }
          api.status(`${colocadas}/${total} nos polos`);
          if (colocadas === total) { api.estado.cel = cel; api.estado.polos = { cima: [...cel.cima.querySelectorAll('.crom')].map(c => c._d), baixo: [...cel.baixo.querySelectorAll('.crom')].map(c => c._d) }; api.concluirFase(opts.fim); }
          return true;
        },
      });
      for (const it of itens) {
        it.style.cursor = 'pointer';
        const dividirAgora = () => {
          if (it.dataset.dividido) return; it.dataset.dividido = '1';
          const [a, b] = opts.dividir(api, it); a.dataset.par2 = b.dataset.id; b.dataset.par2 = a.dataset.id; partes.push(a, b);
          it.replaceWith(a); a.after(b); ligar(a, () => b); ligar(b, () => a); api.info(opts.msgDividiu);
        };
        it.addEventListener('tap', dividirAgora); it.addEventListener('click', dividirAgora);
      }
    },
  };
}

// ---------- MITOSE ----------
const mitose = [
  interfase('mitose'),
  faseMetafase({
    titulo: 'Metáfase', instrucao: 'Os cromossomos duplicados se prendem às fibras do fuso e se alinham no centro. <b>Arraste os 4 cromossomos para a placa equatorial.</b>', rotulo: 'Célula-mãe (2n = 4)',
    ajuda: '<p>Na mitose os cromossomos se alinham <b>um a um</b> na placa (não em pares), cada um com suas duas cromátides voltadas para polos opostos.</p>',
    itens: api => api.estado.croms.map(d => novoCrom(api, { ...d, cromatides: d.cromatides.map(k => ({ ...k, alelos: [...k.alelos] })) })), contar: (api, cont) => contagem(api, cont, api.estado.croms.map(d => ({ _d: d }))), fim: 'Todos alinhados: metáfase completa',
  }),
  faseAnafase({
    titulo: 'Anáfase', instrucao: 'Os centrômeros se dividem e as <b>cromátides-irmãs</b> se separam, uma para cada polo.', rotulo: 'Célula-mãe', nomeItem: 'cromossomo',
    ajuda: '<p>Na anáfase da mitose separam-se <b>cromátides-irmãs</b> (cópias idênticas). Cada polo recebe um conjunto completo e igual: 4 cromátides, que agora contam como 4 cromossomos.</p>',
    itens: api => api.estado.croms.map(d => novoCrom(api, { ...d, cromatides: d.cromatides.map(k => ({ ...k, alelos: [...k.alelos] })) })),
    dividir: (api, it) => it._d.cromatides.map(k => novoCrom(api, { par: it._d.par, origem: it._d.origem, cromatides: [{ ...k, alelos: [...k.alelos] }], irmaDe: it.dataset.id })),
    erroMesmoPolo: 'Não disjunção! As cromátides-irmãs vão para polos opostos; se ficarem juntas, uma célula fica com um cromossomo a mais e a outra com um a menos.', msgDividiu: 'Centrômero dividido: as cromátides agora são cromossomos independentes.', fim: 'Anáfase completa: cada polo tem 4 cromossomos',
  }),
  {
    titulo: 'Telófase e citocinese', instrucao: 'Os envoltórios nucleares se refazem e o citoplasma se divide. Toque em <b>Dividir a célula</b> e compare as duas células-filhas.',
    ajuda: '<p>A mitose produz <b>duas células geneticamente idênticas</b> à célula-mãe (2n = 4, mesmo genótipo). É a divisão do crescimento, da regeneração e da reprodução assexuada.</p>',
    async montar(api) {
      const { el } = api; const q = api.quadro(); q.innerHTML = '<h3>Resultado</h3><div id="res"></div>';
      const bt = el('button', 'mjBt ouro', '✂️ Dividir a célula'); q.querySelector('#res').appendChild(bt);
      bt.onclick = () => {
        const g = z => z.sort((a, b) => a.par - b.par || (a.origem > b.origem ? 1 : -1)).map(d => genotipo(d.cromatides)).join(' ');
        const c1 = g(api.estado.polos.cima), c2 = g(api.estado.polos.baixo), iguais = c1 === c2;
        q.querySelector('#res').innerHTML = `<div class="gametas"><div class="gameta"><b>Célula-filha 1</b><br>2n = 4<br><small>${c1}</small></div><div class="gameta"><b>Célula-filha 2</b><br>2n = 4<br><small>${c2}</small></div></div><p style="font-size:13.5px;margin-top:10px">${iguais ? '<b style="color:#36D399">Idênticas à célula-mãe.</b> Mitose: mesma informação em todas as células do corpo.' : 'As células ficaram diferentes: houve erro na separação.'}</p>`;
        api.acerto(iguais ? 'Mitose completa: 2 células idênticas' : 'Divisão concluída', iguais ? 25 : 5); api.concluirFase();
      };
    },
  },
];

// ---------- MEIOSE ----------
const profase1 = {
  titulo: 'Prófase I: pareamento e crossing-over', instrucao: 'Os homólogos se reconhecem e se emparelham (<b>sinapse</b>), formando tétrades. <b>Arraste cada cromossomo até o seu homólogo</b>. Depois toque em uma tétrade para fazer o <b>crossing-over</b>.',
  ajuda: '<p>Homólogos têm o mesmo tamanho e os mesmos genes (podendo ter alelos diferentes): azul-longo pareia com vermelho-longo. No <b>crossing-over</b>, cromátides não-irmãs trocam pedaços: aparecem combinações novas de alelos (recombinação), que não existiam na célula-mãe.</p>',
  async montar(api) {
    garantir(); const { el } = api;
    const q = api.quadro(); q.innerHTML = '<h3>Núcleo em prófase I</h3><div class="linha" id="nuc" style="justify-content:center;gap:14px;min-height:90px"></div><div id="co" style="margin-top:10px"></div>';
    const nuc = q.querySelector('#nuc');
    const croms = api.estado.croms.map(d => novoCrom(api, { ...d, cromatides: d.cromatides.map(k => ({ ...k, alelos: [...k.alelos] })) })); croms.forEach(c => nuc.appendChild(c));
    const tetrades = []; let cross = 0;
    const formar = (a, b) => {
      const t = el('div', 'tetrade'); t.dataset.par = a._d.par; t._croms = [a, b].sort((x, y) => x._d.origem > y._d.origem ? 1 : -1);
      t._croms.forEach(c => { c.style.cursor = 'default'; c.dataset.travada = '1'; t.appendChild(c); });
      const bt = el('span', 'flip', '✂ crossing-over'); t.appendChild(bt);
      bt.onclick = () => {
        if (t.dataset.cross) return; t.dataset.cross = '1'; cross++;
        // troca o segmento distal (segundo gene) entre uma cromátide de cada homólogo
        const [p, m] = t._croms; const kp = p._d.cromatides[1], km = m._d.cromatides[1];
        if (kp.alelos.length > 1) { const tmp = kp.alelos[1]; kp.alelos[1] = km.alelos[1]; km.alelos[1] = tmp; }
        else { api.info('Neste par curto o crossing-over não troca alelos visíveis (um gene só).'); }
        p.replaceWith(novoCrom(api, p._d)); m.replaceWith(novoCrom(api, m._d)); t._croms = [...t.querySelectorAll('.crom')]; t._croms.forEach(c => { c.style.cursor = 'default'; c.dataset.travada = '1'; });
        bt.textContent = '✓ recombinado'; api.acerto('Crossing-over: cromátides recombinantes com combinações novas de alelos', 15);
        if (tetrades.length === 2 && cross >= 1) api.concluirFase('Prófase I completa');
      };
      nuc.appendChild(t); tetrades.push(t); api.estado.tetrades = tetrades;
      api.acerto(`Par ${a._d.par} emparelhado (tétrade com 4 cromátides)`, 10);
      if (tetrades.length === 2) api.status('Agora faça o crossing-over em pelo menos uma tétrade (toque em ✂).');
    };
    for (const c of croms) api.arrastavel(c, {
      alvos: () => croms.filter(x => x !== c && !x.dataset.travada).map(x => (x.dataset.multi = '1', x)),
      aoSoltar(alvo, peca) {
        if (alvo._d.par !== peca._d.par) { api.erro('Esses não são homólogos: tamanhos e genes diferentes. Pareie o longo com o longo e o curto com o curto.'); return false; }
        if (alvo._d.origem === peca._d.origem) { api.erro('São o mesmo cromossomo.'); return false; }
        formar(alvo, peca); return true;
      },
    });
  },
};
const metafase1 = faseMetafase({
  titulo: 'Metáfase I', instrucao: 'As <b>tétrades</b> se alinham na placa. A orientação de cada par é <b>aleatória</b>: toque em ↕ para virar quem fica para cima. Depois arraste as duas para a placa.', rotulo: 'Célula-mãe (2n = 4) · meiose I',
  ajuda: '<p>Na metáfase I alinham-se os <b>pares</b> (não cromossomos isolados). Cada par se orienta independentemente dos outros: é a <b>segregação independente</b>, a 2ª Lei de Mendel. Com 2 pares há 2² = 4 combinações possíveis de gametas só por isso.</p>',
  itens: api => api.estado.tetrades.map(t => { const n = api.el('div', 'tetrade'); n.dataset.par = t.dataset.par; n._croms = t._croms.map(c => novoCrom(api, c._d)); n._croms.forEach(c => { c.style.cursor = 'default'; c.dataset.travada = '1'; n.appendChild(c); }); const f = api.el('span', 'flip', '↕'); n.appendChild(f); f.addEventListener('pointerdown', e => e.stopPropagation()); f.onclick = e => { e.stopPropagation(); n.insertBefore(n._croms[1], n._croms[0]); n._croms.reverse(); api.info('Orientação trocada: segregação independente.'); }; if (Math.random() < .5) f.onclick(new Event('x')); return n; }),
  fim: 'Tétrades na placa: metáfase I', extras: api => { api.estado.pontos += 5; },
});
const anafase1 = faseAnafase({
  titulo: 'Anáfase I', instrucao: 'Agora separam-se os <b>homólogos</b> (cada um ainda com duas cromátides). Toque na tétrade para soltar o par e arraste cada homólogo para um polo.', rotulo: 'Meiose I', nomeItem: 'tétrade',
  ajuda: '<p>Na anáfase I <b>não</b> se separam cromátides: separam-se os <b>homólogos</b>. Por isso a meiose I é a divisão <b>reducional</b>: cada célula-filha fica com n = 2 cromossomos (ainda duplicados).</p>',
  itens: api => api.estado.itens.map(t => { const n = api.el('div', 'tetrade'); n.dataset.par = t.dataset.par; n._croms = t._croms.map(c => novoCrom(api, c._d)); n._croms.forEach(c => { c.style.cursor = 'default'; c.dataset.travada = '1'; n.appendChild(c); }); return n; }),
  dividir: (api, t) => t._croms.map(c => { const n = novoCrom(api, c._d); n.dataset.id = 'h' + (++uid); return n; }),
  erroMesmoPolo: 'Não disjunção na meiose I: os dois homólogos foram para o mesmo polo. Um gameta ficaria com um cromossomo a mais (como na trissomia do 21) e outro com um a menos.', msgDividiu: 'Par solto: leve cada homólogo para um polo diferente.', fim: 'Meiose I: cada polo tem n = 2 cromossomos duplicados',
});
const telofase1 = {
  titulo: 'Telófase I', instrucao: 'Formam-se duas células <b>haploides</b> (n = 2), cada cromossomo ainda com 2 cromátides. Toque para dividir.',
  ajuda: '<p>Depois da meiose I a célula já é haploide (metade do número de cromossomos), mas o DNA ainda está duplicado. A meiose II vai separar as cromátides, como uma mitose.</p>',
  async montar(api) {
    const { el } = api; const q = api.quadro(); q.innerHTML = '<h3>Resultado da meiose I</h3><div id="res"></div>';
    const bt = el('button', 'mjBt ouro', '✂️ Dividir a célula'); q.querySelector('#res').appendChild(bt);
    bt.onclick = () => {
      api.estado.celulasII = [api.estado.polos.cima, api.estado.polos.baixo];
      q.querySelector('#res').innerHTML = `<div class="gametas">${api.estado.celulasII.map((cel, k) => `<div class="gameta"><b>Célula ${k + 1}</b><br>n = ${cel.length} · ${cel.reduce((s, d) => s + d.cromatides.length, 0)}C<br><small>${cel.map(d => d.cromatides.map(x => x.alelos.join('')).join('/')).join(' · ')}</small></div>`).join('')}</div><p style="font-size:13.5px;margin-top:10px">Haploides, mas com cromátides duplicadas. Falta a meiose II.</p>`;
      api.acerto('Meiose I concluída: divisão reducional', 15); api.concluirFase();
    };
  },
};
function meiose2(indice) {
  return faseAnafase({
    titulo: `Meiose II · célula ${indice + 1} de 2`, instrucao: 'Como numa mitose: os cromossomos se alinham e as <b>cromátides-irmãs</b> se separam. Toque em cada cromossomo e leve as cromátides para polos opostos.', rotulo: `Célula ${indice + 1} (n = 2)`, nomeItem: 'cromossomo',
    ajuda: '<p>A meiose II é <b>equacional</b>: separa cromátides-irmãs sem reduzir o número de cromossomos. Repare que, por causa do crossing-over, cromátides "irmãs" podem já não ser idênticas.</p>',
    itens: api => api.estado.celulasII[indice].map(d => novoCrom(api, { ...d, cromatides: d.cromatides.map(k => ({ ...k, alelos: [...k.alelos] })) })),
    dividir: (api, it) => it._d.cromatides.map(k => novoCrom(api, { par: it._d.par, origem: k.origem, cromatides: [{ ...k, alelos: [...k.alelos] }] })),
    erroMesmoPolo: 'Cromátides-irmãs devem ir para polos opostos.', msgDividiu: 'Centrômero dividido.', fim: `Célula ${indice + 1} dividida`,
  });
}
const resultado = {
  titulo: 'Gametas', instrucao: 'Veja os quatro gametas e compare com a célula-mãe.',
  ajuda: '<p>A meiose produz <b>4 células haploides diferentes</b> entre si e da célula-mãe. A variabilidade vem de dois mecanismos: <b>crossing-over</b> (prófase I) e <b>segregação independente</b> dos pares (metáfase I). Na fecundação, os gametas se combinam ao acaso: a terceira fonte de variação.</p>',
  async montar(api) {
    const g = [];
    // guarda os polos da célula 2 (o estado.polos atual) e recupera os da célula 1 salvos antes
    const p2 = api.estado.polos, p1 = api.estado.polosII1;
    for (const p of [p1 && p1.cima, p1 && p1.baixo, p2.cima, p2.baixo]) if (p) g.push(p.sort((a, b) => a.par - b.par).map(d => genotipo(d.cromatides)).join(' '));
    const distintos = new Set(g).size;
    const q = api.quadro(); q.innerHTML = `<h3>4 gametas (n = 2)</h3><div class="gametas">${g.map((x, k) => `<div class="gameta"><b>Gameta ${k + 1}</b><br><small style="font-size:14px">${x}</small></div>`).join('')}</div>
      <p style="font-size:14px;margin-top:12px">Célula-mãe: <b>AD/ad · B/b</b>. Gametas diferentes entre si: <b style="color:#FFD166;font-size:18px">${distintos} de 4</b>.<br><span style="color:#cdd8f0;font-size:13px">${distintos >= 3 ? 'Isso é a variabilidade genética: o crossing-over recombinou A/D e a orientação dos pares misturou paterno e materno. Na mitose, as duas células sairiam idênticas.' : 'Faça o crossing-over e vire a orientação das tétrades para ver mais combinações.'}</span></p>`;
    api.acerto(`Meiose completa: ${distintos} gametas diferentes`, 10 + distintos * 5); api.concluirFase();
  },
};
// salva os polos da célula 1 antes de começar a célula 2
const m2a = meiose2(0), m2b = meiose2(1);
const montarB = m2b.montar; m2b.montar = async api => { api.estado.polosII1 = api.estado.polos; return montarB(api); };
const meiose = [interfase('meiose'), profase1, metafase1, anafase1, telofase1, m2a, m2b, resultado];

// a oficina roda mitose e meiose em sequência: primeiro a mitose (4 etapas), depois a meiose (8 etapas)
const separador = { titulo: 'Mitose ✓ · agora a meiose', instrucao: 'Você fez uma mitose. Agora a mesma célula-mãe vai fazer <b>meiose</b>, a divisão que forma gametas. Repare nas diferenças a cada etapa.', async montar(api) { const q = api.quadro(); q.innerHTML = '<h3>Mitose × Meiose</h3><table class="tb"><tr><th></th><th>Mitose</th><th>Meiose</th></tr><tr><td>Divisões</td><td>1</td><td>2</td></tr><tr><td>Células-filhas</td><td>2</td><td>4</td></tr><tr><td>Ploidia</td><td>2n → 2n</td><td>2n → n</td></tr><tr><td>Pareamento de homólogos</td><td>não</td><td>sim (prófase I)</td></tr><tr><td>Variabilidade</td><td>não</td><td>sim</td></tr></table>'; api.concluirFase(); } };

export const modulo = {
  fases: [...mitose, separador, ...meiose],
  resumo: () => 'Você fez a mitose (duas células idênticas, 2n) e a meiose completa (quatro gametas haploides e diferentes). Sabe agora onde se separam cromátides, onde se separam homólogos, por que o número de cromossomos cai pela metade e de onde vem a variabilidade: crossing-over e segregação independente.',
};
