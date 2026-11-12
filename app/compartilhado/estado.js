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
    return r;
  }
  window.EstadoVida = { CHAVE, novo, carregar, salvar, completar, temProgresso, mesclar };
})();
