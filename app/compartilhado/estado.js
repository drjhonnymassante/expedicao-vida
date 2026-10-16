// Progresso único do aluno, compartilhado por mundo 3D, mundo leve e aulas (até a fase 2, quando vai para o servidor).
'use strict';
(function () {
  const CHAVE = 'expedicao_vida';
  function novo(nome) { return { nome: nome || 'Explorador(a)', cor: 0, xp: 0, feitas: {}, livres: [true], itens: [], orbes: {}, frags: {}, aulas: {}, conquistas: {}, diarias: null }; }
  function carregar() { try { return JSON.parse(localStorage.getItem(CHAVE)); } catch { return null; } }
  function salvar(e) { try { localStorage.setItem(CHAVE, JSON.stringify(e)); } catch { } }
  function completar(e) { const b = novo(e && e.nome); return Object.assign(b, e || {}); }
  window.EstadoVida = { CHAVE, novo, carregar, salvar, completar };
})();
