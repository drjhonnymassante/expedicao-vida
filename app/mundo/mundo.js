// Expedição Vida — protótipo de mundo aberto 2D (Canvas, sem dependências).
// Lê ../../content/curriculo.json; cada unidade vira uma região, cada tópico uma estação com NPC e missão.
'use strict';

const BASE = '../../content/';
const TS = 32, RW = 28, RH = 20, COLS = 7;
const HUB = { x: 14, y: 10 };
const SOLIDOS = new Set([3, 4, 5]);           // água, decoração sólida, borda
const T = { CHAO: 0, CHAO2: 1, TRILHA: 2, AGUA: 3, DECOR: 4, BORDA: 5, PORTAO: 6, PONTE: 7, PRACA: 8 };

const FORMAS = [
  { nome: 'Bactéria', cor: '#7cb342' }, { nome: 'Ameba (eucarionte)', cor: '#9575cd' },
  { nome: 'Água-viva', cor: '#4fc3f7' }, { nome: 'Peixe', cor: '#ff8a65' },
  { nome: 'Anfíbio', cor: '#66bb6a' }, { nome: 'Réptil', cor: '#8d6e63' },
  { nome: 'Ave', cor: '#ffca28' }, { nome: 'Evonauta cientista', cor: '#ffffff' },
];

// Temas visuais por unidade: chão, borda, decoração, folhagem, água, densidade de decoração e de lagos.
const TEMAS = {
  'u01-origem-da-vida':            { chao: ['#5d8a7f', '#527d72'], borda: '#3b4a4f', dec: ['rocha', 'fumarola', 'estromatolito'], folha: '#2e7d6b', agua: '#2b6f8f', denso: .08, lago: .58 },
  'u02-bioquimica':                { chao: ['#8a8f99', '#7d828c'], borda: '#4a4e57', dec: ['cristal', 'rocha', 'cristal'], cristal: '#4dd0e1', agua: '#3f6f9a', denso: .10, lago: .74 },
  'u03-citologia':                 { chao: ['#cfe8c8', '#c2deba'], borda: '#6d9f71', dec: ['bolha', 'arbusto', 'bolha'], folha: '#66bb6a', agua: '#4fa8d8', denso: .07, lago: .5 },
  'u04-metabolismo-energetico':    { chao: ['#d9c46a', '#cdb85f'], borda: '#8a7a2c', dec: ['painel', 'arvore', 'rocha'], folha: '#7cb342', agua: '#3d8fb5', denso: .08, lago: .72 },
  'u05-nucleo-sintese-proteica':   { chao: ['#9b86c4', '#8e79b8'], borda: '#4e3d78', dec: ['torre', 'cristal', 'arbusto'], cristal: '#f48fb1', folha: '#7e57c2', agua: '#5c6bc0', denso: .07, lago: .74 },
  'u06-divisao-celular':           { chao: ['#bfe3ef', '#b2d8e6'], borda: '#5f8fa3', dec: ['cristal', 'bolha', 'rocha'], cristal: '#b3e5fc', agua: '#4a90c2', denso: .08, lago: .66 },
  'u07-reproducao-embriologia':    { chao: ['#7fb06a', '#73a35f'], borda: '#3f6b35', dec: ['arvore', 'ninho', 'flor', 'arvore'], folha: '#388e3c', agua: '#3b86b0', denso: .14, lago: .7 },
  'u08-histologia-animal':         { chao: ['#e3cfb0', '#d8c3a3'], borda: '#8d6e52', dec: ['casa', 'arbusto', 'flor'], folha: '#8bc34a', agua: '#4a8fbf', denso: .07, lago: .78 },
  'u09-classificacao-sistematica': { chao: ['#6f9e58', '#64924f'], borda: '#3b5e2c', dec: ['arvore', 'arvore', 'pinheiro'], folha: '#2e7d32', agua: '#3b86b0', denso: .17, lago: .76 },
  'u10-virus':                     { chao: ['#a98f8f', '#9c8282'], borda: '#5d4545', dec: ['ruina', 'rocha', 'cristal'], cristal: '#ef5350', agua: '#5a7a96', denso: .09, lago: .76 },
  'u11-procariontes':              { chao: ['#b99a6b', '#ad8e60'], borda: '#6b5232', dec: ['estromatolito', 'rocha', 'arbusto'], folha: '#9e9d24', agua: '#3f88a8', denso: .09, lago: .6 },
  'u12-protistas-fungos':          { chao: ['#557a4b', '#4b6e42'], borda: '#2f4a2a', dec: ['cogumelo', 'arbusto', 'cogumelo', 'arvore'], folha: '#33691e', agua: '#466f6a', denso: .14, lago: .56 },
  'u13-parasitologia':             { chao: ['#6f6a80', '#655f75'], borda: '#3a3548', dec: ['cogumelo', 'arvore', 'rocha'], folha: '#4a4f3a', agua: '#4f5f63', denso: .12, lago: .52 },
  'u14-botanica-diversidade':      { chao: ['#8cc56d', '#80b862'], borda: '#4b7a36', dec: ['flor', 'pinheiro', 'arvore', 'flor', 'samambaia'], folha: '#43a047', agua: '#3b9bc4', denso: .14, lago: .74 },
  'u15-botanica-fisiologia':       { chao: ['#5f9a4e', '#558d45'], borda: '#2f5a26', dec: ['arvore', 'arvore', 'samambaia'], folha: '#1b5e20', agua: '#3b86b0', denso: .19, lago: .78 },
  'u16-invertebrados':             { chao: ['#ecd9a8', '#e2cd99'], borda: '#a38b52', dec: ['coral', 'concha', 'coral', 'rocha'], agua: '#26a6c9', denso: .1, lago: .46 },
  'u17-vertebrados':               { chao: ['#a7c46b', '#9bb860'], borda: '#5f7a34', dec: ['arvore', 'rocha', 'arbusto'], folha: '#558b2f', agua: '#3b92bd', denso: .09, lago: .62 },
  'u18-fisiologia-humana-manutencao': { chao: ['#e9b7b7', '#e0a9a9'], borda: '#a05a5a', dec: ['celula', 'bolha', 'celula'], agua: '#c45b6a', denso: .09, lago: .7 },
  'u19-fisiologia-humana-controle': { chao: ['#d9dfe6', '#cbd3dc'], borda: '#6d7885', dec: ['pinheiro', 'rocha', 'pinheiro'], folha: '#2e5e4e', neve: true, agua: '#5c8fb8', denso: .12, lago: .78 },
  'u20-saude-bem-estar':           { chao: ['#a5cf7f', '#99c374'], borda: '#5d8a3e', dec: ['casa', 'arvore', 'flor', 'casa'], folha: '#43a047', agua: '#4aa0cf', denso: .08, lago: .76 },
  'u21-genetica-mendeliana':       { chao: ['#b6d68e', '#aacb82'], borda: '#6e8f4a', dec: ['ervilha', 'flor', 'arvore'], folha: '#689f38', agua: '#4a9cc8', denso: .12, lago: .78 },
  'u22-genetica-pos-mendeliana':   { chao: ['#8fbf7a', '#84b36f'], borda: '#3c6a2e', dec: ['sebe', 'sebe', 'flor'], folha: '#2e7d32', agua: '#3b86b0', denso: .2, lago: .82 },
  'u23-biotecnologia-bioetica':    { chao: ['#b9d8e0', '#acccd5'], borda: '#4f7380', dec: ['torre', 'painel', 'casa'], cristal: '#26c6da', agua: '#3a8fb8', denso: .07, lago: .78 },
  'u24-evolucao':                  { chao: ['#e6d29c', '#dbc68f'], borda: '#6b5a3a', dec: ['palmeira', 'rocha', 'cacto'], folha: '#558b2f', agua: '#1ea0c8', denso: .08, lago: .5 },
  'u25-ecologia-energia-populacoes': { chao: ['#d6c470', '#cab865'], borda: '#7a6a2c', dec: ['acacia', 'arbusto', 'rocha'], folha: '#827717', agua: '#3d8fb5', denso: .08, lago: .74 },
  'u26-ecologia-biomas-ambiente':  { chao: ['#7fae5e', '#c9b46a'], borda: '#4a6a33', dec: ['arvore', 'cacto', 'palmeira', 'acacia'], folha: '#2e7d32', agua: '#3b8fbd', denso: .12, lago: .7 },
};
const TEMA_PADRAO = TEMAS['u17-vertebrados'];

