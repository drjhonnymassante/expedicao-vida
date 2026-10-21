// Cena da missão (p5.js): cada pergunta certa realiza uma etapa da missão diante do jogador,
// e a vitória restaura o cenário. As cenas são descritas em cenas.json (uma por tópico).
// Tipos de etapa: coletar, entregar, montar, ligar, encher, separar, transformar.
(function () {
  let carregando = null;
  function carregarP5() {
    if (window.p5) return Promise.resolve();
    return carregando ||= new Promise((ok, erro) => { const s = document.createElement('script'); s.src = '../vendor/p5.min.js'; s.onload = ok; s.onerror = erro; document.head.appendChild(s); });
  }
  const DUR = 1.7;                                   // segundos de animação de cada etapa
  const suave = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const sorteio = semente => () => (semente = (semente * 9301 + 49297) % 233280) / 233280;

  function criar(div, spec, premio) {
    const est = spec.etapas.map(() => ({ fase: 'antes', t: 0 }));
    let final = null, inst = null, vivo = true;
    const sk = p => {
      let W = 0, H = 0, confete = [];
      const emoji = (e, x, y, tam, alfa = 255, cinza = false) => {
        p.push(); p.textAlign(p.CENTER, p.CENTER); p.textSize(tam); p.fill(255, alfa);
        if (cinza) p.drawingContext.filter = 'grayscale(1) brightness(.75)';
        p.text(e, x, y); p.drawingContext.filter = 'none'; p.pop();
      };
      const rotulo = (s, x, y, tam = 10, cor = [220, 235, 255], alfa = 230) => { p.push(); p.noStroke(); p.fill(...cor, alfa); p.textAlign(p.CENTER, p.TOP); p.textSize(tam); p.textStyle(p.BOLD); p.text(s, x, y); p.pop(); };
      const brilho = (x, y, r, cor, alfa) => { p.push(); p.noStroke(); for (let k = 4; k > 0; k--) { p.fill(...cor, alfa / (k * 1.6)); p.circle(x, y, r * (1 + k * .35)); } p.pop(); };
      const tamanho = () => { W = div.clientWidth || 600; H = W < 480 ? 150 : 170; };
      p.setup = () => { tamanho(); p.createCanvas(W, H); p.textFont('Nunito, system-ui, sans-serif'); };
      p.windowResized = () => { tamanho(); p.resizeCanvas(W, H); };

      // desenha a coluna k da etapa no estado atual
      function etapa(k, b, cx, w, top, alt) {
        const s = est[k], t = s.fase === 'tocando' ? suave(Math.min(1, s.t / DUR)) : s.fase === 'feito' ? 1 : 0;
        const falhou = s.fase === 'falhou', cinza = s.fase === 'antes' || falhou;
        const itens = b.itens || [], n = itens.length, rnd = sorteio(k * 97 + 13), tam = Math.min(26, w / Math.max(4, n + 1.5));
        const espalhado = itens.map(() => [cx + (rnd() - .5) * w * .8, top + 8 + rnd() * alt * .45]);
        const tremor = falhou ? Math.sin(s.t * 40) * Math.max(0, 1 - s.t) * 3 : 0;
        const cy = top + alt / 2;
        if (b.tipo === 'coletar') {
          const bx = cx, by = top + alt - 16;
          emoji(b.recipiente || '🎒', bx, by, 26 + (s.fase === 'tocando' && t > .85 ? 6 * Math.sin((t - .85) * 20) : 0), 255, cinza);
          itens.forEach((e, i) => { const [x0, y0] = espalhado[i], d = Math.min(1, Math.max(0, t * 1.4 - i * .15)); const x = p.lerp(x0, bx, d), y = p.lerp(y0, by - 6, d) - Math.sin(d * Math.PI) * 18; if (d < 1) { if (!cinza) brilho(x, y, tam * .7, [255, 255, 200], 60); emoji(e, x + tremor, y, tam * (1 - d * .5), 255, cinza); } });
          if (t >= 1) rotulo(n + ' coletados', bx, by + 12, 9);
        } else if (b.tipo === 'entregar') {
          const alvos = b.alvos || [], m = alvos.length, passo = alt / (m + .2);
          alvos.forEach((a, i) => {
            const ay = top + passo * (i + .6), ax = cx + w * .22, ix = cx - w * .3, d = Math.min(1, Math.max(0, t * 1.5 - i * .25));
            const pronto = d >= 1;
            if (pronto) brilho(ax, ay, tam * 1.1, [124, 255, 178], 70);
            emoji(pronto ? (b.depois || [])[i] || a : a, ax + (pronto ? 0 : tremor), ay, tam * 1.05, 255, cinza && !pronto);
            if (itens[i] && !pronto) emoji(itens[i], p.lerp(ix, ax - tam * .6, d), ay - Math.sin(d * Math.PI) * 14, tam * .8, 255, cinza);
          });
        } else if (b.tipo === 'montar') {
          const forma = b.forma || 'linha', slots = itens.map((_, i) => {
            if (forma === 'anel') { const a = -Math.PI / 2 + i / n * Math.PI * 2, r = Math.min(w, alt) * .3; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
            if (forma === 'coluna' || forma === 'escada') { const y = top + alt - 12 - i * (alt - 20) / Math.max(1, n - 1); return [cx + (forma === 'escada' ? (i / Math.max(1, n - 1) - .5) * w * .5 : 0), y]; }
            return [cx - w * .4 + (i + .5) * w * .8 / n, cy];
          });
          if (t >= 1) { p.push(); p.stroke(124, 255, 178, 160); p.strokeWeight(2); p.noFill(); p.beginShape(); slots.forEach(([x, y]) => p.vertex(x, y)); if (forma === 'anel') p.endShape(p.CLOSE); else p.endShape(); p.pop(); }
          slots.forEach(([x, y]) => { p.push(); p.noFill(); p.stroke(255, 60); p.strokeWeight(1); p.drawingContext.setLineDash([3, 3]); p.circle(x, y, tam * 1.15); p.pop(); });
          itens.forEach((e, i) => { const d = Math.min(1, Math.max(0, t * 1.5 - i * .5 / n)); const [x0, y0] = espalhado[i], [x1, y1] = slots[i]; emoji(e, p.lerp(x0, x1, d) + tremor, p.lerp(y0 + alt * .3, y1, d), tam * .9, 255, cinza); });
        } else if (b.tipo === 'ligar') {
          const pos = itens.map((_, i) => [cx - w * .4 + (i + .5) * w * .8 / n, cy + (i % 2 ? -alt * .16 : alt * .16)]);
          const seg = t * (n - 1);
          p.push(); p.strokeWeight(3);
          for (let i = 0; i < n - 1; i++) { const f = Math.min(1, Math.max(0, seg - i)); if (f <= 0) continue; const [x0, y0] = pos[i], [x1, y1] = pos[i + 1]; p.stroke(124, 255, 178, 200); p.line(x0, y0, p.lerp(x0, x1, f), p.lerp(y0, y1, f)); }
          p.pop();
          if (t >= 1) { const fl = (p.millis() / 900) % 1; for (let i = 0; i < n - 1; i++) { const [x0, y0] = pos[i], [x1, y1] = pos[i + 1]; for (const o of [0, .5]) { const f = (fl + o) % 1; p.noStroke(); p.fill(255, 240, 150); p.circle(p.lerp(x0, x1, f), p.lerp(y0, y1, f), 5); } } }
          itens.forEach((e, i) => emoji(e, pos[i][0] + tremor, pos[i][1], tam, 255, cinza && !(seg >= i)));
        } else if (b.tipo === 'encher') {
          const vw = Math.min(w * .42, 70), vh = alt * .78, vx = cx - vw / 2, vy = top + (alt - vh) / 2, cor = p.color(b.cor || '#4fc3f7');
          p.push(); p.noFill(); p.stroke(255, 150); p.strokeWeight(2); p.rect(vx, vy, vw, vh, 6, 6, 12, 12);
          const nivel = vh * .92 * t; cor.setAlpha(190); p.noStroke(); p.fill(cor); p.rect(vx + 2, vy + vh - 2 - nivel, vw - 4, nivel, 0, 0, 10, 10);
          if (t > 0) { const rr = sorteio(k + 5); for (let i = 0; i < 8; i++) { const by = vy + vh - ((p.millis() / 14 + rr() * 400) % Math.max(1, nivel)); p.fill(255, 120); p.circle(vx + 6 + rr() * (vw - 12), by, 3 + rr() * 4); } }
          p.pop();
          itens.forEach((e, i) => { const d = Math.min(1, Math.max(0, t * 1.6 - i * .2)); emoji(e, p.lerp(espalhado[i][0], cx, d) + tremor, p.lerp(top + 4, vy + vh * .5, d), tam * (1 - d * .6), d < 1 ? 255 : 0, cinza); });
          if (b.icone) emoji(b.icone, vx + vw + 14, vy + 12, 18, 255, cinza);
        } else if (b.tipo === 'separar') {
          const grupos = b.grupos || [], g = grupos.length, bw = w * .9 / g, by = top + alt - 30;
          grupos.forEach((gr, j) => { const x = cx - w * .45 + bw * j; p.push(); p.noFill(); p.stroke(255, 90); p.rect(x + 3, by, bw - 6, 28, 6); p.pop(); rotulo(gr, x + bw / 2, by + 30, 9); });
          const cont = grupos.map(() => 0);
          itens.forEach((e, i) => { const j = (b.destino || [])[i] || 0, c = cont[j]++, x1 = cx - w * .45 + bw * (j + .5) + (c - 1) * tam * .55, y1 = by + 14, d = Math.min(1, Math.max(0, t * 1.5 - i * .1)); const x0 = cx - w * .35 + (i + .5) * w * .7 / n; emoji(e, p.lerp(x0, x1, d) + tremor, p.lerp(top + 14, y1, d) - Math.sin(d * Math.PI) * 10, tam * (1 - d * .3), 255, cinza); });
        } else {   // transformar
          if (t > 0 && t < 1) for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, r = t * 40; p.noStroke(); p.fill(255, 230, 120, 255 * (1 - t)); p.circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5); }
          if (t >= 1) brilho(cx, cy, 40, [124, 255, 178], 60);
          emoji(t < .5 ? b.antes : b.depois, cx + tremor, cy - 4, 38 * (t > 0 && t < 1 ? 1 + Math.sin(t * Math.PI) * .25 : 1), 255, cinza);
        }
        // legenda e selo
        const selo = s.fase === 'feito' ? '✓ ' : falhou ? '✗ ' : s.fase === 'tocando' ? '' : (k + 1) + '. ';
        rotulo(selo + (b.r || ''), cx, top + alt + 6, W < 480 ? 9 : 10.5, falhou ? [255, 150, 150] : s.fase === 'feito' ? [124, 255, 178] : [200, 210, 230]);
      }

      p.draw = () => {
        if (!vivo) return;
        const dt = Math.min(.05, p.deltaTime / 1000);
        for (const s of est) if (s.fase === 'tocando' || s.fase === 'falhou') { s.t += dt; if (s.fase === 'tocando' && s.t >= DUR) s.fase = 'feito'; }
        const feitos = est.filter(s => s.fase === 'feito').length / est.length, cor = final && final.venceu ? 1 : feitos * .6;
        const [c1, c2] = (spec.fundo || ['#22324a', '#0f1a2b']).map(c => p.color(c));
        for (let y = 0; y < H; y += 4) { const c = p.lerpColor(c1, c2, y / H); p.noStroke(); p.fill(c); p.rect(0, y, W, 4); }
        // véu cinza que vai sumindo conforme a missão avança
        p.noStroke(); p.fill(20, 24, 34, 150 * (1 - cor)); p.rect(0, 0, W, H);
        if (spec.chao) { const ch = p.color(spec.chao); ch.setAlpha(110 + 100 * cor); p.fill(ch); p.rect(0, H - 34, W, 34); }
        const m = spec.etapas.length, w = W / m, top = 10, alt = H - 44;
        spec.etapas.forEach((b, k) => { if (k) { p.stroke(255, 30); p.line(w * k, 12, w * k, H - 12); p.noStroke(); } etapa(k, b, w * (k + .5), w - 10, top, alt); });
        if (final) {
          final.t += dt;
          if (final.venceu) {
            if (confete.length < 90 && final.t < 1.2) for (let i = 0; i < 4; i++) confete.push({ x: Math.random() * W, y: -10, vy: 60 + Math.random() * 90, vx: (Math.random() - .5) * 40, c: ['#FFD166', '#7CFFB2', '#FF8FAB', '#6EC8FF', '#B388FF'][i % 5], r: Math.random() * 6 });
            for (const c of confete) { c.y += c.vy * dt; c.x += c.vx * dt; c.r += dt * 5; p.push(); p.translate(c.x, c.y); p.rotate(c.r); p.noStroke(); p.fill(c.c); p.rect(-3, -1.5, 6, 3); p.pop(); }
            const a = Math.min(1, final.t / .6), esc = 1 + .3 * Math.max(0, 1 - final.t / .5);
            p.fill(10, 16, 28, 150 * a); p.rect(0, H * .5 - 34, W, 68);
            brilho(W / 2 - Math.min(W * .3, 150), H / 2, 44, [255, 209, 102], 80 * a);
            emoji(spec.final && spec.final.e || '🏆', W / 2 - Math.min(W * .3, 150), H / 2, 34 * esc, 255 * a);
            p.push(); p.textAlign(p.LEFT, p.CENTER); p.fill(255, 255 * a); p.textStyle(p.BOLD); p.textSize(W < 480 ? 12 : 15);
            p.text((spec.final && spec.final.texto) || 'Missão concluída!', W / 2 - Math.min(W * .3, 150) + 30, H / 2 - 9, Math.min(W * .6, 330));
            p.fill(255, 209, 102, 255 * a); p.textSize(W < 480 ? 10 : 11.5); p.text(premio ? '🎒 ' + premio : '', W / 2 - Math.min(W * .3, 150) + 30, H / 2 + 14); p.pop();
          }
        }
      };
    };
    const pronto = carregarP5().then(() => { if (vivo) inst = new window.p5(sk, div); }).catch(() => { div.remove(); });
    return {
      pronto,
      etapa(k, ok) { if (est[k]) est[k] = { fase: ok ? 'tocando' : 'falhou', t: 0 }; },
      final(venceu) { final = { venceu, t: 0 }; },
      destruir() { vivo = false; if (inst) inst.remove(); }
    };
  }
  window.CenaMissao = { criar, carregarP5 };
})();
