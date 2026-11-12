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
    // assinatura ativa? o banco só entrega o conteúdo premium a quem tem (regra no Storage)
    sb.rpc('tem_acesso_premium').then(({ data }) => {
      window.Premium = {
        ativo: !!data,
        baixar: async caminho => { const { data: arq, error } = await sb.storage.from('conteudo-premium').download(caminho); if (error) throw error; return arq.text(); },
      };
      dispatchEvent(new CustomEvent('premium', { detail: !!data }));
    });
    const { data: perfil } = await sb.from('profiles').select('apelido, progresso').eq('id', uid).maybeSingle();
    let local = EstadoVida.carregar();
    if (local && local.uid && local.uid !== uid) local = null;          // outra conta neste navegador: não mistura
    const remoto = perfil && perfil.progresso && Object.keys(perfil.progresso).length ? perfil.progresso : null;
    // a versão mais recente vence (assim "recomeçar do zero" não é desfeito); sem data, vale a de mais XP
    // união das duas versões: progresso feito em qualquer uma delas é preservado
    const final = EstadoVida.completar(EstadoVida.mesclar(remoto, local) || EstadoVida.novo(perfil && perfil.apelido));
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
    // ao sair da página (ir para a aula, fechar a aba) o envio precisa sobreviver à navegação: fetch com keepalive
    let token = session.access_token;
    sb.auth.onAuthStateChange((_, s) => { if (s && s.access_token) token = s.access_token; });
    function enviarRapido() {
      const e = EstadoVida.carregar(); if (!e) return;
      e.uid = uid; const s = JSON.stringify(e); if (s === enviado) return;
      try {
        fetch(cfg.url + '/rest/v1/profiles?id=eq.' + encodeURIComponent(uid), { method: 'PATCH', keepalive: true, headers: { apikey: cfg.chave, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ progresso: e }) }).then(r => { if (r.ok) enviado = s; }).catch(() => {});
      } catch { }
    }
    enviado = JSON.stringify(final);
    setInterval(enviar, 15000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) enviarRapido(); });
    addEventListener('pagehide', enviarRapido);
    window.salvarNaNuvem = enviarRapido;

    const acoes = document.getElementById('acoes');
    if (acoes) {
      const b = document.createElement('button'); b.className = 'bt'; b.textContent = document.body.classList.contains('toque') ? '🚪' : 'Sair'; b.title = 'Sair da conta';
      b.onclick = async () => { await enviar(); await sb.auth.signOut(); location.href = RAIZ; };
      acoes.appendChild(b);
    }
  })();
})();