// ---------- utilidades ----------
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function ruido(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nivelDe = xp => { let n = 1; while (50 * n * (n + 1) <= xp) n++; return n; };
const formaDe = nivel => Math.min(FORMAS.length - 1, nivel - 1);
function sombrear(hex, f) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const m = v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}
function gradePos(i) { const row = Math.floor(i / COLS); let col = i % COLS; if (row % 2 === 1) col = COLS - 1 - col; return { col, row }; }

// ---------- estado ----------
let CUR = null, REG = [], ESTACOES = [], LINHAS = 0;
let est = null;                 // progresso salvo
const jog = { x: 0, y: 0, dir: 1, andando: false, alvo: null, autoFalar: null };
const cam = { x: 0, y: 0 };
const teclas = {};
let particulas = [], regiaoAtual = -1, pausado = false, demo = false, tempo = 0;
const cacheJson = {};

function salvar() { try { est.pos = { x: jog.x, y: jog.y }; localStorage.setItem('expedicao_vida', JSON.stringify(est)); } catch { } }
function carregarSalvo() { try { return JSON.parse(localStorage.getItem('expedicao_vida')); } catch { return null; } }

// ---------- geração do mundo ----------
function gerarRegioes() {
  REG = CUR.unidades.map((u, i) => {
    const g = gradePos(i);
    return { i, u, tema: TEMAS[u.id] || TEMA_PADRAO, col: g.col, row: g.row, ox: g.col * RW, oy: g.row * RH, tiles: null, canvas: null, portoes: {}, estacoes: [] };
  });
  LINHAS = Math.max(...REG.map(r => r.row)) + 1;
  for (const r of REG) gerarTiles(r);
}

function gerarTiles(r) {
  const { tema } = r, s = r.i * 97 + 13, t = new Uint8Array(RW * RH), deco = {}, base = new Uint8Array(RW * RH);
  const R = rng(s * 31 + 7);
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
    let v = ruido(x * .2, y * .2, s) > .52 ? T.CHAO2 : T.CHAO; base[y * RW + x] = v === T.CHAO2 ? 1 : 0;
    if (ruido(x * .13 + 40, y * .13 + 40, s + 5) > tema.lago) v = T.AGUA;
    if (x === 0 || y === 0 || x === RW - 1 || y === RH - 1) v = T.BORDA;
    t[y * RW + x] = v;
  }
  const set = (x, y, v) => { if (x > 0 && y > 0 && x < RW - 1 && y < RH - 1) t[y * RW + x] = (v === T.TRILHA && t[y * RW + x] === T.AGUA) ? T.PONTE : v; };
  const caminho = (x0, y0, x1, y1) => {   // trilha em L com 2 tiles de largura
    const sx = Math.sign(x1 - x0) || 1, sy = Math.sign(y1 - y0) || 1;
    for (let x = x0; x !== x1 + sx; x += sx) { set(x, y0, T.TRILHA); set(x, y0 + 1, T.TRILHA); }
    for (let y = y0; y !== y1 + sy; y += sy) { set(x1, y, T.TRILHA); set(x1 + 1, y, T.TRILHA); }
  };
  // portões para as regiões vizinhas na ordem da expedição
  for (const vz of [r.i - 1, r.i + 1]) {
    const b = REG[vz]; if (!b) continue;
    const dx = b.col - r.col, dy = b.row - r.row;
    let cel = [];
    if (dx === 1) cel = [[RW - 1, 9], [RW - 1, 10]]; else if (dx === -1) cel = [[0, 9], [0, 10]];
    else if (dy === 1) cel = [[13, RH - 1], [14, RH - 1]]; else if (dy === -1) cel = [[13, 0], [14, 0]];
    for (const [x, y] of cel) { t[y * RW + x] = T.PORTAO; r.portoes[y * RW + x] = vz; }
    const [gx, gy] = cel[0];
    const ix = Math.min(RW - 2, Math.max(1, gx)), iy = Math.min(RH - 2, Math.max(1, gy));
    caminho(HUB.x, HUB.y, dx ? ix : 13, dy ? iy : 9);
  }
  // praça central
  for (let y = HUB.y - 3; y <= HUB.y + 3; y++) for (let x = HUB.x - 3; x <= HUB.x + 3; x++) if (Math.hypot(x - HUB.x, y - HUB.y) <= 2.6) set(x, y, T.PRACA);
  // estações (uma por tópico) em elipse ao redor da praça
  const n = r.u.topicos.length;
  r.u.topicos.forEach((tp, k) => {
    const a = -Math.PI / 2 + (k + .5) * 2 * Math.PI / n;
    const ex = Math.round(Math.min(RW - 4, Math.max(3, HUB.x + Math.cos(a) * 9.5)));
    const ey = Math.round(Math.min(RH - 4, Math.max(3, HUB.y + Math.sin(a) * 6.2)));
    caminho(HUB.x, HUB.y, ex, ey);
    for (let y = ey - 1; y <= ey + 1; y++) for (let x = ex - 1; x <= ex + 1; x++) set(x, y, T.PRACA);
    const e = { reg: r.i, topico: tp, x: (r.ox + ex) * TS + TS / 2, y: (r.oy + ey) * TS + TS / 2 - 4, pronto: tp.status === 'pronto', cor: `hsl(${Math.floor(hash(k, r.i, 3) * 360)},55%,45%)` };
    r.estacoes.push(e); ESTACOES.push(e);
  });
  // decoração (nunca colada nas trilhas)
  const livre = (x, y) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const v = t[(y + j) * RW + x + i]; if (v === T.TRILHA || v === T.PRACA || v === T.PONTE || v === T.PORTAO) return false; } return true; };
  for (let y = 1; y < RH - 1; y++) for (let x = 1; x < RW - 1; x++) {
    const v = t[y * RW + x];
    if ((v === T.CHAO || v === T.CHAO2) && livre(x, y) && R() < tema.denso) {
      const tipo = tema.dec[Math.floor(R() * tema.dec.length)];
      deco[y * RW + x] = tipo;
      if (tipo !== 'flor') t[y * RW + x] = T.DECOR;
    }
  }
  r.tiles = t; r.deco = deco; r.base = base;
}

