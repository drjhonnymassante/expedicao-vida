// Progresso único do aluno, compartilhado por mundo 3D, mundo leve e aulas (até a fase 2, quando vai para o servidor).
'use strict';
(function () {
  const CHAVE = 'expedicao_vida';
  function novo(nome) { return { nome: nome || 'Evonauta', cor: 0, xp: 0, feitas: {}, livres: [true], itens: [], orbes: {}, frags: {}, aulas: {}, conquistas: {}, diarias: null }; }
  function carregar() { try { return JSON.parse(localStorage.getItem(CHAVE)); } catch { return null; } }
  function salvar(e) { try { if (e) e.atualizadoEm = Date.now(); localStorage.setItem(CHAVE, JSON.stringify(e)); } catch { } }
  const temProgresso = e => !!e && ((e.xp || 0) > 0 || Object.keys(e.feitas || {}).length > 0);
  function completar(e) { const b = novo(e && e.nome); return Object.assign(b, e || {}); }
  // união de duas versões do progresso (local e nuvem): nada que foi conquistado em uma delas se perde.
  // A mais recente manda nos campos simples; um "recomeçar do zero" posterior à outra versão descarta-a.
  function mesclar(a, b) {
    if (!a) return b; if (!b) return a;
    const [n, v] = (a.atualizadoEm || 0) >= (b.atualizadoEm || 0) ? [a, b] : [b, a];
    if ((n.reiniciadoEm || 0) > (v.atualizadoEm || 0)) return n;
    const r = completar(Object.assign({}, v, n));
    for (const k of ['feitas', 'aulas', 'conquistas', 'chefes', 'orbes', 'frags', 'pilulasCol']) r[k] = Object.assign({}, v[k] || {}, n[k] || {});
    const L = Math.max((n.livres || []).length, (v.livres || []).length); r.livres = [];
    for (let i = 0; i < L; i++) r.livres[i] = !!((n.livres || [])[i] || (v.livres || [])[i]);
    r.xp = Math.max(n.xp || 0, v.xp || 0); r.cristais = Math.max(n.cristais || 0, v.cristais || 0); r.cristaisTotal = Math.max(n.cristaisTotal || 0, v.cristaisTotal || 0);
    r.itens = [...new Set([...(v.itens || []), ...(n.itens || [])])];
    if (v.seq && n.seq && (v.seq.recorde || 0) > (n.seq.recorde || 0)) r.seq.recorde = v.seq.recorde;
    const porT = new Map(); for (const p of [...(v.pontos || []), ...(n.pontos || [])]) porT.set(p.t, p);
    r.pontos = [...porT.values()].sort((a, b) => a.t - b.t).slice(-8);
    return r;
  }
  // pontos de salvamento: cópias do progresso guardadas em marcos (missão, guardião, nível) e por tempo.
  // Ficam dentro do próprio progresso (viajam com a nuvem) e permitem voltar a um ponto anterior.
  const FORA_DO_PONTO = ['pontos', 'pilulasTexto', 'pos3d', 'atualizadoEm', 'uid', 'reiniciadoEm'];
  function guardarPonto(e, rotulo) {
    if (!e) return null;
    const d = {}; for (const k in e) if (!FORA_DO_PONTO.includes(k)) d[k] = e[k];
    const p = { t: Date.now(), rotulo: rotulo || 'Automático', xp: e.xp || 0, ilhas: (e.livres || []).filter(Boolean).length, missoes: Object.keys(e.feitas || {}).length, dados: JSON.parse(JSON.stringify(d)) };
    const ps = e.pontos ||= [], u = ps[ps.length - 1];
    if (u && u.xp === p.xp && u.ilhas === p.ilhas && u.missoes === p.missoes) { u.t = p.t; u.dados = p.dados; return u; }   // nada mudou: só atualiza
    ps.push(p); while (ps.length > 8) ps.shift(); return p;
  }
  const melhorPonto = e => (e && e.pontos || []).reduce((m, p) => !m || p.ilhas > m.ilhas || (p.ilhas === m.ilhas && p.xp > m.xp) ? p : m, null);
  // o progresso atual está atrás do melhor ponto guardado? (sinal de que algo foi perdido)
  function regrediu(e) { const m = melhorPonto(e); if (!m) return null; const ilhas = (e.livres || []).filter(Boolean).length; return (m.ilhas > ilhas || m.xp > (e.xp || 0) + 30) ? m : null; }
  function restaurar(e, p) {
    const r = completar(JSON.parse(JSON.stringify(p.dados)));
    r.pontos = e.pontos; r.uid = e.uid; r.pilulasTexto = e.pilulasTexto; r.reiniciadoEm = Date.now();   // a versão restaurada passa a valer, inclusive sobre a nuvem
    return r;
  }
  window.EstadoVida = { CHAVE, novo, carregar, salvar, completar, temProgresso, mesclar, guardarPonto, melhorPonto, regrediu, restaurar };
})();
