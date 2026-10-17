// Sessão do aluno no site publicado: exige login, sincroniza o progresso com a nuvem e oferece "Sair".
// Na prévia local (sem CONFIG_VIDA) não faz nada.
'use strict';
(function () {
  const cfg = window.CONFIG_VIDA;
  if (!cfg || !window.supabase || !document.currentScript) return;
  const RAIZ = new URL('../../', document.currentScript.src).href;
  const sb = window.supabase.createClient(cfg.url, cfg.chave);
  window.SB = sb; window.RAIZ_SITE = RAIZ;

  (async () => {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { location.replace(RAIZ + 'entrar.html?volta=' + encodeURIComponent(location.pathname + location.hash)); return; }
    const uid = session.user.id;
    window.USUARIO = session.user;
    const { data: perfil } = await sb.from('profiles').select('apelido, progresso').eq('id', uid).maybeSingle();
    let local = EstadoVida.carregar();
    if (local && local.uid && local.uid !== uid) local = null;          // outra conta neste navegador: não mistura
    const remoto = perfil && perfil.progresso && Object.keys(perfil.progresso).length ? perfil.progresso : null;
    const final = (remoto && (!local || (remoto.xp || 0) >= (local.xp || 0))) ? remoto : EstadoVida.completar(local || EstadoVida.novo(perfil && perfil.apelido));
    final.uid = uid;
    if (perfil && perfil.apelido && (!final.nome || final.nome === 'Explorador(a)' || final.nome === 'Evonauta')) final.nome = perfil.apelido;
    EstadoVida.salvar(final);
    dispatchEvent(new CustomEvent('progresso-sincronizado'));

    let enviado = '';
    async function enviar() {
      const e = EstadoVida.carregar(); if (!e) return;
      e.uid = uid; const s = JSON.stringify(e); if (s === enviado) return;
      const { error } = await sb.from('profiles').update({ progresso: e }).eq('id', uid);
      if (!error) enviado = s;
    }
    enviado = JSON.stringify(final);
    setInterval(enviar, 15000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) enviar(); });
    addEventListener('pagehide', enviar);
    window.salvarNaNuvem = enviar;

    const acoes = document.getElementById('acoes');
    if (acoes) {
      const b = document.createElement('button'); b.className = 'bt'; b.textContent = document.body.classList.contains('toque') ? '🚪' : 'Sair'; b.title = 'Sair da conta';
      b.onclick = async () => { await enviar(); await sb.auth.signOut(); location.href = RAIZ; };
      acoes.appendChild(b);
    }
  })();
})();