// ---------- desenho estático das regiões (pré-renderizado sob demanda) ----------
function canvasRegiao(r) {
  if (r.canvas) return r.canvas;
  const c = document.createElement('canvas'); c.width = RW * TS; c.height = RH * TS;
  const g = c.getContext('2d'), tema = r.tema, s = r.i * 97 + 13;
  for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) {
    const v = r.tiles[y * RW + x], px = x * TS, py = y * TS, h = hash(x, y, s);
    const chao = tema.chao[r.base[y * RW + x]];
    g.fillStyle = chao; g.fillRect(px, py, TS, TS);
    for (let k = 0; k < 3; k++) { g.fillStyle = sombrear(chao, hash(x, y, s + k) > .5 ? .08 : -.08); g.fillRect(px + hash(x, y, k) * 28, py + hash(y, x, k) * 28, 3, 3); }
    if (v === T.AGUA) {
      g.fillStyle = tema.agua; g.fillRect(px, py, TS, TS);
      g.strokeStyle = sombrear(tema.agua, .25); g.lineWidth = 2;
      g.beginPath(); g.arc(px + 10 + h * 10, py + 14, 5, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    } else if (v === T.TRILHA || v === T.PORTAO) {
      g.fillStyle = '#c9b38a'; g.fillRect(px, py, TS, TS);
      g.fillStyle = '#b39c74'; for (let k = 0; k < 4; k++) g.fillRect(px + hash(x, y, 9 + k) * 26, py + hash(x, y, 20 + k) * 26, 6, 4);
    } else if (v === T.PRACA) {
      g.fillStyle = '#ddd3bd'; g.fillRect(px, py, TS, TS);
      g.strokeStyle = '#c4b89d'; g.lineWidth = 1; g.strokeRect(px + .5, py + .5, TS / 2, TS / 2); g.strokeRect(px + TS / 2 + .5, py + TS / 2 + .5, TS / 2 - 1, TS / 2 - 1);
    } else if (v === T.PONTE) {
      g.fillStyle = tema.agua; g.fillRect(px, py, TS, TS);
      g.fillStyle = '#9c7449'; g.fillRect(px + 2, py, TS - 4, TS);
      g.fillStyle = '#7d5a35'; for (let k = 0; k < 4; k++) g.fillRect(px + 2, py + k * 8 + 6, TS - 4, 2);
    } else if (v === T.BORDA) {
      g.fillStyle = tema.borda; g.fillRect(px, py, TS, TS);
      g.fillStyle = sombrear(tema.borda, .18); g.fillRect(px, py, TS, 6);
      g.fillStyle = sombrear(tema.borda, -.25); g.fillRect(px, py + TS - 5, TS, 5);
    }
    const d = r.deco[y * RW + x];
    if (d) desenharDecor(g, d, px + TS / 2, py + TS / 2, h, tema);
  }
  // placa da região na praça
  const px = HUB.x * TS + TS / 2, py = HUB.y * TS - 6;
  g.fillStyle = '#6d4c2f'; g.fillRect(px - 2, py, 4, 26);
  g.fillStyle = '#8d6e4a'; g.fillRect(px - 24, py - 14, 48, 18);
  g.fillStyle = '#fff3d6'; g.font = 'bold 9px system-ui'; g.textAlign = 'center'; g.fillText(`UNIDADE ${r.i + 1}`, px, py - 2);
  r.canvas = c; return c;
}

