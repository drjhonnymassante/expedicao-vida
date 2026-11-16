// Laboratório da Membrana: tonicidade, osmose em célula animal e vegetal, e as "portas" da membrana.
const ficha = (api, nome, tipo, cor = '#2a3b63', fg = '#fff') => { const p = api.el('div', 'peca', nome); p.dataset.tipo = tipo; p.style.background = cor; p.style.color = fg; p.style.fontSize = '13px'; return p; };
const slot = (api, aceita, rotulo, multi = false) => { const a = api.el('div', 'alvo', rotulo); a.dataset.aceita = aceita; a.style.minWidth = '120px'; a.style.fontSize = '12px'; if (multi) { a.dataset.multi = '1'; a.style.minHeight = '64px'; a.style.flexWrap = 'wrap'; a.style.gap = '6px'; a.style.padding = '6px'; a.style.justifyContent = 'flex-start'; } return a; };
function ligar(api, pecas, alvos, motivo, aoAcertar) {
  for (const p of pecas) api.arrastavel(p, {
    alvos, clonar: true,
    aoSoltar(a, peca) {
      const t = peca.dataset.tipo, ok = a.dataset.aceita.split('|').includes(t);
      if (!ok) { api.erro(motivo(t, a)); a.classList.add('errado'); setTimeout(() => a.classList.remove('errado'), 500); return false; }
      if (a.dataset.multi) { a.appendChild(peca); peca.classList.remove('arrastando'); peca.style.cssText = ''; peca.dataset.travada = '1'; a.classList.add('cheio'); a.querySelectorAll('.rot').forEach(x => x.remove()); } else api.encaixar(a, peca);
      api.estado.pontos += 6; aoAcertar(a, t); return true;
    },
  });
}
const BEQ = [{ c: '0,3% de NaCl', ton: 'hipo', animal: 'hemolise', vegetal: 'turgida' }, { c: '0,9% de NaCl', ton: 'iso', animal: 'mantem', vegetal: 'flacida' }, { c: '3% de NaCl', ton: 'hiper', animal: 'crenacao', vegetal: 'plasmolise' }];
const NOME = { hipo: 'hipotônica', iso: 'isotônica', hiper: 'hipertônica' };

