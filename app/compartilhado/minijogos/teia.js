// Savana da Teia Alimentar: cadeia alimentar, níveis tróficos, fluxo de energia (10%) e bioacumulação.
const ficha = (api, n, t, cor = '#2a3b63') => { const p = api.el('div', 'peca', n); p.dataset.tipo = t; p.style.background = cor; p.style.fontSize = '13px'; return p; };
const slot = (api, aceita, rot, largura = 120) => { const a = api.el('div', 'alvo', rot); a.dataset.aceita = aceita; a.style.minWidth = largura + 'px'; a.style.fontSize = '11px'; return a; };
function ligar(api, pecas, alvos, motivo, aoAcertar) {
  for (const p of pecas) api.arrastavel(p, { alvos, clonar: true, aoSoltar(a, peca) { const t = peca.dataset.tipo; if (!a.dataset.aceita.split('|').includes(t)) { api.erro(motivo(t, a)); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; } api.encaixar(a, peca); p.style.display = 'none'; api.estado.pontos += 6; aoAcertar(a, t); return true; } });
}
const cheios = alvos => alvos.filter(a => a.classList.contains('cheio')).length;

const cadeia = {
  titulo: 'Monte a cadeia', instrucao: 'Organize os seres da savana em uma cadeia alimentar: quem produz, quem come quem, e quem recicla tudo no fim. Arraste cada organismo para o seu <b>nível trófico</b>.',
  ajuda: '<p><b>Produtores</b> (plantas, algas) fazem fotossíntese. <b>Consumidores primários</b> comem produtores (herbívoros); <b>secundários</b> comem os primários; <b>terciários</b> comem os secundários. <b>Decompositores</b> (fungos e bactérias) devolvem nutrientes ao solo a partir de todos os níveis. A seta da cadeia aponta para quem come (sentido da energia).</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Cadeia alimentar da savana</h3><div class="linha" id="cad" style="gap:6px;align-items:center"></div><div style="margin-top:10px;font-size:13px;color:#9fb3d9">As setas indicam o sentido do fluxo de energia: de quem é comido para quem come.</div>';
    const niveis = [['produtor', 'Produtor'], ['c1', 'Consumidor 1º'], ['c2', 'Consumidor 2º'], ['c3', 'Consumidor 3º'], ['decomp', 'Decompositor']];
    const alvos = niveis.map(([t, n], k) => { if (k) q.querySelector('#cad').appendChild(api.el('span', '', k === 4 ? '⤵' : '→')); const cx = api.el('div', '', `<div style="font-size:11px;color:#9fb3d9;text-align:center">${n}</div>`); const a = slot(api, t, '?', 104); cx.appendChild(a); q.querySelector('#cad').appendChild(cx); return a; });
    const seres = [['🌾 capim', 'produtor'], ['🦗 gafanhoto', 'c1'], ['🐸 sapo', 'c2'], ['🐍 cobra', 'c3'], ['🍄 fungos', 'decomp']];
    const pal = api.el('div', 'paleta', '<div class="tit">Organismos</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(seres).map(([n, t]) => { const p = ficha(api, n, t); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, (t, a) => ({ produtor: 'O capim faz fotossíntese: é o produtor, a base de tudo.', c1: 'O gafanhoto come o capim: consumidor primário (herbívoro).', c2: 'O sapo come o gafanhoto: consumidor secundário.', c3: 'A cobra come o sapo: consumidor terciário.', decomp: 'Fungos e bactérias decompõem restos de todos os níveis: decompositores.' }[t]), () => { api.status(`${cheios(alvos)}/5`); if (cheios(alvos) === 5) api.concluirFase('Cadeia montada: capim → gafanhoto → sapo → cobra, e os fungos reciclam'); });
  },
};
const energia = {
  titulo: 'Regra dos 10%', instrucao: 'Só cerca de <b>10%</b> da energia de um nível passa ao seguinte; o resto vira calor e trabalho de viver. Se o capim fixou <b>10 000 kcal</b>, arraste quanto chega a cada nível.',
  ajuda: '<p>A energia <b>flui</b> (não cicla): entra como luz, é fixada pelos produtores e se perde como calor a cada passagem (respiração, fezes, partes não comidas). Por isso as cadeias são curtas (4 ou 5 níveis) e as pirâmides de energia nunca se invertem. Já a <b>matéria</b> cicla graças aos decompositores.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Pirâmide de energia (kcal)</h3><div id="pir" style="display:flex;flex-direction:column;align-items:center;gap:6px"></div><div id="pg"></div>';
    const niveis = [['🐍 cobra', '10', 120], ['🐸 sapo', '100', 180], ['🦗 gafanhoto', '1000', 240], ['🌾 capim', '10000', 300]];
    const alvos = niveis.map(([n, v, w]) => { const l = api.el('div', 'linha', `<span style="width:110px;text-align:right;font-size:13px">${n}</span>`); l.style.gap = '8px'; const a = slot(api, v, '? kcal', w - 100); a.style.background = 'rgba(54,211,153,.08)'; l.appendChild(a); q.querySelector('#pir').appendChild(l); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Valores</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(['10000', '1000', '100', '10', '5000', '9000']).map(v => { const p = ficha(api, v + ' kcal', v, '#2e7d5b'); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, (t, a) => `Cada nível recebe cerca de 10% do anterior: aqui cabem ${Number(a.dataset.aceita).toLocaleString('pt-BR')} kcal.`, () => {
      api.status(`${cheios(alvos)}/4`); if (cheios(alvos) < 4) return;
      const pg = q.querySelector('#pg'); pg.innerHTML = '<p style="margin:12px 0 6px"><b>Por que não existe um "consumidor de 8ª ordem"?</b></p><div class="linha">' + [['A', 'Porque não há animais grandes o bastante'], ['B', 'Porque sobra pouquíssima energia depois de 4 ou 5 níveis'], ['C', 'Porque os decompositores impedem']].map(([k, t]) => `<button class="mjBt" data-k="${k}">${k}) ${t}</button>`).join('') + '</div>';
      pg.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.k === 'B') { api.acerto('Depois de 4 ou 5 transferências de 10%, a energia disponível é mínima.', 15); api.concluirFase('Energia flui e se perde a cada nível'); } else api.erro('Pense na regra dos 10%: quanto sobraria no 8º nível?'); });
    });
  },
};
const impacto = {
  titulo: 'Quem desaparece?', instrucao: 'Na teia da savana, o <b>sapo</b> também come besouros, e a <b>coruja</b> come sapos e ratos. Preveja o efeito de cada mudança: toque na resposta.',
  ajuda: '<p>Em uma <b>teia</b> cada espécie tem vários alimentos e vários predadores, por isso a remoção de uma espécie tem efeitos em cascata: a presa dela aumenta, o predador dela procura outra presa ou diminui. Teias mais complexas são mais estáveis.</p>',
  async montar(api) {
    const cen = [['Um agrotóxico mata todos os gafanhotos. Logo depois, o que acontece com o capim e com os sapos?', [['capim aumenta; sapos diminuem', true], ['capim diminui; sapos aumentam', false], ['nada muda', false]], 'Sem herbívoro, o capim cresce; o sapo perde uma presa e cai (mas sobrevive comendo besouros: a teia amortece).'], ['Caçadores eliminam as cobras. O que tende a acontecer com os sapos a curto prazo?', [['aumentam', true], ['diminuem', false], ['somem', false]], 'Sem o predador, a população de sapos cresce, até ser limitada pelo alimento ou pela coruja.'], ['Se os fungos e bactérias desaparecessem, qual seria a consequência?', [['os nutrientes parariam de voltar ao solo e os produtores definhariam', true], ['os consumidores teriam mais alimento', false], ['nada, pois estão no fim da cadeia', false]], 'Decompositores fecham o ciclo da matéria: sem eles, os nutrientes ficariam presos nos cadáveres.']];
    let i = 0; const q = api.quadro();
    const mostrar = () => { if (i >= cen.length) { q.innerHTML = '<h3>Concluído</h3><p>Você previu os efeitos em cascata na teia.</p>'; api.concluirFase('Teia alimentar: tudo está ligado'); return; } const [t, ops, exp] = cen[i]; q.innerHTML = `<h3>Cenário ${i + 1}/${cen.length}</h3><p style="font-size:14.5px">${t}</p><div class="linha" style="flex-direction:column;align-items:stretch">${api.embaralhar(ops).map(([o, ok]) => `<button class="mjBt" data-ok="${ok ? 1 : 0}" style="text-align:left">${o}</button>`).join('')}</div>`; q.querySelectorAll('button').forEach(b => b.onclick = () => { if (b.dataset.ok === '1') { api.acerto(exp, 15); i++; setTimeout(mostrar, 1500); } else api.erro('Siga as setas: quem come quem? ' + exp); }); };
    mostrar();
  },
};
const bioacumulacao = {
  titulo: 'Bioacumulação', instrucao: 'Um inseticida (DDT) que não se degrada entrou na cadeia pelo capim. Arraste a concentração que cada nível acumula (em ppm).',
  ajuda: '<p><b>Magnificação trófica</b>: substâncias que não são eliminadas (DDT, mercúrio) ficam no corpo. Cada predador come muitas presas ao longo da vida e concentra o veneno delas: a concentração <b>aumenta</b> ao longo da cadeia, ao contrário da energia. O topo (aves de rapina, grandes peixes, nós) é o mais afetado.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>DDT ao longo da cadeia</h3><div class="linha" id="cad" style="gap:6px;align-items:center"></div><div id="pg"></div>';
    const niveis = [['🌾 capim', '0,01'], ['🦗 gafanhoto', '0,1'], ['🐸 sapo', '1'], ['🐍 cobra', '10']];
    const alvos = niveis.map(([n, v], k) => { if (k) q.querySelector('#cad').appendChild(api.el('span', '', '→')); const cx = api.el('div', '', `<div style="font-size:12px;text-align:center">${n}</div>`); const a = slot(api, v, '? ppm', 84); cx.appendChild(a); q.querySelector('#cad').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Concentrações</div>'); api.tab.appendChild(pal);
    const pecas = api.embaralhar(['0,01', '0,1', '1', '10']).map(v => { const p = ficha(api, v + ' ppm', v, '#8e24aa'); pal.appendChild(p); return p; });
    ligar(api, pecas, alvos, (t, a) => 'Ao contrário da energia, o veneno se CONCENTRA a cada nível: o predador acumula o DDT de todas as presas que comeu.', () => { api.status(`${cheios(alvos)}/4`); if (cheios(alvos) === 4) { api.acerto('Energia diminui, veneno aumenta: por isso o topo da cadeia sofre mais.', 10); api.concluirFase('Bioacumulação compreendida'); } });
  },
};
export const modulo = { fases: [cadeia, energia, impacto, bioacumulacao], resumo: () => 'Você montou a cadeia da savana com seus níveis tróficos, aplicou a regra dos 10% na pirâmide de energia, previu efeitos em cascata na teia e viu a bioacumulação crescer rumo ao topo. Energia flui e se perde; matéria cicla; venenos persistentes se concentram.' };