function desenharDecor(g, tipo, x, y, h, tema) {
  const folha = tema.folha || '#43a047';
  g.save();
  g.fillStyle = 'rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(x, y + 11, 11, 4, 0, 0, Math.PI * 2); g.fill();
  switch (tipo) {
    case 'arvore':
      g.fillStyle = '#6d4c2f'; g.fillRect(x - 3, y, 6, 13);
      [[0, -8, 11], [-7, -2, 8], [7, -2, 8]].forEach(([dx, dy, rr], k) => { g.fillStyle = sombrear(folha, k ? -.1 : .05); g.beginPath(); g.arc(x + dx, y + dy, rr, 0, 7); g.fill(); });
      g.fillStyle = sombrear(folha, .25); g.beginPath(); g.arc(x - 3, y - 11, 3, 0, 7); g.fill(); break;
    case 'pinheiro':
      g.fillStyle = '#5d4037'; g.fillRect(x - 2, y + 4, 4, 9);
      for (let k = 0; k < 3; k++) { g.fillStyle = sombrear(folha, -k * .08); g.beginPath(); g.moveTo(x, y - 16 + k * 7); g.lineTo(x - 12 + k * 2, y + 4 + k * 3); g.lineTo(x + 12 - k * 2, y + 4 + k * 3); g.fill(); }
      if (tema.neve) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x, y - 16); g.lineTo(x - 5, y - 8); g.lineTo(x + 5, y - 8); g.fill(); } break;
    case 'palmeira':
      g.strokeStyle = '#8d6e4a'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y + 12); g.quadraticCurveTo(x + 6, y, x + 2, y - 10); g.stroke();
      g.strokeStyle = folha; g.lineWidth = 3; for (let k = 0; k < 5; k++) { const a = -Math.PI + k * Math.PI / 4; g.beginPath(); g.moveTo(x + 2, y - 10); g.quadraticCurveTo(x + 2 + Math.cos(a) * 8, y - 18, x + 2 + Math.cos(a) * 14, y - 6 + Math.sin(a) * 2); g.stroke(); } break;
    case 'acacia':
      g.fillStyle = '#6d4c2f'; g.fillRect(x - 2, y - 4, 4, 16);
      g.fillStyle = folha; g.beginPath(); g.ellipse(x, y - 8, 15, 6, 0, 0, 7); g.fill(); break;
    case 'rocha':
      g.fillStyle = '#8a8f96'; g.beginPath(); g.ellipse(x, y + 4, 11, 8, 0, 0, 7); g.fill();
      g.fillStyle = '#a9aeb5'; g.beginPath(); g.ellipse(x - 3, y + 1, 5, 3, 0, 0, 7); g.fill(); break;
    case 'cristal': {
      const c = tema.cristal || '#80deea';
      [[-6, 4, 14], [0, 0, 20], [6, 5, 12]].forEach(([dx, dy, hh]) => { g.fillStyle = c; g.beginPath(); g.moveTo(x + dx, y + dy - hh); g.lineTo(x + dx + 4, y + dy); g.lineTo(x + dx, y + dy + 6); g.lineTo(x + dx - 4, y + dy); g.fill(); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(x + dx - 1, y + dy - hh + 4, 2, hh - 6); });
      break; }
    case 'fumarola':
      g.fillStyle = '#5b5f63'; g.beginPath(); g.moveTo(x - 10, y + 10); g.lineTo(x - 3, y - 4); g.lineTo(x + 3, y - 4); g.lineTo(x + 10, y + 10); g.fill();
      g.fillStyle = 'rgba(255,255,255,.55)'; [[0, -10, 5], [4, -17, 6], [-2, -24, 5]].forEach(([dx, dy, rr]) => { g.beginPath(); g.arc(x + dx, y + dy, rr, 0, 7); g.fill(); }); break;
    case 'estromatolito':
      for (let k = 0; k < 3; k++) { g.fillStyle = sombrear('#a1887f', -k * .12); g.beginPath(); g.ellipse(x, y + 6 - k * 5, 12 - k * 3, 6, 0, Math.PI, 0); g.fill(); } break;
    case 'bolha':
      g.fillStyle = 'rgba(255,255,255,.55)'; g.strokeStyle = 'rgba(80,140,90,.7)'; g.lineWidth = 2;
      g.beginPath(); g.arc(x, y, 10, 0, 7); g.fill(); g.stroke();
      g.fillStyle = 'rgba(126,87,194,.7)'; g.beginPath(); g.arc(x + 2, y + 1, 4, 0, 7); g.fill(); break;
    case 'arbusto':
      g.fillStyle = sombrear(folha, -.05); g.beginPath(); g.arc(x - 5, y + 3, 7, 0, 7); g.arc(x + 5, y + 3, 7, 0, 7); g.fill();
      g.fillStyle = sombrear(folha, .15); g.beginPath(); g.arc(x, y - 1, 7, 0, 7); g.fill(); break;
    case 'flor':
      for (let k = 0; k < 4; k++) { g.fillStyle = ['#f06292', '#ffd54f', '#ba68c8', '#fff'][Math.floor(hash(k, h * 99, 1) * 4)]; g.beginPath(); g.arc(x - 10 + hash(k, 1, h * 50) * 20, y - 6 + hash(k, 2, h * 50) * 16, 2.5, 0, 7); g.fill(); } break;
    case 'samambaia':
      g.strokeStyle = sombrear(folha, .1); g.lineWidth = 2;
      for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x, y + 10); g.quadraticCurveTo(x + k * 5, y - 6, x + k * 8, y - 2); g.stroke(); } break;
    case 'cogumelo':
      g.fillStyle = '#efe6d8'; g.fillRect(x - 3, y, 6, 10);
      g.fillStyle = h > .5 ? '#e53935' : '#8e24aa'; g.beginPath(); g.ellipse(x, y, 11, 7, 0, Math.PI, 0); g.fill();
      g.fillStyle = '#fff'; [[-5, -3], [2, -5], [5, -1]].forEach(([dx, dy]) => { g.beginPath(); g.arc(x + dx, y + dy, 1.6, 0, 7); g.fill(); }); break;
    case 'cacto':
      g.fillStyle = '#558b2f'; g.fillRect(x - 3, y - 12, 7, 24); g.fillRect(x - 10, y - 4, 5, 10); g.fillRect(x - 10, y - 4, 9, 4); g.fillRect(x + 6, y - 8, 5, 9); g.fillRect(x + 3, y - 2, 8, 4); break;
    case 'casa':
      g.fillStyle = '#f5ead7'; g.fillRect(x - 11, y - 4, 22, 16);
      g.fillStyle = h > .5 ? '#c0392b' : '#8e5a3c'; g.beginPath(); g.moveTo(x - 14, y - 3); g.lineTo(x, y - 15); g.lineTo(x + 14, y - 3); g.fill();
      g.fillStyle = '#6d4c2f'; g.fillRect(x - 3, y + 4, 6, 8); g.fillStyle = '#90caf9'; g.fillRect(x + 4, y, 5, 4); break;
    case 'torre':
      g.fillStyle = '#5c6bc0'; g.fillRect(x - 6, y - 16, 12, 28);
      for (let k = 0; k < 6; k++) { g.fillStyle = ['#f48fb1', '#80deea', '#fff59d', '#a5d6a7'][k % 4]; g.fillRect(x - 5 + Math.sin(k) * 2, y - 14 + k * 4.5, 10, 2); } break;
    case 'painel':
      g.fillStyle = '#455a64'; g.fillRect(x - 1, y, 3, 12);
      g.fillStyle = '#1e88e5'; g.beginPath(); g.moveTo(x - 12, y + 2); g.lineTo(x - 8, y - 10); g.lineTo(x + 12, y - 10); g.lineTo(x + 8, y + 2); g.fill();
      g.strokeStyle = '#90caf9'; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 2, y - 10); g.lineTo(x - 4, y + 2); g.moveTo(x + 4, y - 10); g.lineTo(x + 2, y + 2); g.stroke(); break;
    case 'coral':
      g.strokeStyle = h > .5 ? '#ff7043' : '#ec407a'; g.lineWidth = 3;
      [[-6, -10], [0, -14], [6, -9]].forEach(([dx, dy]) => { g.beginPath(); g.moveTo(x, y + 10); g.quadraticCurveTo(x + dx / 2, y, x + dx, y + dy); g.stroke(); }); break;
    case 'concha':
      g.fillStyle = '#ffccbc'; g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x - 9, y + 6); g.lineTo(x + 9, y + 6); g.fill();
      g.strokeStyle = '#d7a99a'; g.lineWidth = 1; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + k * 4, y + 6); g.stroke(); } break;
    case 'celula':
      g.fillStyle = '#d32f2f'; g.beginPath(); g.ellipse(x, y + 2, 10, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#ef9a9a'; g.beginPath(); g.ellipse(x, y + 2, 4, 2.5, 0, 0, 7); g.fill(); break;
    case 'ervilha':
      g.strokeStyle = '#558b2f'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y + 12); g.lineTo(x, y - 12); g.stroke();
      [[-5, -6, '#9ccc65'], [5, 0, '#cddc39'], [-5, 6, '#9ccc65']].forEach(([dx, dy, c]) => { g.fillStyle = c; g.beginPath(); g.arc(x + dx, y + dy, 4, 0, 7); g.fill(); }); break;
    case 'sebe':
      g.fillStyle = sombrear(folha, -.1); g.fillRect(x - 15, y - 12, 30, 24);
      g.fillStyle = sombrear(folha, .1); g.fillRect(x - 15, y - 12, 30, 6); break;
    case 'ninho':
      g.fillStyle = '#8d6e4a'; g.beginPath(); g.ellipse(x, y + 4, 12, 6, 0, 0, 7); g.fill();
      g.fillStyle = '#f5f0e6'; [[-4, 0], [2, -1], [7, 1]].forEach(([dx, dy]) => { g.beginPath(); g.ellipse(x + dx - 1, y + dy, 3, 4, 0, 0, 7); g.fill(); }); break;
    case 'ruina':
      g.fillStyle = '#9e9e9e'; g.fillRect(x - 10, y - 10, 6, 22); g.fillRect(x + 4, y - 4, 6, 16); g.fillRect(x - 10, y - 12, 20, 4);
      g.fillStyle = '#bdbdbd'; g.fillRect(x - 10, y - 12, 20, 2); break;
  }
  g.restore();
}

// ---------- avatar (8 formas evolutivas) ----------
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

