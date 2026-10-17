// Avatar 2D compartilhado (retratos do HUD, página de aulas e versão leve do mundo).
'use strict';
(function () {
const FORMAS = [
  { nome: 'Bactéria', cor: '#7cb342' }, { nome: 'Ameba (eucarionte)', cor: '#9575cd' },
  { nome: 'Água-viva', cor: '#4fc3f7' }, { nome: 'Peixe', cor: '#ff8a65' },
  { nome: 'Anfíbio', cor: '#66bb6a' }, { nome: 'Réptil', cor: '#8d6e63' },
  { nome: 'Ave', cor: '#ffca28' }, { nome: 'Evonauta cientista', cor: '#ffffff' },
];
function sombrear(hex, f) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

function desenharAvatar(g, x, y, forma, t, dir, escala, andando) {
  g.save(); g.translate(x, y); g.scale(dir * escala, escala);
  const bob = andando ? Math.sin(t * 12) * 1.5 : Math.sin(t * 2) * .8;
  g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(0, 12, 11, 4, 0, 0, 7); g.fill();
  g.translate(0, bob);
  const cor = FORMAS[forma].cor, esc2 = sombrear(cor, -.3);
  const olho = (ox, oy, r = 2.2) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(ox, oy, r + 1, 0, 7); g.fill(); g.fillStyle = '#222'; g.beginPath(); g.arc(ox + .6, oy, r * .6, 0, 7); g.fill(); };
  switch (forma) {
    case 0: // bactéria com flagelo
      g.strokeStyle = esc2; g.lineWidth = 2; g.beginPath(); g.moveTo(-10, 0);
      for (let k = 0; k <= 10; k++) g.lineTo(-10 - k * 1.4, Math.sin(t * 14 + k) * 3); g.stroke();
      g.fillStyle = cor; g.strokeStyle = esc2; g.beginPath(); g.roundRect(-10, -7, 22, 14, 7); g.fill(); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-6, -4, 12, 2); olho(6, -1); break;
    case 1: { // ameba
      g.fillStyle = cor; g.strokeStyle = esc2; g.lineWidth = 2; g.beginPath();
      for (let k = 0; k <= 16; k++) { const a = k / 16 * Math.PI * 2, rr = 11 + Math.sin(a * 3 + t * 4) * 2.5; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * .85); }
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#4527a0'; g.beginPath(); g.arc(-2, 1, 4, 0, 7); g.fill(); olho(5, -3); break; }
    case 2: // água-viva
      g.strokeStyle = sombrear(cor, -.1); g.lineWidth = 2;
      for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 3.5, 2); g.quadraticCurveTo(k * 3.5 + Math.sin(t * 6 + k) * 4, 9, k * 3.5, 15); g.stroke(); }
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 0, 12, 10, 0, Math.PI, 0); g.fill();
      g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.ellipse(-3, -5, 4, 2, 0, 0, 7); g.fill(); olho(4, -3); break;
    case 3: // peixe
      g.fillStyle = esc2; g.beginPath(); g.moveTo(-9, 0); g.lineTo(-17, -7 + Math.sin(t * 10) * 2); g.lineTo(-17, 7 + Math.sin(t * 10) * 2); g.fill();
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 0, 12, 7.5, 0, 0, 7); g.fill();
      g.fillStyle = esc2; g.beginPath(); g.moveTo(-2, -6); g.lineTo(4, -12); g.lineTo(6, -6); g.fill();
      g.strokeStyle = esc2; g.lineWidth = 1; g.beginPath(); g.arc(3, 0, 5, -1, 1); g.stroke(); olho(7, -2); break;
    case 4: { // anfíbio (sapo)
      const p = andando ? Math.sin(t * 12) * 3 : 0;
      g.fillStyle = esc2; g.fillRect(-11, 6 + p * .3, 7, 4); g.fillRect(4, 6 - p * .3, 7, 4);
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 1, 12, 9, 0, 0, 7); g.fill();
      g.fillStyle = sombrear(cor, .3); g.beginPath(); g.ellipse(0, 4, 7, 4, 0, 0, 7); g.fill();
      g.fillStyle = cor; g.beginPath(); g.arc(-5, -7, 4.5, 0, 7); g.arc(5, -7, 4.5, 0, 7); g.fill(); olho(-5, -7); olho(5, -7); break; }
    case 5: { // réptil
      const p = andando ? Math.sin(t * 14) * 3 : 0;
      g.strokeStyle = cor; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-8, 2); g.quadraticCurveTo(-16, 4 + p, -20, -2); g.stroke();
      g.strokeStyle = esc2; g.lineWidth = 3; [[-5, 1], [5, -1]].forEach(([dx, s]) => { g.beginPath(); g.moveTo(dx, 2); g.lineTo(dx + 3, 9 + p * s); g.stroke(); g.beginPath(); g.moveTo(dx, -2); g.lineTo(dx + 3, -8 - p * s); g.stroke(); });
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 0, 10, 5.5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(11, -1, 5.5, 4.5, 0, 0, 7); g.fill();
      g.fillStyle = esc2; for (let k = -2; k <= 1; k++) g.fillRect(k * 4, -5, 2, 2); olho(13, -3, 1.8); break; }
    case 6: { // ave
      const asa = Math.sin(t * (andando ? 16 : 4)) * 6;
      g.fillStyle = '#ff8f00'; g.fillRect(-3, 8, 2, 5); g.fillRect(2, 8, 2, 5);
      g.fillStyle = cor; g.beginPath(); g.ellipse(0, 0, 10, 9, 0, 0, 7); g.fill();
      g.fillStyle = esc2; g.beginPath(); g.moveTo(-2, -1); g.lineTo(-14, -4 - asa); g.lineTo(-6, 5); g.fill();
      g.fillStyle = '#ff8f00'; g.beginPath(); g.moveTo(9, -3); g.lineTo(16, -1); g.lineTo(9, 1); g.fill(); olho(5, -4); break; }
    default: { // explorador(a) cientista
      const p = andando ? Math.sin(t * 12) * 3 : 0;
      g.fillStyle = '#37474f'; g.fillRect(-5, 6, 4, 8 + p * .5); g.fillRect(1, 6, 4, 8 - p * .5);
      g.fillStyle = '#6d4c2f'; g.fillRect(-11, -8, 6, 12);
      g.fillStyle = '#fafafa'; g.strokeStyle = '#cfd8dc'; g.lineWidth = 1; g.beginPath(); g.roundRect(-7, -9, 14, 17, 3); g.fill(); g.stroke();
      g.fillStyle = '#2E7D32'; g.fillRect(-1, -9, 2, 17);
      g.fillStyle = '#f1c8a5'; g.beginPath(); g.arc(0, -15, 6.5, 0, 7); g.fill();
      g.fillStyle = '#3e2723'; g.beginPath(); g.arc(0, -17, 6.5, Math.PI, 0); g.fill();
      g.fillStyle = '#8d6e4a'; g.fillRect(-9, -21, 18, 3); g.fillRect(-5, -25, 10, 5);
      g.fillStyle = '#222'; g.beginPath(); g.arc(2.5, -15, 1.2, 0, 7); g.fill();
      g.strokeStyle = '#90a4ae'; g.lineWidth = 2; g.beginPath(); g.moveTo(7, -2); g.lineTo(11, -6 - p * .5); g.stroke();
      g.fillStyle = 'rgba(144,202,249,.8)'; g.beginPath(); g.arc(12, -8 - p * .5, 3, 0, 7); g.fill(); }
  }
  g.restore();
}


const nivelDe = xp => { let n = 1; while (50 * n * (n + 1) <= xp) n++; return n; };
const formaDe = nivel => Math.min(FORMAS.length - 1, nivel - 1);
window.Avatar2D = { FORMAS, desenhar: desenharAvatar, nivelDe, formaDe, sombrear };
})();