const tonicidade = {
  titulo: 'Soluções', instrucao: 'O sangue (e o interior das células) equivale a <b>0,9% de NaCl</b>. Compare cada solução com a célula e arraste o rótulo certo: <b>hipotônica</b> (menos soluto que a célula), <b>isotônica</b> (igual) ou <b>hipertônica</b> (mais soluto).',
  ajuda: '<p><b>Tônico</b> compara concentrações de soluto. A água atravessa a membrana por osmose <b>do meio menos concentrado em soluto para o mais concentrado</b>. Uma solução hipotônica tem menos soluto que a célula, então a água entra na célula; na hipertônica, a água sai.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Três béqueres com uma hemácia dentro</h3><div class="linha" id="beq" style="gap:14px;align-items:stretch"></div>';
    const alvos = BEQ.map(b => { const cx = api.el('div', '', `<div style="text-align:center;font-weight:800;margin-bottom:6px">🧪 ${b.c}</div>`); const a = slot(api, b.ton, 'tonicidade?'); cx.appendChild(a); q.querySelector('#beq').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Rótulos</div>'); api.tab.appendChild(pal);
    const pecas = Object.entries(NOME).map(([t, n]) => { const p = ficha(api, n, t, { hipo: '#1e88e5', iso: '#43a047', hiper: '#e53935' }[t]); pal.appendChild(p); return p; });
    let n = 0; ligar(api, pecas, alvos, t => ({ hipo: 'Hipotônica é a solução com MENOS soluto que a célula (abaixo de 0,9%).', iso: 'Isotônica tem a MESMA concentração da célula (0,9%).', hiper: 'Hipertônica tem MAIS soluto que a célula (acima de 0,9%).' }[t]), () => { if (++n === 3) api.concluirFase('Soluções classificadas'); });
  },
};
const animal = {
  titulo: 'Hemácia', instrucao: 'Agora preveja: o que acontece com a <b>hemácia</b> (célula animal, sem parede) em cada solução? Arraste o destino certo.',
  ajuda: '<p>Na solução <b>hipotônica</b> a água entra, a hemácia incha e pode estourar (<b>hemólise</b>). Na <b>isotônica</b> entra e sai água na mesma taxa: a forma se mantém. Na <b>hipertônica</b> a água sai e a célula murcha (<b>crenação</b>). É por isso que o soro fisiológico é 0,9%.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Hemácia em cada solução</h3><div class="linha" id="beq" style="gap:14px;align-items:stretch"></div>';
    const alvos = BEQ.map(b => { const cx = api.el('div', '', `<div style="text-align:center;font-weight:800;margin-bottom:6px">🧪 ${b.c}<br><small style="color:#9fb3d9">${NOME[b.ton]}</small></div>`); const a = slot(api, b.animal, 'o que acontece?'); a.style.minHeight = '56px'; cx.appendChild(a); q.querySelector('#beq').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Destinos</div>'); api.tab.appendChild(pal);
    const pecas = [['🔴💥 incha e rompe (hemólise)', 'hemolise'], ['🔴 mantém a forma', 'mantem'], ['🔴🥀 murcha (crenação)', 'crenacao']].map(([n, t]) => { const p = ficha(api, n, t, '#3a2a4a'); pal.appendChild(p); return p; });
    let n = 0; ligar(api, pecas, alvos, (t, a) => ({ hemolise: 'Para inchar, a água tem de ENTRAR: isso acontece na solução hipotônica.', mantem: 'A forma só se mantém quando as concentrações são iguais (isotônica).', crenacao: 'Para murchar, a água tem de SAIR da célula: solução hipertônica.' }[t]), () => { if (++n === 3) api.concluirFase('Previsões corretas para a célula animal'); });
  },
};
const vegetal = {
  titulo: 'Célula vegetal', instrucao: 'A célula vegetal tem <b>parede celular</b>. Preveja o estado dela em cada solução: <b>túrgida</b>, <b>flácida</b> ou <b>plasmolisada</b>.',
  ajuda: '<p>A parede impede a célula vegetal de estourar: na hipotônica ela fica <b>túrgida</b> (pressão de turgor, planta firme). Na isotônica fica <b>flácida</b> (murcha leve). Na hipertônica a membrana se descola da parede: <b>plasmólise</b>. Se voltar à água, pode se recuperar (deplasmólise).</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Célula vegetal em cada solução</h3><div class="linha" id="beq" style="gap:14px;align-items:stretch"></div>';
    const alvos = BEQ.map(b => { const cx = api.el('div', '', `<div style="text-align:center;font-weight:800;margin-bottom:6px">🧪 ${b.c}<br><small style="color:#9fb3d9">${NOME[b.ton]}</small></div>`); const a = slot(api, b.vegetal, 'estado?'); a.style.minHeight = '56px'; cx.appendChild(a); q.querySelector('#beq').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Estados</div>'); api.tab.appendChild(pal);
    const pecas = [['🟩 túrgida (firme)', 'turgida'], ['🟩 flácida', 'flacida'], ['🟩 plasmolisada', 'plasmolise']].map(([n, t]) => { const p = ficha(api, n, t, '#1f4a2e'); pal.appendChild(p); return p; });
    let n = 0; ligar(api, pecas, alvos, t => ({ turgida: 'Túrgida é quando a água ENTRA e a parede segura a pressão: hipotônica.', flacida: 'Flácida: sem entrada líquida de água, na isotônica.', plasmolise: 'Plasmólise: a água SAI e a membrana se afasta da parede: hipertônica.' }[t]), () => { if (++n === 3) api.concluirFase('A parede faz toda a diferença'); });
  },
};
const portas = {
  titulo: 'Portas da membrana', instrucao: 'Cada substância atravessa a membrana de um jeito. Arraste cada uma para o mecanismo certo.',
  ajuda: '<p><b>Difusão simples</b>: moléculas pequenas e apolares passam direto pela bicamada (O₂, CO₂, etanol), a favor do gradiente, sem gasto de energia.<br><b>Osmose</b>: é a difusão da água (muito dela por aquaporinas).<br><b>Difusão facilitada</b>: moléculas polares ou íons passam por proteínas (canais ou carreadores), ainda a favor do gradiente e sem ATP: glicose, K⁺ por canal.<br><b>Transporte ativo</b>: contra o gradiente, com gasto de ATP: bomba de sódio e potássio.</p>',
  async montar(api) {
    const q = api.quadro(); q.innerHTML = '<h3>Mecanismos</h3><div class="linha" id="bins" style="gap:10px;align-items:stretch"></div>';
    const bins = [['simples', 'Difusão simples (pela bicamada)'], ['osmose', 'Osmose (água)'], ['facilitada', 'Difusão facilitada (proteína, sem ATP)'], ['ativo', 'Transporte ativo (proteína, com ATP)']].map(([t, n]) => { const cx = api.el('div', '', `<div style="font-size:12px;font-weight:800;margin-bottom:4px">${n}</div>`); cx.style.flex = '1'; cx.style.minWidth = '150px'; const a = slot(api, t, '', true); a.innerHTML = '<span class="rot" style="color:rgba(255,255,255,.4);font-size:11px">solte aqui</span>'; cx.appendChild(a); q.querySelector('#bins').appendChild(cx); return a; });
    const pal = api.el('div', 'paleta', '<div class="tit">Substâncias</div>'); api.tab.appendChild(pal);
    const itens = [['O₂', 'simples'], ['CO₂', 'simples'], ['etanol', 'simples'], ['H₂O', 'osmose'], ['glicose (a favor)', 'facilitada'], ['K⁺ por canal', 'facilitada'], ['Na⁺ contra o gradiente', 'ativo'], ['K⁺ contra o gradiente', 'ativo']];
    const pecas = api.embaralhar(itens).map(([n, t]) => { const p = ficha(api, n, t, '#2a3b63'); pal.appendChild(p); return p; });
    let n = 0; ligar(api, pecas, bins, (t, a) => ({ simples: 'Essa molécula é pequena e apolar: atravessa a própria bicamada, sem proteína.', osmose: 'Água atravessa por osmose (e aquaporinas), sem gasto de energia.', facilitada: 'Polar ou íon, mas A FAVOR do gradiente: passa por proteína sem gastar ATP.', ativo: 'CONTRA o gradiente só com transporte ativo, gastando ATP (bomba).' }[t]), () => { if (++n === itens.length) api.concluirFase('Todas as portas identificadas'); });
    api.status(`0/${itens.length}`);
  },
};
export const modulo = { fases: [tonicidade, animal, vegetal, portas], resumo: () => 'Você classificou soluções pela tonicidade, previu hemólise e crenação na hemácia, turgor e plasmólise na célula vegetal, e separou difusão simples, osmose, difusão facilitada e transporte ativo. A regra de ouro: a água vai para onde há mais soluto; contra o gradiente, só com ATP.' };