function desenharNPC(g, e, t, perto) {
  const x = e.x, y = e.y + Math.sin(t * 2 + e.x) * 1;
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(x, y + 13, 10, 4, 0, 0, 7); g.fill();
  if (!e.pronto) {   // estação em construção
    g.fillStyle = '#6d4c2f'; g.fillRect(x - 2, y - 4, 4, 17);
    g.fillStyle = '#ffca28'; g.fillRect(x - 14, y - 16, 28, 14);
    g.fillStyle = '#212121'; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 14 + k * 8, y - 2); g.lineTo(x - 8 + k * 8, y - 16); g.lineTo(x - 4 + k * 8, y - 16); g.lineTo(x - 10 + k * 8, y - 2); g.fill(); }
    return;
  }
  g.fillStyle = e.cor; g.beginPath(); g.moveTo(x - 9, y + 12); g.lineTo(x - 6, y - 4); g.lineTo(x + 6, y - 4); g.lineTo(x + 9, y + 12); g.fill();
  g.fillStyle = '#f1c8a5'; g.beginPath(); g.arc(x, y - 9, 6, 0, 7); g.fill();
  g.fillStyle = sombrear('#5d4037', 0); g.beginPath(); g.arc(x, y - 11, 6, Math.PI, 0); g.fill();
  const feito = est.feitas[e.topico.id];
  const by = y - 28 + Math.sin(t * 4) * 2;
  g.fillStyle = feito ? '#43a047' : '#ffca28'; g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.arc(x, by, 8, 0, 7); g.fill(); g.stroke();
  g.fillStyle = feito ? '#fff' : '#3e2723'; g.font = 'bold 12px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(feito ? '✓' : '!', x, by + 1);
  if (perto) rotulo(g, x, y - 44, e.topico.titulo);
}
function rotulo(g, x, y, txt) {
  g.font = '600 12px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const w = Math.min(260, g.measureText(txt).width + 16);
  g.fillStyle = 'rgba(0,0,0,.72)'; g.beginPath(); g.roundRect(x - w / 2, y - 11, w, 22, 11); g.fill();
  g.fillStyle = '#fff'; g.fillText(txt.length > 40 ? txt.slice(0, 38) + '…' : txt, x, y + 1);
}

// ---------- regras: desbloqueio, colisão ----------
function regiaoEm(tx, ty) { const col = Math.floor(tx / RW), row = Math.floor(ty / RH); return REG.find(r => r.col === col && r.row === row); }
function precisa(r) { return Math.min(2, r.estacoes.filter(e => e.pronto).length); }
function feitasNa(r) { return r.estacoes.filter(e => est.feitas[e.topico.id]).length; }
function solido(px, py) {
  const tx = Math.floor(px / TS), ty = Math.floor(py / TS), r = regiaoEm(tx, ty);
  if (!r || !est.livres[r.i]) return true;
  const lx = tx - r.ox, ly = ty - r.oy, v = r.tiles[ly * RW + lx];
  if (v === T.PORTAO) { const vz = r.portoes[ly * RW + lx]; return !(est.livres[vz] && est.livres[r.i]); }
  return SOLIDOS.has(v);
}
function colide(x, y) { const k = 9; return solido(x - k, y - k + 6) || solido(x + k, y - k + 6) || solido(x - k, y + k) || solido(x + k, y + k); }

function verificarDesbloqueios(anunciar) {
  for (const r of REG) {
    if (!est.livres[r.i] || !REG[r.i + 1] || est.livres[r.i + 1]) continue;
    if (feitasNa(r) >= precisa(r)) {
      est.livres[r.i + 1] = true;
      if (anunciar) {
        ganharXp(100, 'Unidade concluída');
        setTimeout(() => banner('Nova região desbloqueada', REG[r.i + 1].u.regiao_mundo.nome, REG[r.i + 1].u.titulo), 900);
        explosao(jog.x, jog.y, '#ffe082', 60);
      }
    }
  }
}

// ---------- XP e evolução ----------
function ganharXp(v, motivo) {
  const antes = nivelDe(est.xp); est.xp += v; const depois = nivelDe(est.xp);
  flutuante(`+${v} XP${motivo ? ' · ' + motivo : ''}`);
  atualizarHud();
  if (depois > antes) {
    const fa = formaDe(antes), fd = formaDe(depois);
    setTimeout(() => evolucao(fa, fd, depois), 700);
  }
  salvar();
}
function evolucao(fa, fd, nivel) {
  pausado = true;
  const el = document.getElementById('evolucao'), cv = document.getElementById('evoCanvas'), g = cv.getContext('2d');
  document.getElementById('evo1').textContent = fa !== fd ? 'EVOLUÇÃO!' : `NÍVEL ${nivel}!`;
  document.getElementById('evo2').textContent = fa !== fd ? `${FORMAS[fa].nome} → ${FORMAS[fd].nome} · Nível ${nivel}` : `Você está mais forte, ${est.nome}!`;
  el.classList.remove('oculto');
  const ini = performance.now();
  (function anim(now) {
    const k = Math.max(0, now - ini) / 1000; g.clearRect(0, 0, 260, 260);
    g.fillStyle = `rgba(255,236,150,${.25 + .15 * Math.sin(k * 6)})`; g.beginPath(); g.arc(130, 130, 90 + Math.sin(k * 5) * 8, 0, 7); g.fill();
    for (let i = 0; i < 12; i++) { const a = i / 12 * 7 + k; g.fillStyle = '#fff59d'; g.beginPath(); g.arc(130 + Math.cos(a) * 110, 130 + Math.sin(a) * 110, 4, 0, 7); g.fill(); }
    const forma = k < 1.1 && fa !== fd ? (Math.floor(k * 10) % 2 ? fa : fd) : fd;
    desenharAvatar(g, 130, 140, forma, k, 1, 4.2, false);
    if (k < 3.2) requestAnimationFrame(anim); else { el.classList.add('oculto'); pausado = false; }
  })(ini);
}

// ---------- HUD ----------
function atualizarHud() {
  const n = nivelDe(est.xp), ini = 50 * (n - 1) * n, fim = 50 * n * (n + 1), f = formaDe(n);
  document.getElementById('hudNome').textContent = est.nome;
  document.getElementById('hudForma').textContent = `Nível ${n} · ${FORMAS[f].nome}`;
  document.getElementById('hudXp').style.width = Math.round((est.xp - ini) / (fim - ini) * 100) + '%';
  document.getElementById('hudXpTxt').textContent = `${est.xp} XP · próximo nível em ${fim - est.xp}`;
  const prontas = ESTACOES.filter(e => e.pronto).length;
  document.getElementById('contador').textContent = `🎯 Missões ${Object.keys(est.feitas).length}/${prontas} · 🗺️ Regiões ${est.livres.filter(Boolean).length}/${REG.length}`;
}
function desenharRetrato() {
  const g = document.getElementById('retrato').getContext('2d'); g.clearRect(0, 0, 120, 120);
  desenharAvatar(g, 60, 68, formaDe(nivelDe(est.xp)), tempo, 1, 2.6, false);
}
let bannerTimer = 0;
function banner(a, b, c) {
  document.getElementById('ban1').textContent = a; document.getElementById('ban2').textContent = b; document.getElementById('ban3').textContent = c || '';
  const el = document.getElementById('banner'); el.style.opacity = 1; clearTimeout(bannerTimer); bannerTimer = setTimeout(() => el.style.opacity = 0, 3200);
}
const flutuantes = [];
function flutuante(txt) { flutuantes.push({ txt, x: jog.x, y: jog.y - 30, vida: 1.8 }); }
function explosao(x, y, cor, n = 30) { for (let i = 0; i < n; i++) { const a = Math.random() * 7, v = 60 + Math.random() * 160; particulas.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, vida: 1 + Math.random(), cor: Math.random() > .5 ? cor : ['#81c784', '#64b5f6', '#f06292', '#fff176'][i % 4] }); } }

// ---------- painéis (missão e desafio) ----------
const veu = document.getElementById('veu'), painel = document.getElementById('painel');
function abrirPainel(html) { painel.innerHTML = html; veu.classList.remove('oculto'); pausado = true; }
function fecharPainel() { veu.classList.add('oculto'); pausado = false; }
veu.addEventListener('click', e => { if (e.target === veu) fecharPainel(); });

