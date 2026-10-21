// Tour automático de ~1 minuto para gravar vídeos de divulgação.
// Abre com ?tour na URL: o jogo começa sozinho no modo demonstração e joga por conta própria.
(function () {
  if (!/[?&]tour\b/.test(location.search)) return;
  const $ = id => document.getElementById(id);
  const espera = ms => new Promise(r => setTimeout(r, ms));
  const aguardar = async (cond, max = 8000) => { const t0 = Date.now(); while (!cond() && Date.now() - t0 < max) await espera(80); return cond(); };
  const clicar = async (sel, antes = 700) => { const b = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!b) return false; await espera(antes); b.click(); return true; };
  const X = () => window.EXP;
  // o tour começa sempre do zero e não grava nada: a conta de quem grava o vídeo não muda
  if (window.EstadoVida) { EstadoVida.carregar = () => null; EstadoVida.salvar = () => { }; }
  window.salvarNaNuvem = () => { };

  // anda até um ponto: gira a câmera suavemente para trás do avatar e segura W
  async function andar(alvo, max = 6000) {
    const { jog, camCtl, teclas } = X(), t0 = Date.now();
    teclas.w = true;
    while (Date.now() - t0 < max) {
      const dx = alvo.x - jog.x, dz = alvo.z - jog.z;
      if (Math.hypot(dx, dz) < 2.2) break;
      const yaw = Math.atan2(-dx, -dz); let d = yaw - camCtl.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
      camCtl.yaw += d * .12;
      await espera(40);
    }
    teclas.w = false;
  }
  const maisPerto = (lista, f = () => true) => { const { jog } = X(); return lista.filter(f).sort((a, b) => Math.hypot(a.x - jog.x, a.z - jog.z) - Math.hypot(b.x - jog.x, b.z - jog.z))[0]; };
  const ilhaDoJogador = () => { const { jog, ILHAS } = X(); return ILHAS.reduce((m, il) => Math.hypot(jog.x - il.cx, jog.z - il.cz) < Math.hypot(jog.x - m.cx, jog.z - m.cz) ? il : m).i; };

  // responde o desafio da estação (acerta quase tudo, erra uma vez para mostrar a explicação)
  async function missao(e, errar = -1, ajuda = '') {
    await X().abrirEstacao(e);
    if (!await aguardar(() => $('aceitar'))) return;
    await espera(2000); $('aceitar').click();
    for (let k = 0; k < 3; k++) {
      if (!await aguardar(() => document.querySelector('.alt:not([disabled])'))) break;
      await espera(1500);
      if (k === 0 && ajuda && $(ajuda) && !$(ajuda).disabled) { $(ajuda).click(); await espera(1300); }
      const alts = [...document.querySelectorAll('.alt:not(.eliminada)')], q = X().questaoAtual;
      const certa = alts.find(b => q && +b.dataset.n === q.correta);
      ((k === errar ? alts.find(b => b !== certa) : certa) || alts[0]).click();
      await aguardar(() => $('prox')); await espera(1800); $('prox').click();
    }
    if (await aguardar(() => $('ok'))) { await espera(2200); $('ok').click(); }
    await espera(1500);
  }

  async function tour() {
    await aguardar(() => $('btNovo') && X());
    $('nome').value = 'Evonauta'; $('demo').checked = true;
    await espera(1800);
    ($('btCont') && !$('btCont').classList.contains('oculto') ? $('btCont') : $('btNovo')).click();
    await aguardar(() => X().emJogo); await espera(2500);
    const est = X().est; est.cristais = Math.max(est.cristais || 0, 40);

    // 1) explorar a primeira ilha e pegar um biocristal
    const ilha0 = ilhaDoJogador();
    const orbe = maisPerto(X().ORBES, o => o.ilha === ilha0 && o.mesh);
    if (orbe) await andar(orbe, 5000);
    await espera(600);

    // 2) primeira missão: 3 perguntas, uma errada para mostrar a explicação
    const e1 = maisPerto(X().ESTACOES, e => e.ilha === ilha0 && e.pronto && !e.premium);
    if (e1) { await andar(e1, 5000); await missao(e1, 1); }

    // 3) evoluir o avatar
    $('dmXp').click(); await espera(3500);
    if (!$('veu').classList.contains('oculto')) { const b = document.querySelector('#painel .bt'); if (b) b.click(); }
    await espera(800);

    // 4) teletransporte, sonda e fragmento de memória
    $('dmTele').click(); await espera(2200);
    X().usarSonda(); await espera(1800);
    const il1 = ilhaDoJogador(), frag = maisPerto(X().FRAGS, f => f.ilha === il1);
    if (frag) {
      await andar(frag, 3500);
      if ($('veu').classList.contains('oculto')) await X().abrirFragmento(frag);
      if (await aguardar(() => $('fc'))) { await espera(2200); $('fc').click(); await espera(2800); $('lem') && $('lem').click(); }
    }
    await espera(1000);

    // 5) mais uma ilha, missão com a mensagem do futuro
    $('dmTele').click(); await espera(2000);
    const e2 = maisPerto(X().ESTACOES, e => e.ilha === ilhaDoJogador() && e.pronto && !e.premium);
    if (e2) { await andar(e2, 4000); await missao(e2, -1, 'usarMsg'); }

    // 6) mapa e despedida
    X().abrirMapa(); await espera(3000); X().fecharMapa();
    X().camCtl.alvoDist = 26; for (let k = 0; k < 60; k++) { X().camCtl.yaw += .03; await espera(50); }
    console.log('tour concluído');
  }
  addEventListener('load', () => tour().catch(err => console.error('tour', err)));
})();
