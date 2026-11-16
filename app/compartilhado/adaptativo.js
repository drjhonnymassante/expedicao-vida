// Adaptação ao ritmo do aluno: histórico de acertos e erros por questão e por tópico,
// repetição espaçada e escolha do nível. Compartilhado pelo mundo 3D e pela página de aulas.
// Guarda tudo dentro do progresso (EstadoVida): est.hist[idQuestao] e est.topHist[idTopico].
'use strict';
(function () {
  const DIA = 864e5, INTERVALOS = [1, 3, 7, 16, 35, 90];   // dias até a próxima revisão a cada acerto seguido
  const NIVEIS = ['bronze', 'prata', 'ouro', 'diamante'];
  function registrar(est, q, topicoId, ok) {
    if (!est || !q) return;
    const h = (est.hist ||= {}), r = h[q.id] || (h[q.id] = { a: 0, e: 0, seq: 0, u: 0, prox: 0, n: q.nivel });
    r.u = Date.now(); if (ok) { r.a++; r.seq++; r.prox = Date.now() + INTERVALOS[Math.min(INTERVALOS.length - 1, r.seq - 1)] * DIA; } else { r.e++; r.seq = 0; r.prox = Date.now() + DIA * .5; }
    const th = (est.topHist ||= {}), t = th[topicoId] || (th[topicoId] = { a: 0, e: 0, recentes: [] });
    if (ok) t.a++; else t.e++; t.recentes.push(ok ? 1 : 0); if (t.recentes.length > 12) t.recentes.shift(); t.u = Date.now();
  }
  // taxa de acerto recente no tópico (0 a 1); null sem histórico
  function taxa(est, topicoId) { const t = est && est.topHist && est.topHist[topicoId]; if (!t || !t.recentes.length) return null; return t.recentes.reduce((a, b) => a + b, 0) / t.recentes.length; }
  // prioridade de uma questão para revisão: errada e nunca acertada > vencida (prox passou) > nunca vista > dominada
  function prioridade(est, q) {
    const r = est && est.hist && est.hist[q.id]; const agora = Date.now();
    if (!r) return 2;
    if (r.seq === 0 && r.e > 0) return 0;
    if (r.prox && r.prox <= agora) return 1;
    return 3 + Math.min(3, r.seq);   // quanto mais acertos seguidos, mais para o fim
  }
  function ordenar(questoes, est) { return questoes.map((q, i) => ({ q, i, p: prioridade(est, q) })).sort((a, b) => a.p - b.p || a.i - b.i).map(x => x.q); }
  // nível sugerido para o tópico: começa em prata; sobe com taxa alta, desce com baixa
  function nivelSugerido(est, topicoId) { const t = taxa(est, topicoId); if (t == null) return 'prata'; if (t < .5) return 'bronze'; if (t < .8) return 'prata'; return 'ouro'; }
  // escolhe n questões para o desafio da estação: faixa de níveis ao redor do sugerido, priorizando as que precisam de revisão
  function selecionarDesafio(questoes, est, topicoId, n = 3) {
    const base = NIVEIS.indexOf(nivelSugerido(est, topicoId));
    const faixa = [NIVEIS[Math.max(0, base - 1)], NIVEIS[base], NIVEIS[Math.min(NIVEIS.length - 1, base + 1)]];
    const escolhidas = [];
    for (const nv of faixa) { const cand = ordenar(questoes.filter(q => q.nivel === nv && !escolhidas.includes(q)), est); if (cand.length) escolhidas.push(cand[0]); }
    while (escolhidas.length < n) { const cand = ordenar(questoes.filter(q => !escolhidas.includes(q)), est); if (!cand.length) break; escolhidas.push(cand[0]); }
    return escolhidas.slice(0, n).sort((a, b) => NIVEIS.indexOf(a.nivel) - NIVEIS.indexOf(b.nivel));
  }
  // tópicos que mais precisam de revisão: erros recentes e questões vencidas
  function revisao(est, limite = 5) {
    if (!est) return [];
    const agora = Date.now(), porTopico = {};
    for (const [id, t] of Object.entries(est.topHist || {})) { const tx = t.recentes.length ? t.recentes.reduce((a, b) => a + b, 0) / t.recentes.length : 1; porTopico[id] = { id, erros: t.e, taxa: tx, vencidas: 0, ultimo: t.u || 0 }; }
    for (const r of Object.values(est.hist || {})) { /* questões vencidas contam para o tópico via prefixo do id */ }
    for (const [qid, r] of Object.entries(est.hist || {})) { const tid = qid.replace(/-q\d+$/, ''); if (r.prox && r.prox <= agora) { (porTopico[tid] ||= { id: tid, erros: 0, taxa: 1, vencidas: 0, ultimo: 0 }).vencidas++; } }
    return Object.values(porTopico).map(t => ({ ...t, pontos: (1 - t.taxa) * 10 + t.vencidas * 2 + (agora - t.ultimo > 7 * DIA && t.erros ? 2 : 0) })).filter(t => t.pontos > 0).sort((a, b) => b.pontos - a.pontos).slice(0, limite);
  }
  const resumo = est => { const h = Object.values((est && est.hist) || {}); const a = h.reduce((s, r) => s + r.a, 0), e = h.reduce((s, r) => s + r.e, 0); return { respondidas: h.length, acertos: a, erros: e, taxa: a + e ? a / (a + e) : null, dominadas: h.filter(r => r.seq >= 3).length }; };
  window.Adaptativo = { registrar, taxa, prioridade, ordenar, nivelSugerido, selecionarDesafio, revisao, resumo, NIVEIS };
})();