async function jsonTopico(tp) {
  if (!cacheJson[tp.id]) cacheJson[tp.id] = await fetch(BASE + tp.arquivo_json).then(r => r.json());
  return cacheJson[tp.id];
}
async function abrirEstacao(e) {
  const tp = e.topico, r = REG[e.reg], aula = `../index.html#${tp.id}`;
  if (!e.pronto) {
    abrirPainel(`<div class="etq">${esc(r.u.regiao_mundo.nome)}</div><h2>🚧 Estação em construção</h2><p>A missão de <b>${esc(tp.titulo)}</b> está sendo preparada pela equipe pedagógica e será liberada em breve.</p><div class="acoes"><button class="bt prim" id="ok">Continuar explorando</button></div>`);
    painel.querySelector('#ok').onclick = fecharPainel; return;
  }
  let j; try { j = await jsonTopico(tp); } catch { abrirPainel('<p>Não foi possível carregar a missão.</p>'); return; }
  const m = j.missao_mundo_aberto, feito = est.feitas[tp.id];
  abrirPainel(`
    <div class="etq">${esc(m.regiao || r.u.regiao_mundo.nome)} · missão ${esc(m.mecanica || '')}</div>
    <h2>${feito ? '✓ ' : ''}${esc(m.titulo)}</h2>
    <div class="npc"><b>${esc(m.npc)}:</b> “${esc(m.narrativa)}”</div>
    <p><b>Objetivo:</b> ${esc(m.objetivo)}</p>
    <ol>${(m.etapas || []).map(x => `<li>${esc(x)}</li>`).join('')}</ol>
    <p>🎁 Recompensa: <b>${m.recompensa_xp} XP</b>${m.item_recompensa ? ' + ' + esc(m.item_recompensa) : ''}</p>
    <p style="font-size:13px;color:#5b6b5b">Tópico: ${esc(tp.titulo)} · ${tp.acesso === 'gratuito' ? '🔓 gratuito' : '🔒 premium'}</p>
    <div class="acoes">
      <button class="bt prim" id="aceitar">${feito ? '⟳ Refazer desafio' : '⚔️ Aceitar desafio'}</button>
      <a class="bt roxo" href="${aula}" target="_blank" rel="noopener">📖 Estudar a aula</a>
      <button class="bt" id="sair">Depois</button>
    </div>`);
  painel.querySelector('#sair').onclick = fecharPainel;
  painel.querySelector('#aceitar').onclick = () => desafio(e, j, m);
}
function desafio(e, j, m) {
  const qs = ['bronze', 'prata', 'ouro'].map(n => j.questoes.find(q => q.nivel === n)).filter(Boolean);
  let i = 0, acertos = 0;
  const passo = () => {
    if (i >= qs.length) return fim();
    const q = qs[i];
    abrirPainel(`<div class="etq">Desafio · ${i + 1}/${qs.length}</div><p><span class="liga l-${q.nivel}">Liga ${q.nivel}</span></p><p style="font-size:16px">${esc(q.enunciado)}</p>
      ${q.alternativas.map((a, n) => `<button class="alt" data-n="${n}">${'ABCDE'[n]}) ${esc(a)}</button>`).join('')}<div id="fb"></div>`);
    painel.querySelectorAll('.alt').forEach(b => b.onclick = () => {
      const ok = +b.dataset.n === q.correta; if (ok) acertos++;
      painel.querySelectorAll('.alt').forEach(x => { x.disabled = true; if (+x.dataset.n === q.correta) x.classList.add('certa'); });
      if (!ok) b.classList.add('errada');
      painel.querySelector('#fb').innerHTML = `<div class="exp">${ok ? '✅ Correto!' : '❌ Ainda não.'} ${esc(q.explicacao)}</div><div class="acoes"><button class="bt prim" id="prox">Continuar →</button></div>`;
      painel.querySelector('#prox').onclick = () => { i++; passo(); };
    });
  };
  const fim = () => {
    const venceu = acertos >= 2, jaFeito = est.feitas[e.topico.id];
    if (venceu && !jaFeito) {
      est.feitas[e.topico.id] = true;
      if (m.item_recompensa) est.itens.push(m.item_recompensa);
    }
    abrirPainel(`<h2>${venceu ? '🏆 Missão cumprida!' : '💪 Quase lá!'}</h2><p>Você acertou <b>${acertos} de ${qs.length}</b>.</p>
      ${venceu ? (jaFeito ? '<p>Revisão concluída — ótimo para a memória!</p>' : `<p>Recompensa: <b>${m.recompensa_xp} XP</b>${m.item_recompensa ? ` e o item <b>${esc(m.item_recompensa)}</b>` : ''}.</p>`) : '<p>Estude a aula e tente de novo: são necessárias 2 respostas certas.</p>'}
      <div class="acoes"><button class="bt prim" id="ok">Voltar ao mundo</button>${venceu ? '' : `<a class="bt roxo" href="../index.html#${e.topico.id}" target="_blank" rel="noopener">📖 Estudar a aula</a>`}</div>`);
    painel.querySelector('#ok').onclick = () => {
      fecharPainel();
      if (venceu) {
        explosao(e.x, e.y, '#ffe082', 45);
        ganharXp(jaFeito ? 10 * acertos : (m.recompensa_xp || 100) + 10 * acertos, jaFeito ? 'revisão' : 'missão');
        verificarDesbloqueios(true);
        atualizarHud();
      }
    };
  };
  passo();
}

