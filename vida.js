// Cliente Supabase e utilidades do site público.
'use strict';
(function () {
  const cfg = window.CONFIG_VIDA;
  const sb = window.supabase.createClient(cfg.url, cfg.chave, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const PLANOS = {
    digital: { nome: 'Plataforma Completa', ic: '🧬' },
    grupo: { nome: 'Plataforma + Mentoria em Grupo', ic: '👥' },
    individual: { nome: 'Plataforma + Mentoria Individual', ic: '🎯' },
  };
  async function contagens() {
    const { data, error } = await sb.rpc('contagem_lista_espera');
    if (error) return null;
    const m = {}; for (const r of data) m[r.plano] = { inscritos: Number(r.inscritos), vagas: r.vagas }; return m;
  }
  async function entrarNaLista(dados) {
    const { data: { session } } = await sb.auth.getSession();
    const linha = { ...dados, email: dados.email.trim().toLowerCase(), user_id: session ? session.user.id : null };
    const { error } = await sb.from('lista_espera').insert(linha);
    if (error && error.code === '23505') return { duplicado: true };
    if (error) return { erro: error.message };
    return { ok: true };
  }
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  window.Vida = { sb, cfg, PLANOS, contagens, entrarNaLista, esc };
})();