// ---------- mapa-múndi e minimapa ----------
function desenharMinimapa() {
  const c = document.getElementById('minimapa'), g = c.getContext('2d'), k = 1;
  c.width = COLS * RW * k; c.height = LINHAS * RH * k;
  g.fillStyle = '#1b4a63'; g.fillRect(0, 0, c.width, c.height);
  for (const r of REG) {
    g.fillStyle = est.livres[r.i] ? r.tema.chao[0] : '#3a4652';
    g.fillRect(r.ox * k + 1, r.oy * k + 1, RW * k - 2, RH * k - 2);
    if (r.i === regiaoAtual) { g.strokeStyle = '#fff'; g.lineWidth = 1; g.strokeRect(r.ox * k + 1.5, r.oy * k + 1.5, RW * k - 3, RH * k - 3); }
  }
  g.fillStyle = '#ff1744'; g.beginPath(); g.arc(jog.x / TS * k, jog.y / TS * k, 2.5, 0, 7); g.fill();
}
function abrirMapa() {
  const el = document.getElementById('mapa'), c = document.getElementById('mapaCanvas'), g = c.getContext('2d');
  const k = Math.min((innerWidth * .94) / (COLS * RW * TS), (innerHeight * .8) / (LINHAS * RH * TS));
  c.width = COLS * RW * TS * k; c.height = LINHAS * RH * TS * k;
  g.fillStyle = '#1b4a63'; g.fillRect(0, 0, c.width, c.height);
  for (const r of REG) {
    const x = r.ox * TS * k, y = r.oy * TS * k, w = RW * TS * k, h = RH * TS * k;
    g.drawImage(canvasRegiao(r), x, y, w, h);
    if (!est.livres[r.i]) { g.fillStyle = 'rgba(25,32,42,.78)'; g.fillRect(x, y, w, h); }
    const fs1 = Math.max(7, Math.min(18, w / 11)); g.font = `700 ${fs1}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(0,0,0,.55)'; const txt = est.livres[r.i] ? r.u.regiao_mundo.nome : '🔒 ' + r.u.regiao_mundo.nome;
    const tw = Math.min(w - 4, g.measureText(txt).width + 12); g.fillRect(x + w / 2 - tw / 2, y + h / 2 - fs1, tw, fs1 * 2);
    g.fillStyle = '#fff'; g.fillText(txt, x + w / 2, y + h / 2, w - 8);
    if (w < 110) continue; g.font = `500 ${fs1 * .75}px system-ui`; g.fillStyle = 'rgba(255,255,255,.85)';
    g.fillText(`${r.u.serie}ª série · ${feitasNa(r)}/${r.estacoes.filter(e => e.pronto).length} missões`, x + w / 2, y + h / 2 + fs1 * 1.6);
  }
  g.fillStyle = '#ff1744'; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(jog.x * k, jog.y * k, 6, 0, 7); g.fill(); g.stroke();
  el.classList.remove('oculto'); pausado = true;
}
function fecharMapa() { document.getElementById('mapa').classList.add('oculto'); pausado = false; }
document.getElementById('mapa').onclick = fecharMapa;
document.getElementById('btMapa').onclick = abrirMapa;

// ---------- loop principal ----------
const cv = document.getElementById('jogo'), ctx = cv.getContext('2d');
let W = 0, H = 0, dpr = 1;
function redimensionar() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; }
addEventListener('resize', redimensionar);

function estacaoProxima(raio = 46) {
  let melhor = null, d = raio;
  for (const e of ESTACOES) { const dd = Math.hypot(e.x - jog.x, e.y - jog.y); if (dd < d) { d = dd; melhor = e; } }
  return melhor;
}

function atualizar(dt) {
  let vx = 0, vy = 0;
  if (teclas.ArrowLeft || teclas.a) vx -= 1; if (teclas.ArrowRight || teclas.d) vx += 1;
  if (teclas.ArrowUp || teclas.w) vy -= 1; if (teclas.ArrowDown || teclas.s) vy += 1;
  if (vx || vy) jog.alvo = null;
  else if (jog.alvo) {
    const dx = jog.alvo.x - jog.x, dy = jog.alvo.y - jog.y, d = Math.hypot(dx, dy);
    if (d < 6) { jog.alvo = null; if (jog.autoFalar) { const e = jog.autoFalar; jog.autoFalar = null; abrirEstacao(e); } }
    else { vx = dx / d; vy = dy / d; }
  }
  const n = Math.hypot(vx, vy); jog.andando = n > 0;
  if (n) {
    const vel = (teclas.Shift ? 260 : 165) * dt; vx = vx / n * vel; vy = vy / n * vel;
    if (vx) jog.dir = vx > 0 ? 1 : -1;
    const bx = jog.x, by = jog.y;
    if (!colide(jog.x + vx, jog.y)) jog.x += vx;
    if (!colide(jog.x, jog.y + vy)) jog.y += vy;
    if (jog.alvo && bx === jog.x && by === jog.y) { jog.alvo = null; if (jog.autoFalar && Math.hypot(jog.autoFalar.x - jog.x, jog.autoFalar.y - jog.y) < 70) { const e = jog.autoFalar; jog.autoFalar = null; abrirEstacao(e); } }
  }
  // região atual
  const r = regiaoEm(Math.floor(jog.x / TS), Math.floor(jog.y / TS));
  if (r && r.i !== regiaoAtual) { regiaoAtual = r.i; banner(`${r.u.serie}ª série · Unidade ${r.i + 1}`, r.u.regiao_mundo.nome, r.u.titulo); }
  // câmera suave
  const mx = COLS * RW * TS, my = LINHAS * RH * TS;
  const ax = Math.max(0, Math.min(mx - W, jog.x - W / 2)), ay = Math.max(0, Math.min(my - H, jog.y - H / 2));
  cam.x += (ax - cam.x) * Math.min(1, dt * 6); cam.y += (ay - cam.y) * Math.min(1, dt * 6);
  // partículas
  particulas = particulas.filter(p => (p.vida -= dt) > 0); particulas.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; });
  for (let i = flutuantes.length - 1; i >= 0; i--) { flutuantes[i].vida -= dt; flutuantes[i].y -= 28 * dt; if (flutuantes[i].vida <= 0) flutuantes.splice(i, 1); }
  // dica de interação
  const e = estacaoProxima(), dica = document.getElementById('interagir');
  if (e) { dica.textContent = e.pronto ? `E — falar sobre "${e.topico.titulo}"` : 'E — estação em construção'; dica.classList.remove('oculto'); } else dica.classList.add('oculto');
}

function desenhar() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // oceano
  ctx.fillStyle = '#1b5f80'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 2;
  for (let y = -((cam.y * .5) % 40); y < H; y += 40) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin((x + cam.x) * .03 + tempo * 2) * 4); ctx.stroke(); }
  ctx.save(); ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
  for (const r of REG) {
    const x = r.ox * TS, y = r.oy * TS, w = RW * TS, h = RH * TS;
    if (x > cam.x + W || x + w < cam.x || y > cam.y + H || y + h < cam.y) continue;
    ctx.drawImage(canvasRegiao(r), x, y);
    // água com brilho animado
    if (est.livres[r.i]) {
      ctx.fillStyle = 'rgba(255,255,255,.18)';
      for (let ty = 0; ty < RH; ty++) for (let tx = 0; tx < RW; tx++) {
        if (r.tiles[ty * RW + tx] !== T.AGUA) continue;
        const ph = Math.sin(tempo * 2 + tx * .7 + ty * 1.3); if (ph > .6) ctx.fillRect(x + tx * TS + 8 + ph * 8, y + ty * TS + 20, 8, 2);
      }
    }
    // portões
    for (const k in r.portoes) {
      const vz = r.portoes[k], gx = x + (k % RW) * TS, gy = y + Math.floor(k / RW) * TS;
      if (!(est.livres[vz] && est.livres[r.i])) {
        ctx.fillStyle = '#5d4037'; ctx.fillRect(gx + 2, gy + 2, TS - 4, TS - 4);
        ctx.fillStyle = '#8d6e4a'; for (let s = 0; s < 3; s++) ctx.fillRect(gx + 4 + s * 9, gy + 3, 5, TS - 6);
        ctx.font = '16px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔒', gx + TS / 2, gy + TS / 2);
      }
    }
  }
  // estações e NPCs
  const prox = estacaoProxima(90);
  for (const e of ESTACOES) {
    if (!est.livres[e.reg]) continue;
    if (e.x < cam.x - 60 || e.x > cam.x + W + 60 || e.y < cam.y - 60 || e.y > cam.y + H + 60) continue;
    desenharNPC(ctx, e, tempo, e === prox);
  }
  // névoa nas regiões bloqueadas
  for (const r of REG) {
    if (est.livres[r.i]) continue;
    const x = r.ox * TS, y = r.oy * TS, w = RW * TS, h = RH * TS;
    if (x > cam.x + W || x + w < cam.x || y > cam.y + H || y + h < cam.y) continue;
    ctx.fillStyle = 'rgba(22,30,40,.72)'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(220,230,240,.10)';
    for (let k = 0; k < 14; k++) { ctx.beginPath(); ctx.arc(x + hash(k, r.i, 1) * w + Math.sin(tempo * .3 + k) * 30, y + hash(r.i, k, 2) * h, 60 + hash(k, k, r.i) * 60, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 26px system-ui'; ctx.fillText('🔒 ' + r.u.regiao_mundo.nome, x + w / 2, y + h / 2 - 14);
    ctx.font = '500 15px system-ui'; ctx.fillStyle = 'rgba(255,255,255,.85)';
    const ant = REG[r.i - 1]; ctx.fillText(ant ? `Cumpra ${precisa(ant)} missões em ${ant.u.regiao_mundo.nome} para desbloquear` : '', x + w / 2, y + h / 2 + 16);
  }
  // jogador
  desenharAvatar(ctx, jog.x, jog.y, formaDe(nivelDe(est.xp)), tempo, jog.dir, 1.25, jog.andando);
  ctx.font = '700 12px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
  ctx.strokeText(est.nome, jog.x, jog.y - 36); ctx.fillText(est.nome, jog.x, jog.y - 36);
  // alvo do clique
  if (jog.alvo) { ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(jog.alvo.x, jog.alvo.y, 8 + Math.sin(tempo * 8) * 2, 0, 7); ctx.stroke(); }
  // efeitos
  particulas.forEach(p => { ctx.globalAlpha = Math.min(1, p.vida); ctx.fillStyle = p.cor; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); });
  ctx.globalAlpha = 1;
  flutuantes.forEach(f => { ctx.globalAlpha = Math.min(1, f.vida); ctx.font = '800 16px system-ui'; ctx.fillStyle = '#ffe082'; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.lineWidth = 4; ctx.strokeText(f.txt, f.x, f.y); ctx.fillText(f.txt, f.x, f.y); });
  ctx.globalAlpha = 1;
  ctx.restore();
}

let ultimo = 0, acMini = 0;
function loop(t) {
  const dt = Math.min(.05, (t - ultimo) / 1000 || 0); ultimo = t;
  if (!document.hidden && est) {
    tempo += dt;
    if (!pausado) atualizar(dt);
    desenhar();
    if ((acMini += dt) > .25) { acMini = 0; desenharMinimapa(); desenharRetrato(); }
  }
  requestAnimationFrame(loop);
}

// ---------- entrada ----------
addEventListener('keydown', e => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
  teclas[k] = true; if (e.shiftKey) teclas.Shift = true;
  if (k === 'Escape') { fecharPainel(); fecharMapa(); }
  if (document.getElementById('inicio').classList.contains('oculto') === false) return;
  if (k === 'm') { document.getElementById('mapa').classList.contains('oculto') ? abrirMapa() : fecharMapa(); }
  if ((k === 'e' || k === ' ') && !pausado) { const s = estacaoProxima(); if (s) abrirEstacao(s); e.preventDefault(); }
  if (demo && !pausado) {
    if (k === 'p') ganharXp(250, 'demo');
    if (k === 'u') { const prox = est.livres.indexOf(false); if (prox > 0) { est.livres[prox] = true; banner('Nova região desbloqueada', REG[prox].u.regiao_mundo.nome, REG[prox].u.titulo); salvar(); atualizarHud(); } }
    if (k === 't') { const livres = REG.filter(r => est.livres[r.i]); const alvo = livres[(livres.findIndex(r => r.i === regiaoAtual) + 1) % livres.length]; jog.x = (alvo.ox + HUB.x) * TS + TS / 2; jog.y = (alvo.oy + HUB.y + 2) * TS + TS / 2; cam.x = jog.x - W / 2; cam.y = jog.y - H / 2; }
  }
  if (k.startsWith('Arrow') || k === ' ') e.preventDefault();
});
addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; teclas[k] = false; if (!e.shiftKey) teclas.Shift = false; });
addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });
cv.addEventListener('click', ev => {
  if (pausado) return;
  const wx = ev.clientX + cam.x, wy = ev.clientY + cam.y;
  const e = ESTACOES.find(s => est.livres[s.reg] && Math.hypot(s.x - wx, s.y - wy) < 26);
  if (e) { const d = Math.hypot(e.x - jog.x, e.y - jog.y); if (d < 46) return abrirEstacao(e); jog.alvo = { x: e.x, y: e.y + 26 }; jog.autoFalar = e; }
  else { jog.alvo = { x: wx, y: wy }; jog.autoFalar = null; }
});

// ---------- tela inicial ----------
function animarInicio() {
  const g = document.getElementById('avatarInicio').getContext('2d'); let ini = performance.now();
  (function a(now) {
    if (document.getElementById('inicio').classList.contains('oculto')) return;
    const k = Math.max(0, now - ini) / 1000, f = Math.floor(k / 1.2) % FORMAS.length;
    g.clearRect(0, 0, 160, 160); desenharAvatar(g, 80, 92, f, k, 1, 3.4, false);
    requestAnimationFrame(a);
  })(ini);
}
function comecar(novo) {
  const nome = document.getElementById('nomeInput').value.trim() || 'Evonauta';
  demo = document.getElementById('chkDemo').checked;
  const salvo = carregarSalvo();
  est = (!novo && salvo) ? salvo : { nome, xp: 0, feitas: {}, livres: REG.map((_, i) => i === 0), itens: [], pos: null };
  if (novo) est.nome = nome;
  if (est.livres.length !== REG.length) est.livres = REG.map((_, i) => !!est.livres[i] || i === 0);
  verificarDesbloqueios(false);
  if (est.pos && !colide(est.pos.x, est.pos.y)) { jog.x = est.pos.x; jog.y = est.pos.y; }
  else { jog.x = HUB.x * TS + TS / 2; jog.y = (HUB.y + 2) * TS + TS / 2; }
  cam.x = Math.max(0, jog.x - W / 2); cam.y = Math.max(0, jog.y - H / 2);
  document.getElementById('inicio').classList.add('oculto');
  ['hud', 'topo-dir', 'minimapa', 'dica'].forEach(id => document.getElementById(id).classList.remove('oculto'));
  document.getElementById('dicaDemo').innerHTML = demo ? ' · <b>Demo:</b> <b>P</b> +XP · <b>U</b> desbloquear região · <b>T</b> teletransporte' : '';
  atualizarHud(); salvar();
  setInterval(salvar, 5000);
}

(async function iniciar() {
  redimensionar(); animarInicio();
  try {
    CUR = await fetch(BASE + 'curriculo.json').then(r => r.json());
  } catch {
    document.getElementById('carregando').textContent = 'Não foi possível carregar o currículo. Abra pelo servidor: node scripts/preview-conteudo.js';
    return;
  }
  gerarRegioes();
  const prontos = ESTACOES.filter(e => e.pronto).length;
  document.getElementById('carregando').textContent = `${REG.length} regiões · ${ESTACOES.length} estações · ${prontos} missões disponíveis`;
  const salvo = carregarSalvo();
  if (salvo) { document.getElementById('btContinuar').classList.remove('oculto'); document.getElementById('nomeInput').value = salvo.nome || ''; }
  document.getElementById('btNovo').onclick = () => comecar(true);
  document.getElementById('btContinuar').onclick = () => comecar(false);
  document.getElementById('nomeInput').addEventListener('keydown', e => { if (e.key === 'Enter') comecar(!salvo); });
  requestAnimationFrame(loop);
})();
