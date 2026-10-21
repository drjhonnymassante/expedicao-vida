// Expedição Vida 3D — arquipélago explorável em Three.js.
// Cada unidade do currículo é uma ilha; cada tópico, uma estação com NPC, missão e desafio.
import * as THREE from 'three';

const { FORMAS, nivelDe, formaDe } = window.Avatar2D;
const EV = window.EstadoVida;
const BASE = '../../content/';
const CORES_JOGADOR = ['#36D399', '#6EC8FF', '#B388FF', '#FF8FAB', '#FFD166', '#FF9F43'];
const COLS = 7, ESPACO = 64;

// Temas visuais por unidade (mesmos da versão leve).
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

// ---------- utilidades ----------
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function hash(a, b, c = 0) { let h = (a * 374761393 + b * 668265263 + c * 2147483647) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
const lerp = (a, b, k) => a + (b - a) * k;
function gradePos(i) { const row = Math.floor(i / COLS); let col = i % COLS; if (row % 2 === 1) col = COLS - 1 - col; return { col, row }; }
const hoje = () => new Date().toISOString().slice(0, 10);

// ---------- som (sintetizado, sem arquivos) ----------
let audio = null, mudo = false;
function tom(freq, dur, tipo = 'sine', vol = .18, atraso = 0, freqFim) {
  if (mudo) return;
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const t0 = audio.currentTime + atraso, o = audio.createOscillator(), g = audio.createGain();
  o.type = tipo; o.frequency.setValueAtTime(freq, t0); if (freqFim) o.frequency.exponentialRampToValueAtTime(freqFim, t0 + dur);
  g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .015); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  o.connect(g).connect(audio.destination); o.start(t0); o.stop(t0 + dur + .05);
}
const SFX = {
  coleta: () => { tom(880, .12, 'sine', .14); tom(1320, .16, 'sine', .12, .07); },
  certo: () => { tom(660, .14, 'triangle', .16); tom(990, .22, 'triangle', .16, .1); },
  errado: () => { tom(196, .25, 'sawtooth', .07); tom(150, .3, 'sawtooth', .06, .08); },
  nivel: () => [523, 659, 784, 1046, 1318].forEach((f, k) => tom(f, .3, 'triangle', .15, k * .09)),
  evolucao: () => { tom(220, 1.2, 'sine', .12, 0, 880); [523, 659, 784, 1046].forEach((f, k) => tom(f, .5, 'triangle', .14, 1.1 + k * .1)); },
  desbloqueio: () => { tom(330, .8, 'sine', .12, 0, 660); [392, 494, 587].forEach((f, k) => tom(f, .7, 'triangle', .1, .3 + k * .05)); },
  pulo: () => tom(320, .16, 'sine', .08, 0, 640),
  abrir: () => tom(520, .1, 'sine', .08),
  conquista: () => [784, 988, 1175].forEach((f, k) => tom(f, .25, 'square', .06, k * .08)),
};

// ---------- estado ----------
let CUR, ILHAS = [], PONTES = [], ESTACOES = [], ORBES = [], FRAGS = [], PILULAS = [];
const REPOE_CRISTAL = 10 * 60e3, REPOE_PILULA = 30 * 60e3;
let sondaAte = 0, feixes = [], modoSalto = false, mapaInfo = null;
let est = null, demo = false, pausado = true, emJogo = false;
const jog = { x: 0, y: 1, z: 0, vy: 0, chao: true, rot: 0, vel: 0 };
const camCtl = { yaw: .6, pitch: .55, dist: 15, alvoDist: 15 };
const teclas = {};
const cacheJson = {};
let ilhaAtual = -1, combo = 0;

function salvar() { if (!est) return; est.pos3d = { x: jog.x, z: jog.z }; EV.salvar(est); }
window.salvarJogo = () => { salvar(); if (window.salvarNaNuvem) window.salvarNaNuvem(); };
addEventListener('pagehide', () => salvar());

// ---------- renderização ----------
const canvas = $('cena');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
catch { location.href = '../mundo/'; throw new Error('sem WebGL'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#bfe3f7', 110, 380);
const camera = new THREE.PerspectiveCamera(55, 1, .1, 900);
function redimensionar() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', redimensionar); redimensionar();

// céu em gradiente
scene.add(new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { topo: { value: new THREE.Color('#2f7fd1') }, hor: { value: new THREE.Color('#cfeeff') }, sol: { value: new THREE.Vector3(.5, .45, .3).normalize() } },
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: 'uniform vec3 topo; uniform vec3 hor; uniform vec3 sol; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+.15,0.,1.); vec3 c = mix(hor, topo, pow(h,.7)); float s = pow(max(dot(vP, sol),0.), 220.); c += vec3(1.,.93,.75)*s*1.4 + vec3(1.,.85,.6)*pow(max(dot(vP,sol),0.),8.)*.18; gl_FragColor = vec4(c,1.); }',
})));

scene.add(new THREE.HemisphereLight('#d8f0ff', '#4c6b3c', 1.05));
const sol = new THREE.DirectionalLight('#fff1d6', 2.3);
const TOQUE = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
if (TOQUE) document.body.classList.add('toque');
if (TOQUE) { const bm = document.getElementById('btMapa'); bm.textContent = '🗺️'; bm.title = 'Mapa'; const la = document.querySelector('#acoes a'); if (la) { la.textContent = '📖'; la.title = 'Aulas'; } }
sol.castShadow = true; sol.shadow.mapSize.set(TOQUE ? 1024 : 2048, TOQUE ? 1024 : 2048);
Object.assign(sol.shadow.camera, { left: -48, right: 48, top: 48, bottom: -48, near: 1, far: 220 });
sol.shadow.bias = -.0006; sol.shadow.normalBias = .03;
scene.add(sol, sol.target);

// oceano low-poly animado
const tempoU = { value: 0 };
const aguaMat = new THREE.MeshPhongMaterial({ color: '#1f93cf', specular: '#d9f6ff', shininess: 90, flatShading: true, transparent: true, opacity: .93 });
aguaMat.onBeforeCompile = sh => {
  sh.uniforms.uTempo = tempoU;
  sh.vertexShader = 'uniform float uTempo;\n' + sh.vertexShader.replace('#include <begin_vertex>',
    '#include <begin_vertex>\n transformed.z += sin(position.x*.09 + uTempo*1.1)*.32 + cos(position.y*.11 + uTempo*.9)*.26 + sin((position.x+position.y)*.05 + uTempo*.6)*.2;');
};
const agua = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1000, 180, 130), aguaMat);
agua.rotation.x = -Math.PI / 2; agua.position.y = -.15; agua.receiveShadow = true;
scene.add(agua);

// texturas utilitárias
function texPonto() {
  const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const TEX_PONTO = texPonto();
function spriteTexto(titulo, sub, corSub = '#7CFFB2') {
  const c = document.createElement('canvas'); c.width = 640; c.height = 180; const g = c.getContext('2d');
  g.fillStyle = 'rgba(12,20,36,.72)'; g.beginPath(); g.roundRect(8, 8, 624, 164, 40); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 3; g.stroke();
  g.textAlign = 'center'; g.fillStyle = corSub; g.font = '800 30px Nunito, sans-serif'; g.fillText(sub, 320, 62);
  g.fillStyle = '#fff'; g.font = '700 58px Fredoka, Nunito, sans-serif';
  let t = titulo; while (g.measureText(t).width > 590 && t.length > 4) t = t.slice(0, -2); if (t !== titulo) t += '…';
  g.fillText(t, 320, 132);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(12, 3.4, 1); return s;
}
function spriteEmoji(emoji, tam = 2.2) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.font = '96px "Segoe UI Emoji", "Apple Color Emoji", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(emoji, 64, 72);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(tam, tam, 1); return s;
}
const brilho = (cor, tam) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX_PONTO, color: cor, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); s.scale.set(tam, tam, 1); return s; };
const mat = (cor, extra = {}) => new THREE.MeshStandardMaterial({ color: cor, roughness: .82, metalness: 0, flatShading: true, ...extra });

// ---------- decoração instanciada ----------
const GEO = {
  tronco: new THREE.CylinderGeometry(.16, .26, 1.5, 6), copa: new THREE.IcosahedronGeometry(1.15, 0), cone: new THREE.ConeGeometry(1.05, 2.8, 7),
  rocha: new THREE.DodecahedronGeometry(.8, 0), cristal: new THREE.OctahedronGeometry(.55, 0), caule: new THREE.CylinderGeometry(.18, .24, .9, 7),
  chapeu: new THREE.SphereGeometry(.85, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), cacto: new THREE.CapsuleGeometry(.33, 1.5, 4, 8), casa: new THREE.BoxGeometry(1.8, 1.4, 1.8),
  telhado: new THREE.ConeGeometry(1.55, 1.1, 4), arbusto: new THREE.IcosahedronGeometry(.75, 0), flor: new THREE.SphereGeometry(.14, 6, 4), coral: new THREE.ConeGeometry(.24, 1.5, 5),
  bolha: new THREE.SphereGeometry(.65, 16, 12), celula: new THREE.TorusGeometry(.5, .26, 8, 18), torre: new THREE.BoxGeometry(.65, 3.4, .65), painel: new THREE.BoxGeometry(1.7, .08, 1.1),
  sebe: new THREE.BoxGeometry(1.7, 1.3, 1.7), acacia: new THREE.CylinderGeometry(1.7, 1.5, .45, 8), palmaFolha: new THREE.ConeGeometry(1.8, .55, 7),
};
const PARTES = {
  arvore: [{ g: 'tronco', y: .75, cor: '#7a5434', sombra: true }, { g: 'copa', y: 2.3, cor: 'folha', sombra: true, var: .25 }],
  pinheiro: [{ g: 'tronco', y: .6, cor: '#5d4037', sombra: true }, { g: 'cone', y: 2.4, cor: 'folha', sombra: true, var: .2 }],
  palmeira: [{ g: 'tronco', y: 1.3, cor: '#9c7a4f', sy: 1.8, sombra: true }, { g: 'palmaFolha', y: 2.9, cor: 'folha', sombra: true }],
  acacia: [{ g: 'tronco', y: 1.1, cor: '#6d4c2f', sy: 1.4, sombra: true }, { g: 'acacia', y: 2.25, cor: 'folha', sombra: true }],
  rocha: [{ g: 'rocha', y: .45, cor: '#8d939b', sombra: true, var: .15 }],
  pedraMarrom: [{ g: 'rocha', y: .4, cor: '#a1887f', sombra: true, var: .15 }],
  cristal: [{ g: 'cristal', y: 1.1, cor: 'acento', sy: 2.2, basico: true }],
  cogumelo: [{ g: 'caule', y: .45, cor: '#efe7da', sombra: true }, { g: 'chapeu', y: .88, cor: '#e53935', sombra: true, alt: '#8e24aa' }],
  cacto: [{ g: 'cacto', y: 1.05, cor: '#5b8c32', sombra: true }],
  casa: [{ g: 'casa', y: .7, cor: '#f3e6cf', sombra: true }, { g: 'telhado', y: 1.95, cor: '#c0392b', sombra: true, alt: '#8e5a3c', rot45: true }],
  arbusto: [{ g: 'arbusto', y: .5, cor: 'folha', sy: .8, sombra: true, var: .25 }],
  sebe: [{ g: 'sebe', y: .65, cor: 'folha', sombra: true, var: .1 }],
  flor: [{ g: 'flor', y: .15, cor: '#f06292', alt: '#ffd54f', cacho: 5 }],
  coral: [{ g: 'coral', y: .75, cor: '#ff7043', alt: '#ec407a', cacho: 3, sombra: true }],
  bolha: [{ g: 'bolha', y: 1.3, cor: '#9be7ff', transparente: true }],
  celula: [{ g: 'celula', y: .55, cor: '#d32f2f', deitado: true, sombra: true }],
  torre: [{ g: 'torre', y: 1.7, cor: 'acento', basico: true }],
  painel: [{ g: 'tronco', y: .55, cor: '#455a64', sy: .7 }, { g: 'painel', y: 1.15, cor: '#1e6fd9', inclina: true, sombra: true }],
};
const MAPA_DEC = { estromatolito: 'pedraMarrom', fumarola: 'rocha', ruina: 'rocha', ninho: 'pedraMarrom', samambaia: 'arbusto', ervilha: 'arbusto', concha: 'pedraMarrom' };
const instancias = {};   // tipo -> lista de {x,z,s,r,ilha}

function montarDecoracao() {
  const dummy = new THREE.Object3D(), cor = new THREE.Color();
  for (const [tipo, lista] of Object.entries(instancias)) {
    const partes = PARTES[tipo]; if (!partes) continue;
    for (const p of partes) {
      const n = lista.length * (p.cacho || 1);
      const m = p.basico ? new THREE.MeshBasicMaterial({ color: '#fff' }) : p.transparente ? new THREE.MeshStandardMaterial({ color: '#fff', transparent: true, opacity: .45, roughness: .1 }) : mat('#ffffff');
      const im = new THREE.InstancedMesh(GEO[p.g], m, n);
      im.castShadow = !!p.sombra; im.receiveShadow = true;
      let k = 0;
      for (const d of lista) {
        const tema = ILHAS[d.ilha].tema;
        for (let c = 0; c < (p.cacho || 1); c++) {
          const ox = p.cacho ? (hash(k, c, 7) - .5) * 1.4 : 0, oz = p.cacho ? (hash(c, k, 8) - .5) * 1.4 : 0;
          dummy.position.set(d.x + ox, 1 + p.y * d.s, d.z + oz);
          dummy.rotation.set(p.deitado ? Math.PI / 2.4 : 0, d.r + (p.rot45 ? Math.PI / 4 : 0), p.inclina ? .45 : 0);
          dummy.scale.set(d.s, d.s * (p.sy || 1), d.s);
          dummy.updateMatrix(); im.setMatrixAt(k, dummy.matrix);
          let base = p.cor === 'folha' ? (tema.folha || '#43a047') : p.cor === 'acento' ? (tema.cristal || '#7CFFB2') : p.cor;
          if (p.alt && hash(k, 3, d.ilha) > .5) base = p.alt;
          cor.set(base); if (p.var) cor.offsetHSL(0, 0, (hash(k, 11, d.ilha) - .5) * p.var);
          im.setColorAt(k, cor); k++;
        }
      }
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      scene.add(im);
    }
  }
}

// ---------- geração do arquipélago ----------
const nuvemGeo = new THREE.IcosahedronGeometry(1, 1);
let nuvens = null, nuvemDados = [];

function gerarMundo() {
  const linhas = Math.ceil(CUR.unidades.length / COLS);
  CUR.unidades.forEach((u, i) => {
    const g = gradePos(i), tema = TEMAS[u.id] || TEMAS['u17-vertebrados'];
    const cx = (g.col - (COLS - 1) / 2) * ESPACO + (hash(i, 1) - .5) * 10;
    const cz = (g.row - (linhas - 1) / 2) * ESPACO + (hash(i, 2) - .5) * 10;
    const R = 17 + hash(i, 3) * 3.5;
    ILHAS.push({ i, u, tema, cx, cz, R, obst: [], estacoes: [], nuvens: [] });
  });
  for (let i = 0; i < ILHAS.length - 1; i++) {
    const A = ILHAS[i], B = ILHAS[i + 1], dx = B.cx - A.cx, dz = B.cz - A.cz, d = Math.hypot(dx, dz), ux = dx / d, uz = dz / d;
    PONTES.push({ a: i, b: i + 1, sx: A.cx + ux * (A.R - 2), sz: A.cz + uz * (A.R - 2), ux, uz, len: d - A.R - B.R + 4, ang: Math.atan2(dx, dz) });
  }
  for (const ilha of ILHAS) construirIlha(ilha);
  for (const p of PONTES) construirPonte(p);
  montarDecoracao();
  // nuvens instanciadas sobre ilhas bloqueadas
  nuvens = new THREE.InstancedMesh(nuvemGeo, new THREE.MeshStandardMaterial({ color: '#f4f8ff', roughness: 1, transparent: true, opacity: .92, flatShading: true }), ILHAS.length * 14);
  const dm = new THREE.Object3D(); let k = 0;
  for (const ilha of ILHAS) for (let n = 0; n < 14; n++) {
    const a = hash(ilha.i, n, 4) * Math.PI * 2, rr = hash(n, ilha.i, 5) * ilha.R * .9, s = 3.5 + hash(n, n, ilha.i) * 4;
    const dado = { k, ilha: ilha.i, x: ilha.cx + Math.cos(a) * rr, y: 4 + hash(ilha.i, n, 9) * 4, z: ilha.cz + Math.sin(a) * rr, s, fator: 1 };
    nuvemDados.push(dado); ilha.nuvens.push(dado);
    dm.position.set(dado.x, dado.y, dado.z); dm.scale.set(s * 1.3, s * .75, s); dm.updateMatrix(); nuvens.setMatrixAt(k++, dm.matrix);
  }
  nuvens.castShadow = true; scene.add(nuvens);
}

function construirIlha(ilha) {
  const { tema, cx, cz, R, i } = ilha, R0 = rng(i * 7919 + 3);
  // corpo rochoso com borda irregular
  const corpo = new THREE.CylinderGeometry(R, R * .58, 9, 26, 3);
  const pos = corpo.attributes.position, v = new THREE.Vector3();
  for (let k = 0; k < pos.count; k++) {
    v.fromBufferAttribute(pos, k);
    if (v.y < 4.4) { const f = 1 + (hash(k, i, 1) - .5) * .16; pos.setX(k, v.x * f); pos.setZ(k, v.z * f); pos.setY(k, v.y + (hash(i, k, 2) - .5) * .8); }
  }
  corpo.computeVertexNormals();
  const malha = new THREE.Mesh(corpo, [mat(tema.borda || '#666'), mat(tema.chao[0]), mat(tema.borda || '#666')]);
  malha.position.set(cx, 1 - 4.5, cz); malha.receiveShadow = true; malha.castShadow = true; scene.add(malha);
  const praia = new THREE.Mesh(new THREE.CylinderGeometry(R + 2.4, R + 3.2, 1, 30), mat('#f0dfae'));
  praia.position.set(cx, -.25, cz); praia.receiveShadow = true; scene.add(praia);
  // manchas de relevo no topo (visual)
  for (let k = 0; k < 6; k++) {
    const a = R0() * Math.PI * 2, rr = 4 + R0() * (R - 7), s = 1.5 + R0() * 2.5;
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), mat(tema.chao[1]));
    m.scale.set(s * 1.4, .35, s); m.position.set(cx + Math.cos(a) * rr, .98, cz + Math.sin(a) * rr); m.receiveShadow = true; scene.add(m);
  }
  // monumento central
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2, 1.2, 8), mat('#d9d2c3')); base.position.set(cx, 1.6, cz); base.castShadow = true; base.receiveShadow = true; scene.add(base);
  const pilar = new THREE.Mesh(new THREE.CylinderGeometry(.55, .8, 3.2, 6), mat('#efe9dc')); pilar.position.set(cx, 3.8, cz); pilar.castShadow = true; scene.add(pilar);
  const acento = tema.cristal || tema.folha || '#7CFFB2';
  const icone = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 0), new THREE.MeshStandardMaterial({ color: acento, emissive: acento, emissiveIntensity: .55, flatShading: true, roughness: .3 }));
  icone.position.set(cx, 6.6, cz); icone.castShadow = true; scene.add(icone);
  const halo = brilho(acento, 6); halo.position.copy(icone.position); scene.add(halo);
  ilha.icone = icone; ilha.halo = halo;
  ilha.obst.push({ x: cx, z: cz, r: 2.3 });
  const rot = spriteTexto(ilha.u.regiao_mundo.nome, `${ilha.u.serie}ª SÉRIE · UNIDADE ${i + 1}`); rot.position.set(cx, 10.2, cz); scene.add(rot); ilha.rotulo = rot;
  const cad = spriteEmoji('🔒', 3.2); cad.position.set(cx, 13.4, cz); scene.add(cad); ilha.cadeado = cad;
  // ângulos das pontes (para não plantar nada no caminho)
  const angPontes = [];
  for (const vz of [i - 1, i + 1]) { const B = ILHAS[vz]; if (B) angPontes.push(Math.atan2(B.cz - cz, B.cx - cx)); }
  const longeDasPontes = a => angPontes.every(p => Math.abs(Math.atan2(Math.sin(a - p), Math.cos(a - p))) > .32);
  // estações (uma por tópico)
  const n = ilha.u.topicos.length;
  let angs = []; for (let k = 0; k < n; k++) angs.push(Math.PI / n + k * 2 * Math.PI / n + .2);
  angs = angs.map(a => { let t = a, g = 0; while (!longeDasPontes(t) && g++ < 12) t += .12; return t; });
  ilha.u.topicos.forEach((tp, k) => {
    const a = angs[k], rr = R * .62, x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    const e = { ilha: i, topico: tp, x, z, pronto: tp.status === 'pronto', premium: tp.status === 'premium', cor: `hsl(${Math.floor(hash(k, i, 3) * 360)},60%,52%)`, nomeNpc: '' };
    criarNPC(e); ilha.estacoes.push(e); ESTACOES.push(e); ilha.obst.push({ x, z, r: .9 });
  });
  // decoração
  const qtd = Math.round((26 + tema.denso * 160) / 2);   // metade da decoração: ilhas mais livres para andar
  for (let k = 0, tent = 0; k < qtd && tent < qtd * 6; tent++) {
    const a = R0() * Math.PI * 2, rr = 3.5 + Math.sqrt(R0()) * (R - 4.6), x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    if (rr > R - 6 && !longeDasPontes(a)) continue;
    if (ilha.estacoes.some(e => Math.hypot(e.x - x, e.z - z) < 3.2) || Math.hypot(x - cx, z - cz) < 7.5) continue;
    const bruto = tema.dec[Math.floor(R0() * tema.dec.length)], tipo = MAPA_DEC[bruto] || bruto;
    if (!PARTES[tipo]) continue;
    const s = .75 + R0() * .6;
    (instancias[tipo] ||= []).push({ x, z, s, r: R0() * 6.3, ilha: i });
    if (tipo !== 'flor' && tipo !== 'bolha') ilha.obst.push({ x, z, r: tipo === 'casa' || tipo === 'sebe' ? 1.3 * s : .62 * s });
    k++;
  }
  // biocristais (coletáveis) e fragmentos de memória
  for (let k = 0; k < 5; k++) {
    const a = R0() * Math.PI * 2, rr = 5 + R0() * (R - 7);
    ORBES.push({ id: `o${i}_${k}`, ilha: i, x: cx + Math.cos(a) * rr, z: cz + Math.sin(a) * rr, fase: R0() * 6 });
  }
  if (ilha.estacoes.some(e => e.pronto)) for (let k = 0; k < 2; k++) {
    const a = R0() * Math.PI * 2, rr = 6 + R0() * (R - 8);
    FRAGS.push({ id: `f${i}_${k}`, ilha: i, x: cx + Math.cos(a) * rr, z: cz + Math.sin(a) * rr, fase: R0() * 6 });
  }
  if (ilha.estacoes.some(e => e.pronto)) for (let k = 0; k < 4; k++) {
    const a = R0() * Math.PI * 2, rr = 5 + R0() * (R - 7);
    PILULAS.push({ id: `p${i}_${k}`, ilha: i, x: cx + Math.cos(a) * rr, z: cz + Math.sin(a) * rr, fase: R0() * 6 });
  }
}

function criarNPC(e) {
  const g = new THREE.Group(); g.position.set(e.x, 1, e.z);
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.4, .22, 14), mat('#d8cfbd')); plat.position.y = .1; plat.receiveShadow = true; g.add(plat);
  if (e.premium) {
    const ouro = new THREE.MeshStandardMaterial({ color: '#d4a017', metalness: .6, roughness: .35, flatShading: true });
    const bau = new THREE.Mesh(new THREE.BoxGeometry(1.3, .8, .9), ouro); bau.position.y = .62; bau.castShadow = true;
    const tampa = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, 1.3, 10, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#b8860b', metalness: .6, roughness: .35 }));
    tampa.rotation.z = Math.PI / 2; tampa.position.y = 1.02; tampa.castShadow = true;
    const fecho = new THREE.Mesh(new THREE.BoxGeometry(.22, .3, .1), mat('#5d4037')); fecho.position.set(0, .8, .47);
    const cad = spriteEmoji('🔒', 1); cad.position.y = 2.1;
    const hal = brilho('#FFD166', 3.2); hal.position.y = 1;
    g.add(bau, tampa, fecho, cad, hal); e.halo = hal; scene.add(g); e.grupo = g; return;
  }
  if (!e.pronto) {
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(.35, .9, 8), mat('#ff8f00')); cone1.position.set(-.5, .6, 0); cone1.castShadow = true;
    const cone2 = cone1.clone(); cone2.position.x = .5;
    const placa = new THREE.Mesh(new THREE.BoxGeometry(1.6, .5, .12), mat('#fbc02d')); placa.position.y = 1.1; placa.castShadow = true;
    g.add(cone1, cone2, placa);
  } else {
    const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(.42, .7, 4, 10), mat(e.cor, { flatShading: false, roughness: .6 })); corpo.position.y = .85; corpo.castShadow = true;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.36, 14, 10), mat('#f1c8a5', { flatShading: false })); cab.position.y = 1.72; cab.castShadow = true;
    const cabelo = new THREE.Mesh(new THREE.SphereGeometry(.38, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat('#4e342e')); cabelo.position.y = 1.78;
    const gema = new THREE.Mesh(new THREE.OctahedronGeometry(.3, 0), new THREE.MeshBasicMaterial({ color: '#FFD166' })); gema.position.y = 2.75;
    const hal = brilho('#FFD166', 1.6); hal.position.y = 2.75;
    g.add(corpo, cab, cabelo, gema, hal); e.gema = gema; e.halo = hal; e.cabeca = cab;
  }
  scene.add(g); e.grupo = g;
}

function construirPonte(p) {
  const g = new THREE.Group();
  const tab = new THREE.Mesh(new THREE.BoxGeometry(2.8, .28, p.len), mat('#a87b4f')); tab.position.y = .92; tab.castShadow = true; tab.receiveShadow = true; g.add(tab);
  for (const lado of [-1.35, 1.35]) { const c = new THREE.Mesh(new THREE.BoxGeometry(.14, .14, p.len), mat('#7d5a35')); c.position.set(lado, 1.75, 0); g.add(c); }
  const npost = Math.max(2, Math.round(p.len / 3));
  for (let k = 0; k <= npost; k++) for (const lado of [-1.35, 1.35]) {
    const ps = new THREE.Mesh(new THREE.CylinderGeometry(.11, .13, 1.6, 6), mat('#7d5a35')); ps.position.set(lado, 1.2, -p.len / 2 + k * p.len / npost); ps.castShadow = true; g.add(ps);
  }
  g.position.set(p.sx + p.ux * p.len / 2, 0, p.sz + p.uz * p.len / 2); g.rotation.y = p.ang; scene.add(g);
  const barreira = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.2), new THREE.MeshBasicMaterial({ color: '#ff5d7a', transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  barreira.position.set(p.sx + p.ux * 3, 2.1, p.sz + p.uz * 3); barreira.rotation.y = p.ang; scene.add(barreira);
  const cad = spriteEmoji('🔒', 1.4); cad.position.set(barreira.position.x, 3.6, barreira.position.z); scene.add(cad);
  p.barreira = barreira; p.cadeado = cad;
}

// coletáveis renderizados como malhas individuais leves
const orbeGeo = new THREE.IcosahedronGeometry(.32, 0), orbeMat = new THREE.MeshBasicMaterial({ color: '#7DF9FF' });
const fragGeo = new THREE.BoxGeometry(.62, .82, .06), fragMat = new THREE.MeshBasicMaterial({ color: '#C9A7FF' });
const pilGeo = new THREE.CapsuleGeometry(.17, .36, 4, 10), pilMat = new THREE.MeshBasicMaterial({ color: '#FF8FAB' });
const disponivel = (v, prazo) => !v || v === true || (typeof v === 'number' && Date.now() - v > prazo);
function criarColetaveis() {
  for (const o of ORBES) { if (o.mesh || !disponivel(est.orbes[o.id], REPOE_CRISTAL)) continue; o.mesh = new THREE.Mesh(orbeGeo, orbeMat); o.glow = brilho('#7DF9FF', 1.6); scene.add(o.mesh, o.glow); }
  for (const f of FRAGS) { if (f.mesh || est.frags[f.id]) continue; f.mesh = new THREE.Mesh(fragGeo, fragMat); f.glow = brilho('#B388FF', 2.2); scene.add(f.mesh, f.glow); }
  for (const p of PILULAS) { if (p.mesh || !disponivel(est.pilulasCol[p.id], REPOE_PILULA)) continue; p.mesh = new THREE.Mesh(pilGeo, pilMat); p.glow = brilho('#FF8FAB', 1.8); scene.add(p.mesh, p.glow); }
}
const totalPilulas = ilha => (est.pilulas[ilha] || 0) + (est.pilulas[ilha - 1] || 0);
function gastarPilula(ilha) { for (const k of [ilha - 1, ilha]) if ((est.pilulas[k] || 0) > 0) { est.pilulas[k]--; return true; } return false; }
async function fatoDaIlha(il) {
  const prontas = il.estacoes.filter(e => e.pronto); if (!prontas.length) return null;
  const e = prontas[Math.floor(Math.random() * prontas.length)];
  try {
    const md = await textoAula(e.topico), itens = [];
    for (const [secao, rotulo] of [['Pegadinhas', 'Pegadinha'], ['Resumo relâmpago', 'Resumo']]) {
      const ini = md.indexOf('## ' + secao); if (ini < 0) continue;
      const fim = md.indexOf('\n## ', ini + 4), bloco = md.slice(ini, fim < 0 ? undefined : fim);
      for (const l of bloco.split('\n')) if (l.startsWith('- ')) itens.push(rotulo + ': ' + l.slice(2).replace(/\*\*/g, '').replace(/\*/g, '').trim());
    }
    if (!itens.length) return null;
    return { titulo: e.topico.titulo, texto: itens[Math.floor(Math.random() * itens.length)] };
  } catch { return null; }
}
function toastLongo(ic, titulo, texto) {
  const d = document.createElement('div'); d.className = 'toast vidro longo'; d.innerHTML = '<span class="ic">' + ic + '</span><div>' + esc(titulo) + '<small>' + esc(texto) + '</small></div>';
  $('toasts').appendChild(d); setTimeout(() => d.remove(), 8200);
}
// ---------- poderes dos biocristais ----------
function atualizarPoderes() {
  if (!est) return;
  $('carteira').innerHTML = '<span title="Biocristais: energia para os poderes">💎 ' + (est.cristais || 0) + '</span><span title="Pílulas de conhecimento guardadas">💊 ' + Object.values(est.pilulas).reduce((a, b) => a + b, 0) + '</span>';
  $('pdSonda').disabled = (est.cristais || 0) < 5 || tempo < sondaAte; $('pdSalto').disabled = (est.cristais || 0) < 10;
}
function usarSonda() {
  if (!emJogo || pausado) return;
  if ((est.cristais || 0) < 5) return toast('💎', 'Faltam biocristais', 'A sonda custa 5 💎');
  const il = ilhaPerto(jog.x, jog.z) || ILHAS[ilhaAtual]; if (!il) return;
  est.cristais -= 5; sondaAte = tempo + 45; salvar(); atualizarPoderes(); SFX.desbloqueio();
  feixes.forEach(f => scene.remove(f)); feixes = [];
  const alvos = [...PILULAS.filter(p => p.ilha === il.i && p.mesh), ...FRAGS.filter(f => f.ilha === il.i && f.mesh), ...il.estacoes.filter(e => e.pronto && !est.feitas[e.topico.id])];
  for (const a of alvos) {
    const cor = PILULAS.includes(a) ? '#FF8FAB' : FRAGS.includes(a) ? '#B388FF' : '#FFD166';
    const f = new THREE.Mesh(new THREE.CylinderGeometry(.35, .35, 26, 10, 1, true), new THREE.MeshBasicMaterial({ color: cor, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    f.position.set(a.x, 14, a.z); scene.add(f); feixes.push(f);
  }
  toast('🛰️', 'Sonda de reconhecimento ativada', alvos.length + ' sinais nesta ilha por 45 s');
}
function usarSalto() {
  if (!emJogo || pausado) return;
  if ((est.cristais || 0) < 10) return toast('💎', 'Faltam biocristais', 'O salto de dobra custa 10 💎');
  modoSalto = true; abrirMapa(); toast('🌀', 'Salto de dobra pronto', 'Toque numa ilha desbloqueada para saltar');
}
function saltarPara(il) {
  est.cristais -= 10; modoSalto = false; salvar(); atualizarPoderes();
  explosao(jog.x, jog.y + 1, jog.z, ['#6EC8FF', '#B388FF', '#ffffff'], 80, 9); SFX.evolucao();
  jog.x = il.cx; jog.z = il.cz + 5; jog.y = 4; jog.vy = 0;
  setTimeout(() => explosao(jog.x, 2, jog.z, ['#6EC8FF', '#B388FF', '#ffffff'], 90, 9), 120);
  toast('🌀', 'Salto concluído', il.u.regiao_mundo.nome);
}

// ---------- avatar 3D (8 formas) ----------
const avatar = new THREE.Group(); scene.add(avatar);
let formas = [], formaVisivel = -1;
function olhos(g, y, z, sep, r = .11) {
  for (const s of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), new THREE.MeshStandardMaterial({ color: '#fff', roughness: .3 })); b.position.set(s * sep, y, z);
    const p = new THREE.Mesh(new THREE.SphereGeometry(r * .55, 8, 6), new THREE.MeshBasicMaterial({ color: '#111' })); p.position.set(s * sep, y, z + r * .65);
    g.add(b, p);
  }
}
function montarFormas(corHex) {
  formas.forEach(f => avatar.remove(f.g)); formas = [];
  const cor = new THREE.Color(corHex), escura = cor.clone().offsetHSL(0, 0, -.18), suave = (c, e = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .45, ...e });
  const add = (g, m, ...meshes) => { meshes.forEach(x => { x.castShadow = true; g.add(x); }); };
  // 0 bactéria
  { const g = new THREE.Group(), corpo = new THREE.Mesh(new THREE.CapsuleGeometry(.42, .8, 8, 16), suave(cor)); corpo.rotation.x = Math.PI / 2; corpo.position.y = .55;
    add(g, null, corpo); olhos(g, .72, .72, .17);
    const flag = []; for (let k = 0; k < 7; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.08 - k * .007, 6, 4), suave(escura)); g.add(s); flag.push(s); }
    formas.push({ g, upd: (t, mv) => flag.forEach((s, k) => s.position.set(Math.sin(t * 16 - k * .9) * .16 * (k / 6 + .3), .55, -.85 - k * .17)) }); }
  // 1 ameba
  { const g = new THREE.Group(), geo = new THREE.IcosahedronGeometry(.72, 3), basep = geo.attributes.position.array.slice();
    const corpo = new THREE.Mesh(geo, suave(cor, { transparent: true, opacity: .85 })); corpo.position.y = .7;
    const nuc = new THREE.Mesh(new THREE.SphereGeometry(.26, 12, 8), suave('#4527a0')); nuc.position.set(-.1, .66, -.05);
    add(g, null, corpo, nuc); olhos(g, .9, .58, .2);
    formas.push({ g, upd: t => { const p = geo.attributes.position.array; for (let k = 0; k < p.length; k += 3) { const x = basep[k], y = basep[k + 1], z = basep[k + 2], f = 1 + Math.sin(t * 3 + x * 4 + y * 3) * .08 + Math.sin(t * 2.2 + z * 5) * .05; p[k] = x * f; p[k + 1] = y * f; p[k + 2] = z * f; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); } }); }
  // 2 água-viva
  { const g = new THREE.Group(), domo = new THREE.Mesh(new THREE.SphereGeometry(.68, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), suave(cor, { transparent: true, opacity: .82, emissive: cor, emissiveIntensity: .25 }));
    domo.position.y = 1.15; add(g, null, domo); olhos(g, 1.35, .52, .2);
    const tent = []; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2, tt = new THREE.Mesh(new THREE.CylinderGeometry(.035, .015, 1, 5), suave(escura)); tt.position.set(Math.cos(a) * .42, .65, Math.sin(a) * .42); g.add(tt); tent.push({ tt, a }); }
    formas.push({ g, upd: t => { domo.scale.set(1 + Math.sin(t * 4) * .06, 1 - Math.sin(t * 4) * .08, 1 + Math.sin(t * 4) * .06); tent.forEach(({ tt, a }, k) => { tt.rotation.x = Math.sin(t * 3 + k) * .3; tt.rotation.z = Math.cos(t * 3 + k) * .3; }); g.position.y = Math.sin(t * 2) * .12; } }); }
  // 3 peixe
  { const g = new THREE.Group(), corpo = new THREE.Mesh(new THREE.SphereGeometry(.5, 18, 12), suave(cor)); corpo.scale.set(.75, .9, 1.35); corpo.position.y = .95;
    const cauda = new THREE.Mesh(new THREE.ConeGeometry(.42, .7, 4), suave(escura)); cauda.rotation.x = -Math.PI / 2; cauda.position.set(0, .95, -.85);
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(.18, .5, 4), suave(escura)); dorsal.position.set(0, 1.45, -.05);
    add(g, null, corpo, cauda, dorsal); olhos(g, 1.08, .52, .24);
    formas.push({ g, upd: (t, mv) => { cauda.rotation.y = Math.sin(t * (mv ? 14 : 5)) * .5; g.position.y = Math.sin(t * 2.4) * .1; g.rotation.z = Math.sin(t * 3) * .05; } }); }
  // 4 anfíbio
  { const g = new THREE.Group(), corpo = new THREE.Mesh(new THREE.SphereGeometry(.55, 16, 12), suave(cor)); corpo.scale.set(1, .72, 1.1); corpo.position.y = .5;
    const barriga = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 8), suave('#e8f5c8')); barriga.scale.set(1, .5, 1); barriga.position.set(0, .38, .18);
    const pernas = []; for (const [x, z] of [[-.42, -.25], [.42, -.25], [-.32, .35], [.32, .35]]) { const p = new THREE.Mesh(new THREE.SphereGeometry(.17, 8, 6), suave(escura)); p.scale.set(1, .6, 1.5); p.position.set(x, .14, z); g.add(p); pernas.push(p); }
    add(g, null, corpo, barriga);
    for (const s of [-1, 1]) { const o = new THREE.Mesh(new THREE.SphereGeometry(.17, 12, 8), suave(cor)); o.position.set(s * .25, .85, .3); g.add(o); }
    olhos(g, .9, .4, .25, .1);
    formas.push({ g, upd: (t, mv) => { g.position.y = mv ? Math.abs(Math.sin(t * 7)) * .35 : 0; corpo.scale.y = .72 + (mv ? 0 : Math.sin(t * 3) * .03); } }); }
  // 5 réptil
  { const g = new THREE.Group(), corpo = new THREE.Mesh(new THREE.CapsuleGeometry(.28, .9, 6, 12), suave(cor)); corpo.rotation.x = Math.PI / 2; corpo.position.y = .38;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.27, 12, 8), suave(cor)); cab.scale.set(1, .8, 1.3); cab.position.set(0, .45, .78);
    const cauda = new THREE.Mesh(new THREE.ConeGeometry(.2, 1.1, 8), suave(escura)); cauda.rotation.x = -Math.PI / 2; cauda.position.set(0, .34, -1.05);
    add(g, null, corpo, cab, cauda); olhos(g, .58, .95, .14, .07);
    const pernas = []; for (const [x, z] of [[-.3, .35], [.3, .35], [-.3, -.35], [.3, -.35]]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .35, 6), suave(escura)); p.position.set(x, .18, z); p.rotation.z = x > 0 ? -.7 : .7; g.add(p); pernas.push(p); }
    for (let k = 0; k < 5; k++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(.07, .2, 4), suave(escura)); sp.position.set(0, .68, .4 - k * .22); g.add(sp); }
    formas.push({ g, upd: (t, mv) => { pernas.forEach((p, k) => p.rotation.x = mv ? Math.sin(t * 14 + k * Math.PI) * .6 : 0); cauda.rotation.y = Math.sin(t * (mv ? 10 : 2)) * .35; } }); }
  // 6 ave
  { const g = new THREE.Group(), corpo = new THREE.Mesh(new THREE.SphereGeometry(.5, 16, 12), suave(cor)); corpo.scale.set(.9, 1, 1.1); corpo.position.y = .85;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.32, 14, 10), suave(cor)); cab.position.set(0, 1.42, .2);
    const bico = new THREE.Mesh(new THREE.ConeGeometry(.1, .32, 6), suave('#ff8f00')); bico.rotation.x = Math.PI / 2; bico.position.set(0, 1.38, .55);
    add(g, null, corpo, cab, bico); olhos(g, 1.5, .42, .14, .08);
    const asas = []; for (const s of [-1, 1]) { const a = new THREE.Mesh(new THREE.BoxGeometry(.75, .06, .5), suave(escura)); a.geometry.translate(s * .37, 0, 0); a.position.set(s * .38, 1, -.05); a.castShadow = true; g.add(a); asas.push({ a, s }); }
    for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .4, 5), suave('#ff8f00')); p.position.set(s * .15, .2, 0); g.add(p); }
    formas.push({ g, upd: (t, mv) => { asas.forEach(({ a, s }) => a.rotation.z = s * Math.sin(t * (mv ? 18 : 3)) * (mv ? .8 : .2)); g.position.y = mv ? Math.abs(Math.sin(t * 9)) * .25 : 0; } }); }
  // 7 explorador(a) cientista
  { const g = new THREE.Group(), jaleco = suave('#f7f9fc'), pele = suave('#f1c8a5');
    const pernas = []; for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(.12, .45, 4, 8), suave('#37474f')); p.geometry.translate(0, -.28, 0); p.position.set(s * .15, .62, 0); p.castShadow = true; g.add(p); pernas.push(p); }
    const tronco = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .55, 6, 12), jaleco); tronco.position.y = 1.12;
    const lenco = new THREE.Mesh(new THREE.TorusGeometry(.24, .07, 8, 16), suave(cor)); lenco.rotation.x = Math.PI / 2; lenco.position.y = 1.5;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 12), pele); cab.position.y = 1.8;
    const cabelo = new THREE.Mesh(new THREE.SphereGeometry(.315, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.2), suave('#3e2723')); cabelo.position.y = 1.84;
    const aba = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .05, 18), suave('#c8a46e')); aba.position.y = 2.02;
    const copa = new THREE.Mesh(new THREE.CylinderGeometry(.27, .3, .25, 14), suave('#c8a46e')); copa.position.y = 2.15;
    const mochila = new THREE.Mesh(new THREE.BoxGeometry(.45, .55, .25), suave('#8d6e4a')); mochila.position.set(0, 1.18, -.33);
    const faixa = new THREE.Mesh(new THREE.BoxGeometry(.47, .1, .27), suave(cor)); faixa.position.set(0, 1.3, -.33);
    add(g, null, tronco, lenco, cab, cabelo, aba, copa, mochila, faixa); olhos(g, 1.82, .26, .11, .06);
    const bracos = []; for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .42, 4, 8), jaleco); b.geometry.translate(0, -.25, 0); b.position.set(s * .38, 1.38, 0); b.castShadow = true; g.add(b); bracos.push(b); }
    const lupa = new THREE.Mesh(new THREE.TorusGeometry(.11, .025, 6, 14), suave('#90a4ae')); lupa.position.set(.42, .82, .12); g.add(lupa);
    formas.push({ g, upd: (t, mv) => { const k = mv ? Math.sin(t * 11) * .7 : Math.sin(t * 2) * .05; pernas[0].rotation.x = k; pernas[1].rotation.x = -k; bracos[0].rotation.x = -k * .8; bracos[1].rotation.x = k * .8; lupa.position.z = .12 + k * .25; } }); }
  formas.forEach(f => { f.g.visible = false; avatar.add(f.g); });
  formaVisivel = -1; mostrarForma(formaDe(nivelDe(est ? est.xp : 0)));
}
function mostrarForma(i) { formas.forEach((f, k) => f.g.visible = k === i); formaVisivel = i; }

// ---------- partículas ----------
const NP = 700, ppos = new Float32Array(NP * 3), pcor = new Float32Array(NP * 3), pvel = new Float32Array(NP * 3), pvida = new Float32Array(NP);
const pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3)); pgeo.setAttribute('color', new THREE.BufferAttribute(pcor, 3));
const pontos = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: .42, map: TEX_PONTO, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
pontos.frustumCulled = false; scene.add(pontos);
let pidx = 0; for (let k = 0; k < NP; k++) ppos[k * 3 + 1] = -999;
function explosao(x, y, z, cores, n = 60, forca = 7) {
  const c = new THREE.Color();
  for (let k = 0; k < n; k++) {
    const i = pidx = (pidx + 1) % NP, a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI - Math.PI / 2, v = forca * (.4 + Math.random());
    ppos.set([x, y, z], i * 3); pvel.set([Math.cos(a) * Math.cos(b) * v, Math.abs(Math.sin(b)) * v + 2, Math.sin(a) * Math.cos(b) * v], i * 3);
    c.set(cores[k % cores.length]); pcor.set([c.r, c.g, c.b], i * 3); pvida[i] = .8 + Math.random() * .9;
  }
}
function atualizarParticulas(dt) {
  for (let i = 0; i < NP; i++) {
    if (pvida[i] <= 0) continue; pvida[i] -= dt;
    if (pvida[i] <= 0) { ppos[i * 3 + 1] = -999; continue; }
    pvel[i * 3 + 1] -= 9 * dt; ppos[i * 3] += pvel[i * 3] * dt; ppos[i * 3 + 1] += pvel[i * 3 + 1] * dt; ppos[i * 3 + 2] += pvel[i * 3 + 2] * dt;
  }
  pgeo.attributes.position.needsUpdate = true; pgeo.attributes.color.needsUpdate = true;
}
// vagalumes / esporos ambientes
const NV = 160, vpos = new Float32Array(NV * 3), vbase = [];
for (let k = 0; k < NV; k++) vbase.push([Math.random() * 60 - 30, 1.5 + Math.random() * 6, Math.random() * 60 - 30, Math.random() * 6]);
const vgeo = new THREE.BufferGeometry(); vgeo.setAttribute('position', new THREE.BufferAttribute(vpos, 3));
const vaga = new THREE.Points(vgeo, new THREE.PointsMaterial({ size: .28, map: TEX_PONTO, color: '#e6ffb0', transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending }));
vaga.frustumCulled = false; scene.add(vaga);
// feixe de evolução
const feixe = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 40, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#FFD166', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
feixe.visible = false; scene.add(feixe);

// ---------- regras de jogo ----------
function precisa(ilha) { return Math.min(2, ilha.estacoes.filter(e => e.pronto).length); }
function feitasNa(ilha) { return ilha.estacoes.filter(e => est.feitas[e.topico.id]).length; }
function livre(i) { return est ? !!est.livres[i] : i < 3; }
function noChao(x, z) {
  for (const il of ILHAS) { if (!livre(il.i)) continue; const dx = x - il.cx, dz = z - il.cz; if (dx * dx + dz * dz < (il.R - 1) ** 2) return true; }
  for (const p of PONTES) {
    if (!(livre(p.a) && livre(p.b))) continue;
    const rx = x - p.sx, rz = z - p.sz, t = rx * p.ux + rz * p.uz;
    if (t > -1 && t < p.len + 1 && Math.abs(rx * -p.uz + rz * p.ux) < 1.1) return true;
  }
  return false;
}
function ilhaPerto(x, z) { let m = null, d = 1e9; for (const il of ILHAS) { const dd = Math.hypot(x - il.cx, z - il.cz) - il.R; if (dd < d) { d = dd; m = il; } } return d < 4 ? m : null; }
function bate(x, z) { const il = ilhaPerto(x, z); if (!il) return false; return il.obst.some(o => (x - o.x) ** 2 + (z - o.z) ** 2 < (o.r + .45) ** 2); }
const pode = (x, z) => noChao(x, z) && !bate(x, z);

function verificarDesbloqueios(anunciar) {
  for (const il of ILHAS) {
    const prox = ILHAS[il.i + 1];
    if (!livre(il.i) || !prox || livre(prox.i)) continue;
    if (feitasNa(il) >= precisa(il)) { est.livres[prox.i] = true; if (anunciar) animarDesbloqueio(prox); }
  }
}
let desbloqueando = [];
function animarDesbloqueio(il) {
  desbloqueando.push({ il, t: 0 });
  SFX.desbloqueio(); explosao(il.cx, 6, il.cz, ['#FFD166', '#7CFFB2', '#ffffff'], 140, 12);
  setTimeout(() => { banner('NOVA ILHA DESBLOQUEADA', il.u.regiao_mundo.nome, il.u.titulo); }, 400);
  toast('🗝️', 'Nova ilha desbloqueada!', `${il.u.regiao_mundo.nome} · siga pela ponte`);
  ganharXp(100, 'unidade concluída');
  diaria('regiao'); verificarConquistas();
}
function aplicarVisualBloqueio() {
  const dm = new THREE.Object3D();
  for (const il of ILHAS) {
    const ok = livre(il.i); il.cadeado.visible = !ok; il.rotulo.material.opacity = ok ? 1 : .55;
    for (const n of il.nuvens) { n.fator = ok ? 0 : 1; dm.position.set(n.x, n.y, n.z); dm.scale.set(n.s * 1.3 * n.fator + .0001, n.s * .75 * n.fator + .0001, n.s * n.fator + .0001); dm.updateMatrix(); nuvens.setMatrixAt(n.k, dm.matrix); }
    for (const e of il.estacoes) e.grupo.visible = ok;
  }
  nuvens.instanceMatrix.needsUpdate = true;
  for (const p of PONTES) { const ok = livre(p.a) && livre(p.b); p.barreira.visible = !ok && livre(p.a); p.cadeado.visible = !ok && livre(p.a); }
}

// ---------- XP, níveis, evolução ----------
function ganharXp(v, motivo) {
  const antes = nivelDe(est.xp); est.xp += v; const depois = nivelDe(est.xp);
  textoFlutuante(`+${v} XP`, motivo);
  atualizarHud(); salvar();
  if (depois > antes) setTimeout(() => evoluir(formaDe(antes), formaDe(depois), depois), 600);
}
let evo = null;
function evoluir(fa, fd, nivel) {
  if (fa === fd) { SFX.nivel(); toast('⭐', `Nível ${nivel}!`, 'Continue explorando para evoluir'); explosao(jog.x, jog.y + 1.5, jog.z, ['#FFD166', '#fff'], 70, 6); return; }
  evo = { t: 0, fa, fd, trocou: false }; pausado = true;
  $('ev1').textContent = 'EVOLUÇÃO!'; $('ev2').textContent = `${FORMAS[fa].nome}  →  ${FORMAS[fd].nome}  ·  Nível ${nivel}`;
  $('evolucao').classList.remove('oculto'); feixe.visible = true; SFX.evolucao();
  camCtl.alvoDist = 8;
}
function atualizarEvolucao(dt) {
  if (!evo) return;
  evo.t += dt; const t = evo.t;
  feixe.position.set(jog.x, jog.y + 20, jog.z); feixe.material.opacity = Math.min(.55, t * .8) * (t > 2.4 ? Math.max(0, 1 - (t - 2.4) * 2) : 1);
  feixe.rotation.y += dt * 3;
  avatar.rotation.y += dt * (6 + t * 6); avatar.position.y = jog.y + Math.min(1.6, t * 1.4) * (t < 2.2 ? 1 : Math.max(0, 1 - (t - 2.2) * 2));
  const pulso = 1 + Math.sin(t * 20) * .08 * (t < 1.3 ? 1 : 0); avatar.scale.setScalar(pulso);
  if (t < 1.3 && Math.random() < .5) explosao(jog.x, jog.y + 1, jog.z, ['#FFD166', '#fff59d'], 4, 3);
  if (t > 1.3 && !evo.trocou) { evo.trocou = true; mostrarForma(evo.fd); explosao(jog.x, jog.y + 1.5, jog.z, ['#FFD166', '#7CFFB2', '#6EC8FF', '#ffffff', '#FF8FAB'], 220, 11); }
  if (t > 3.2) { evo = null; feixe.visible = false; avatar.scale.setScalar(1); $('evolucao').classList.add('oculto'); pausado = !!document.querySelector('#veu:not(.oculto)'); camCtl.alvoDist = 15; verificarConquistas(); }
}

// ---------- HUD ----------
function atualizarHud() {
  const n = nivelDe(est.xp), ini = 50 * (n - 1) * n, fim = 50 * n * (n + 1), f = formaDe(n);
  $('pNome').textContent = est.nome; $('pForma').textContent = FORMAS[f].nome; $('nivelBadge').textContent = n;
  $('pXp').style.width = Math.round((est.xp - ini) / (fim - ini) * 100) + '%';
  $('pXpTxt').textContent = `${est.xp} XP · faltam ${fim - est.xp} para o nível ${n + 1}`;
  renderDiarias();
}
function retrato(t) {
  const g = $('retrato').getContext('2d'); g.clearRect(0, 0, 128, 128);
  window.Avatar2D.desenhar(g, 64, 74, formaDe(nivelDe(est.xp)), t, 1, 2.7, false);
}
let bannerT = 0;
function banner(a, b, c) { $('rg1').textContent = a; $('rg2').textContent = b; $('rg3').textContent = c || ''; $('regiao').classList.add('on'); clearTimeout(bannerT); bannerT = setTimeout(() => $('regiao').classList.remove('on'), 3600); }
function toast(ic, titulo, sub) {
  const d = document.createElement('div'); d.className = 'toast vidro'; d.innerHTML = `<span class="ic">${ic}</span><div>${esc(titulo)}${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
  $('toasts').appendChild(d); setTimeout(() => d.remove(), 3200);
}
const flutuantes = [];
function textoFlutuante(txt, sub) {
  const el = document.createElement('div'); el.style.cssText = 'position:fixed;pointer-events:none;font-family:Fredoka;font-weight:700;font-size:26px;color:#FFD166;text-shadow:0 2px 10px rgba(0,0,0,.7);z-index:20;white-space:nowrap;text-align:center';
  el.innerHTML = `${esc(txt)}${sub ? `<div style="font-size:13px;color:#fff;font-family:Nunito">${esc(sub)}</div>` : ''}`;
  document.body.appendChild(el); flutuantes.push({ el, t: 0, x: jog.x, y: jog.y + 2.6, z: jog.z });
}
function atualizarFlutuantes(dt) {
  const v = new THREE.Vector3();
  for (let k = flutuantes.length - 1; k >= 0; k--) {
    const f = flutuantes[k]; f.t += dt; v.set(f.x, f.y + f.t * 1.4, f.z).project(camera);
    f.el.style.left = ((v.x + 1) / 2 * innerWidth) + 'px'; f.el.style.top = ((1 - v.y) / 2 * innerHeight) + 'px';
    f.el.style.transform = `translate(-50%,-50%) scale(${1 + Math.min(.3, f.t)})`; f.el.style.opacity = Math.max(0, 1 - f.t / 1.6);
    if (f.t > 1.6) { f.el.remove(); flutuantes.splice(k, 1); }
  }
}
function mostrarCombo() { const el = $('combo'); if (combo < 2) { el.classList.remove('on'); return; } el.textContent = `COMBO ×${combo}`; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1400); }

// desafios do dia
const DIARIAS = [
  { id: 'missao', ic: '⚔️', txt: 'Cumprir 1 missão', meta: 1 },
  { id: 'orbes', ic: '💎', txt: 'Coletar 8 biocristais', meta: 8 },
  { id: 'frag', ic: '🧠', txt: 'Revisar 3 fragmentos de memória', meta: 3 },
];
function garantirDiarias() { if (!est.diarias || est.diarias.data !== hoje()) est.diarias = { data: hoje(), prog: {}, pagas: {} }; }
function diaria(id, n = 1) {
  garantirDiarias(); const d = DIARIAS.find(x => x.id === id); if (!d) return;
  est.diarias.prog[id] = Math.min(d.meta, (est.diarias.prog[id] || 0) + n);
  if (est.diarias.prog[id] >= d.meta && !est.diarias.pagas[id]) { est.diarias.pagas[id] = true; setTimeout(() => { toast('🏅', 'Desafio do dia concluído!', d.txt + ' · +60 XP'); SFX.conquista(); ganharXp(60, 'desafio do dia'); }, 500); }
  renderDiarias();
}
function renderDiarias() {
  if (!est) return; garantirDiarias();
  const feitos = DIARIAS.filter(d => est.diarias.pagas[d.id]).length;
  $('diarias').innerHTML = `<h4><span>🔥 Desafios de hoje</span><span style="color:var(--ouro)">${feitos}/3</span></h4>` + DIARIAS.map(d => {
    const p = est.diarias.prog[d.id] || 0, ok = est.diarias.pagas[d.id];
    return `<div class="dq ${ok ? 'ok' : ''}"><div class="ic">${ok ? '✅' : d.ic}</div><div style="flex:1"><div class="tx">${d.txt}</div><div class="bar"><div style="width:${p / d.meta * 100}%"></div></div></div><div style="font-size:12px;color:var(--sub)">${p}/${d.meta}</div></div>`;
  }).join('');
}
// conquistas
const CONQUISTAS = [
  { id: 'primeira', ic: '🥇', nome: 'Primeira missão', ok: () => Object.keys(est.feitas).length >= 1 },
  { id: 'cristais10', ic: '💎', nome: 'Garimpeiro de cristais', ok: () => (est.cristaisTotal || 0) >= 10 },
  { id: 'cristais40', ic: '👑', nome: 'Tesouro do arquipélago', ok: () => (est.cristaisTotal || 0) >= 40 },
  { id: 'ilhas3', ic: '🧭', nome: 'Navegador(a): 3 ilhas', ok: () => est.livres.filter(Boolean).length >= 3 },
  { id: 'ilhas10', ic: '🌍', nome: 'Desbravador(a): 10 ilhas', ok: () => est.livres.filter(Boolean).length >= 10 },
  { id: 'peixe', ic: '🐟', nome: 'Saiu da sopa primordial', ok: () => formaDe(nivelDe(est.xp)) >= 3 },
  { id: 'cientista', ic: '🔬', nome: 'Evolução completa', ok: () => formaDe(nivelDe(est.xp)) >= 7 },
  { id: 'combo5', ic: '🔥', nome: 'Combo ×5', ok: () => (est.maxCombo || 0) >= 5 },
];
function verificarConquistas() {
  for (const c of CONQUISTAS) if (!est.conquistas[c.id] && c.ok()) { est.conquistas[c.id] = true; setTimeout(() => { toast(c.ic, 'Conquista desbloqueada!', c.nome); SFX.conquista(); }, 300); }
  salvar();
}

// ---------- painéis ----------
function abrirPainel(html) { $('painel').innerHTML = html; $('veu').classList.remove('oculto'); pausado = true; SFX.abrir(); }
function fecharPainel() { $('veu').classList.add('oculto'); pausado = !!evo; }
$('veu').addEventListener('click', e => { if (e.target.id === 'veu') fecharPainel(); });
const cacheMd = {};
async function textoAula(tp) { return cacheMd[tp.id] ||= await fetch(BASE + tp.arquivo_md).then(r => r.text()); }
async function jsonTopico(tp) { return cacheJson[tp.id] ||= await fetch(BASE + tp.arquivo_json).then(r => r.json()); }
const iniciais = s => (s || '?').replace(/,.*/, '').split(/\s+/).filter(w => w.length > 2).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '★';
function escrever(el, texto, vel = 14) { el.textContent = ''; let k = 0; const it = setInterval(() => { el.textContent = texto.slice(0, ++k); if (k >= texto.length) clearInterval(it); }, vel); el.onclick = () => { clearInterval(it); el.textContent = texto; }; }

async function abrirEstacao(e) {
  const tp = e.topico, il = ILHAS[e.ilha], aula = `../index.html?volta=${encodeURIComponent(tp.id)}#${tp.id}`;
  if (e.premium) return painelPremium(e);
  if (!e.pronto) {
    abrirPainel(`<div class="etq">${esc(il.u.regiao_mundo.nome)}</div><h2>🚧 Estação em construção</h2><p style="color:var(--sub)">A missão de <b style="color:#fff">${esc(tp.titulo)}</b> está sendo preparada pela equipe pedagógica e chega em breve.</p><div class="acoesP"><button class="bt prim" id="ok">Continuar explorando</button></div>`);
    $('ok').onclick = fecharPainel; return;
  }
  let j; try { j = await jsonTopico(tp); } catch { return toast('⚠️', 'Não foi possível carregar a missão'); }
  const m = j.missao_mundo_aberto, feito = est.feitas[tp.id];
  abrirPainel(`
    <div class="etq">${esc(m.regiao || il.u.regiao_mundo.nome)} · missão de ${esc(m.mecanica || 'exploração')}</div>
    <h2>${feito ? '✅ ' : ''}${esc(m.titulo)}</h2>
    <div class="npc"><div class="rosto" style="background:${e.cor}">${iniciais(m.npc)}</div><div class="fala"><b>${esc(m.npc)}</b><div id="fala"></div></div></div>
    <div style="font-size:14.5px"><b style="color:var(--neon)">Objetivo:</b> ${esc(m.objetivo)}</div>
    <ol class="etapas">${(m.etapas || []).map((x, k) => `<li data-n="${k + 1}">${esc(x)}</li>`).join('')}</ol>
    <div class="premio"><span>✨ ${m.recompensa_xp} XP</span>${m.item_recompensa ? `<span>🎒 ${esc(m.item_recompensa)}</span>` : ''}<span>${tp.acesso === 'gratuito' ? '🔓 Gratuito' : '💎 Premium'}</span></div>
    <div class="acoesP"><button class="bt ouro" id="aceitar">${feito ? '⟳ Revisar o desafio' : '⚔️ Aceitar desafio'}</button><a class="bt roxo" href="${aula}" onclick="window.salvarJogo && salvarJogo()">📖 Estudar a aula</a><button class="bt" id="sair">Depois</button></div>`);
  escrever($('fala'), m.narrativa);
  $('sair').onclick = fecharPainel; $('aceitar').onclick = () => desafio(e, j, m);
}

async function painelPremium(e) {
  const tp = e.topico, il = ILHAS[e.ilha], raiz = window.RAIZ_SITE || '../../';
  let cont = null;
  try { if (window.SB) { const { data } = await window.SB.rpc('contagem_lista_espera'); cont = {}; for (const r of data) cont[r.plano] = r; } } catch { }
  const linha = (p, nome, ic) => {
    const c = cont && cont[p];
    const info = c ? c.inscritos + ' na lista · ' + c.vagas + ' vagas' : 'lista de espera';
    return '<a class="bt ' + (p === 'grupo' ? 'ouro' : 'roxo') + '" style="justify-content:space-between;width:100%;margin:6px 0;display:flex" href="' + raiz + 'index.html#lista-' + p + '" target="_blank" rel="noopener"><span>' + ic + ' ' + nome + '</span><span style="font-size:12.5px;opacity:.9">' + info + '</span></a>';
  };
  abrirPainel('<div class="etq">' + esc(il.u.regiao_mundo.nome) + ' · baú premium</div><h2>💎 ' + esc(tp.titulo) + '</h2>'
    + '<p style="color:var(--sub)">Este baú guarda uma missão premium: a aula completa, 10 questões por liga, flashcards, minijogos e a missão desta estação.</p>'
    + '<div class="premio"><span>🔒 Plataforma completa: 127 aulas</span><span>⭐ Preço de fundador para quem está na lista</span></div>'
    + linha('digital', 'Plataforma Completa', '🧬') + linha('grupo', 'Plataforma + Mentoria em Grupo', '👥') + linha('individual', 'Plataforma + Mentoria Individual', '🎯')
    + '<div class="acoesP"><button class="bt" id="sair">Continuar explorando</button></div>');
  $('sair').onclick = fecharPainel;
}

function desafio(e, j, m) {
  const qs = ['bronze', 'prata', 'ouro'].map(n => j.questoes.find(q => q.nivel === n)).filter(Boolean);
  let i = 0, acertos = 0, xpGanho = 0, timer = null;
  const BASEXP = { bronze: 10, prata: 15, ouro: 20, diamante: 30 };
  const passo = () => {
    if (i >= qs.length) return fim();
    const q = qs[i], limite = 30; let resta = limite, respondeu = false, protegido = false, ajuda = 1;
    if (window.EXP) window.EXP.questaoAtual = q;
    abrirPainel(`<div style="display:flex;justify-content:space-between;align-items:center"><span class="etq">Desafio ${i + 1}/${qs.length}</span><span class="liga l-${q.nivel}">Liga ${q.nivel}</span></div>
      <div class="timer"><div id="tm" style="width:100%"></div></div>
      <div class="questao">${esc(q.enunciado)}</div>
      ${q.alternativas.map((a, n) => `<button class="alt" data-n="${n}"><span class="let">${'ABCDE'[n]}</span><span>${esc(a)}</span></button>`).join('')}
      <div class="ajudas"><button class="bt" id="usarPilula" ${totalPilulas(e.ilha) ? '' : 'disabled'}>💊 Pílula (${totalPilulas(e.ilha)}) <small>elimina 2</small></button><button class="bt roxo" id="usarMsg" ${(est.cristais || 0) >= 15 ? '' : 'disabled'}>⏳ Mensagem do futuro <small>15 💎</small></button></div><div id="fb"></div>`);
    const eliminar = n => { const erradas = [...document.querySelectorAll('.alt')].filter(b => +b.dataset.n !== q.correta && !b.classList.contains('eliminada')); erradas.sort(() => Math.random() - .5).slice(0, n).forEach(b => { b.classList.add('eliminada'); b.disabled = true; }); };
    $('usarPilula').onclick = () => { if (respondeu || !gastarPilula(e.ilha)) return; eliminar(2); ajuda = Math.min(ajuda, .75); $('usarPilula').disabled = true; SFX.coleta(); salvar(); atualizarPoderes(); };
    $('usarMsg').onclick = () => { if (respondeu || (est.cristais || 0) < 15) return; est.cristais -= 15; eliminar([...document.querySelectorAll('.alt')].filter(b => +b.dataset.n !== q.correta && !b.classList.contains('eliminada')).length - 1); protegido = true; ajuda = .5; $('usarMsg').disabled = true; $('usarPilula').disabled = true; SFX.evolucao(); salvar(); atualizarPoderes(); toast('⏳', 'Mensagem do futuro recebida', 'Sobraram 2 alternativas e seu combo está protegido'); };
    clearInterval(timer);
    timer = setInterval(() => { resta -= .1; const el = $('tm'); if (el) el.style.width = Math.max(0, resta / limite * 100) + '%'; if (resta <= 0) clearInterval(timer); }, 100);
    document.querySelectorAll('.alt').forEach(b => b.onclick = () => {
      if (respondeu) return; respondeu = true; clearInterval(timer);
      const ok = +b.dataset.n === q.correta;
      document.querySelectorAll('.alt').forEach(x => { x.disabled = true; if (+x.dataset.n === q.correta) x.classList.add('certa'); });
      let extra = '';
      if (ok) {
        acertos++; combo++; est.maxCombo = Math.max(est.maxCombo || 0, combo);
        const rapido = resta > limite - 12, mult = 1 + .25 * (Math.min(combo, 5) - 1), v = Math.round((BASEXP[q.nivel] * mult + (rapido ? 5 : 0)) * ajuda);
        xpGanho += v; extra = ` <b style="color:var(--ouro)">+${v} XP</b>${rapido ? ' ⚡ resposta rápida' : ''}${combo > 1 ? ` · combo ×${combo}` : ''}`;
        SFX.certo(); mostrarCombo();
      } else { b.classList.add('errada'); if (!protegido) combo = 0; SFX.errado(); }
      document.querySelectorAll('.ajudas .bt').forEach(x => x.disabled = true);
      $('fb').innerHTML = `<div class="exp">${ok ? '✅ <b>Isso!</b>' : '❌ <b>Quase.</b>'}${extra}<br>${esc(q.explicacao)}</div><div class="acoesP"><button class="bt prim" id="prox">Continuar →</button></div>`;
      $('prox').onclick = () => { i++; passo(); };
    });
  };
  const fim = () => {
    const venceu = acertos >= 2, jaFeito = !!est.feitas[e.topico.id];
    if (venceu && !jaFeito) { est.feitas[e.topico.id] = true; if (m.item_recompensa) est.itens.push(m.item_recompensa); }
    const estrelas = [1, 2, 3].map(k => `<span class="${k <= acertos ? '' : 'off'}">⭐</span>`).join('');
    abrirPainel(`<div class="estrelas">${estrelas}</div><h2 style="text-align:center">${venceu ? (jaFeito ? 'Revisão concluída!' : 'Missão cumprida!') : 'Quase lá!'}</h2>
      <p style="text-align:center;color:var(--sub)">Você acertou <b style="color:#fff">${acertos} de ${qs.length}</b>.</p>
      ${venceu && !jaFeito ? `<div class="premio" style="justify-content:center"><span>✨ ${m.recompensa_xp} XP da missão</span><span>⚔️ ${xpGanho} XP das respostas</span>${m.item_recompensa ? `<span>🎒 ${esc(m.item_recompensa)}</span>` : ''}</div>` : ''}
      ${!venceu ? '<p style="text-align:center">Estude a aula e volte: são necessárias 2 respostas certas.</p>' : ''}
      <div class="acoesP" style="justify-content:center"><button class="bt prim" id="ok">Voltar à expedição</button>${!venceu ? `<a class="bt roxo" href="../index.html?volta=${encodeURIComponent(e.topico.id)}#${e.topico.id}" onclick="window.salvarJogo && salvarJogo()">📖 Estudar a aula</a>` : ''}</div>`);
    $('ok').onclick = () => {
      fecharPainel();
      if (venceu) {
        explosao(e.x, 3, e.z, ['#FFD166', '#7CFFB2', '#FF8FAB', '#6EC8FF'], 120, 9);
        ganharXp((jaFeito ? 0 : (m.recompensa_xp || 100)) + xpGanho, jaFeito ? 'revisão' : 'missão cumprida');
        if (!jaFeito) { diaria('missao'); }
        verificarDesbloqueios(true); aplicarVisualBloqueio(); verificarConquistas();
      } else if (xpGanho) ganharXp(xpGanho, 'respostas certas');
    };
  };
  passo();
}

async function abrirFragmento(f) {
  const il = ILHAS[f.ilha], prontas = il.estacoes.filter(e => e.pronto);
  const e = prontas[Math.floor(hash(f.ilha, +f.id.split('_')[1], 77) * prontas.length)];
  let j; try { j = await jsonTopico(e.topico); } catch { return; }
  const card = j.flashcards[Math.floor(Math.random() * j.flashcards.length)];
  abrirPainel(`<div class="etq">🧠 Fragmento de memória · ${esc(e.topico.titulo)}</div><h2>Você se lembra?</h2>
    <div class="flashcard" id="fc"><div class="face frente" id="fcFace">${esc(card.frente)}</div></div>
    <p style="text-align:center;color:var(--sub);font-size:13px" id="dicaFc">Pense na resposta e toque no cartão para virar</p>
    <div class="acoesP oculto" id="resp" style="justify-content:center"><button class="bt" id="esq">😅 Esqueci</button><button class="bt prim" id="lem">😎 Lembrei!</button></div>`);
  // uma face só: gira até 90°, troca o texto pelo verso e completa o giro (nunca há dois textos empilhados)
  $('fc').onclick = () => {
    if ($('fc').dataset.virado) return; $('fc').dataset.virado = 1;
    const fa = $('fcFace'); fa.style.transition = 'transform .25s ease-in'; fa.style.transform = 'rotateY(90deg)';
    setTimeout(() => { fa.textContent = card.verso; fa.className = 'face verso'; fa.style.transition = 'transform .25s ease-out'; fa.style.transform = 'rotateY(0deg)'; }, 250);
    $('resp').classList.remove('oculto'); $('dicaFc').textContent = 'Seja sincero(a): isso ajuda a revisão espaçada a acertar o momento certo.'; };
  const fechar = v => { est.frags[f.id] = true; fecharPainel(); removerColetavel(f); ganharXp(v, 'fragmento revisado'); diaria('frag'); SFX.coleta(); explosao(f.x, 2, f.z, ['#B388FF', '#ffffff'], 40, 5); };
  $('esq').onclick = () => fechar(2); $('lem').onclick = () => fechar(6);
}
function removerColetavel(c) { if (c.mesh) { scene.remove(c.mesh, c.glow); c.mesh = null; } }

// ---------- mapa e minimapa ----------
function limitesMundo() { const xs = ILHAS.map(i => i.cx), zs = ILHAS.map(i => i.cz); return { x0: Math.min(...xs) - 30, x1: Math.max(...xs) + 30, z0: Math.min(...zs) - 30, z1: Math.max(...zs) + 30 }; }
function desenharMinimapa() {
  const c = $('minimapa'), g = c.getContext('2d'), W = c.width, k = 2.6;
  g.clearRect(0, 0, W, W); g.save(); g.beginPath(); g.arc(W / 2, W / 2, W / 2, 0, 7); g.clip();
  g.fillStyle = 'rgba(16,60,96,.92)'; g.fillRect(0, 0, W, W);
  const px = x => W / 2 + (x - jog.x) * k, pz = z => W / 2 + (z - jog.z) * k;
  g.strokeStyle = '#c49a6c'; g.lineWidth = 6;
  for (const p of PONTES) { if (!livre(p.a)) continue; g.globalAlpha = livre(p.b) ? 1 : .4; g.beginPath(); g.moveTo(px(p.sx), pz(p.sz)); g.lineTo(px(p.sx + p.ux * p.len), pz(p.sz + p.uz * p.len)); g.stroke(); }
  g.globalAlpha = 1;
  for (const il of ILHAS) {
    g.fillStyle = livre(il.i) ? il.tema.chao[0] : '#5b6878'; g.beginPath(); g.arc(px(il.cx), pz(il.cz), il.R * k, 0, 7); g.fill();
    if (!livre(il.i)) continue;
    for (const e of il.estacoes) { g.fillStyle = e.premium ? '#d4a017' : !e.pronto ? '#ff9800' : est.feitas[e.topico.id] ? '#36D399' : '#FFD166'; g.beginPath(); g.arc(px(e.x), pz(e.z), 5, 0, 7); g.fill(); }
  }
  g.fillStyle = '#7DF9FF'; for (const o of ORBES) if (o.mesh) { g.beginPath(); g.arc(px(o.x), pz(o.z), 2.5, 0, 7); g.fill(); }
  g.fillStyle = '#C9A7FF'; for (const f of FRAGS) if (f.mesh) { g.fillRect(px(f.x) - 3, pz(f.z) - 4, 6, 8); }
  g.fillStyle = '#FF8FAB'; for (const p of PILULAS) if (p.mesh) { g.beginPath(); g.ellipse(px(p.x), pz(p.z), 4.5, 2.5, .9, 0, 7); g.fill(); }
  g.translate(W / 2, W / 2); g.rotate(-jog.rot + Math.PI); g.fillStyle = '#fff'; g.strokeStyle = '#ff2d55'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, -14); g.lineTo(10, 10); g.lineTo(0, 5); g.lineTo(-10, 10); g.closePath(); g.fill(); g.stroke();
  g.restore();
}
function abrirMapa() {
  const c = $('mapaCanvas'), g = c.getContext('2d'), L = limitesMundo();
  const k = Math.min(innerWidth * .9 / (L.x1 - L.x0), innerHeight * .8 / (L.z1 - L.z0)), d = Math.min(2, devicePixelRatio || 1);
  c.width = (L.x1 - L.x0) * k * d; c.height = (L.z1 - L.z0) * k * d; c.style.width = (L.x1 - L.x0) * k + 'px'; g.scale(d, d);
  const px = x => (x - L.x0) * k, pz = z => (z - L.z0) * k;
  const gr = g.createLinearGradient(0, 0, 0, c.height); gr.addColorStop(0, '#0f4d7a'); gr.addColorStop(1, '#0a2f52'); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#c49a6c'; g.lineWidth = 3 * k;
  for (const p of PONTES) { g.globalAlpha = livre(p.a) && livre(p.b) ? 1 : .3; g.beginPath(); g.moveTo(px(p.sx), pz(p.sz)); g.lineTo(px(p.sx + p.ux * p.len), pz(p.sz + p.uz * p.len)); g.stroke(); }
  g.globalAlpha = 1;
  for (const il of ILHAS) {
    const x = px(il.cx), z = pz(il.cz), r = il.R * k, ok = livre(il.i);
    g.fillStyle = '#f0dfae'; g.beginPath(); g.arc(x, z, r * 1.12, 0, 7); g.fill();
    g.fillStyle = ok ? il.tema.chao[0] : '#4a5666'; g.beginPath(); g.arc(x, z, r, 0, 7); g.fill();
    if (il.i === ilhaAtual) { g.strokeStyle = '#FFD166'; g.lineWidth = 3; g.stroke(); }
    g.textAlign = 'center'; g.fillStyle = '#fff'; g.font = `700 ${Math.max(9, r * .26)}px Fredoka, sans-serif`;
    g.fillText((ok ? '' : '🔒 ') + il.u.regiao_mundo.nome, x, z - 2, r * 2.2);
    g.font = `600 ${Math.max(8, r * .19)}px Nunito, sans-serif`; g.fillStyle = 'rgba(255,255,255,.85)';
    g.fillText(`${il.u.serie}ª série · ${feitasNa(il)}/${il.estacoes.filter(e => e.pronto).length} missões`, x, z + r * .3, r * 2.2);
  }
  g.fillStyle = '#ff2d55'; g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(px(jog.x), pz(jog.z), 7, 0, 7); g.fill(); g.stroke();
  mapaInfo = { L, k };
  document.querySelector('#mapa .leg').textContent = modoSalto ? '🌀 Salto de dobra: toque numa ilha desbloqueada (10 💎) · toque fora para cancelar' : 'Clique ou tecle M para fechar · ilhas com névoa ainda estão bloqueadas';
  $('mapa').classList.remove('oculto'); pausado = true;
}
function fecharMapa() { $('mapa').classList.add('oculto'); pausado = !!evo || !$('veu').classList.contains('oculto'); }
$('mapa').onclick = ev => {
  if (modoSalto && mapaInfo && ev.target.id === 'mapaCanvas') {
    const r = ev.target.getBoundingClientRect(), wx = mapaInfo.L.x0 + (ev.clientX - r.left) / mapaInfo.k, wz = mapaInfo.L.z0 + (ev.clientY - r.top) / mapaInfo.k;
    const il = ILHAS.find(x => livre(x.i) && Math.hypot(x.cx - wx, x.cz - wz) < x.R * 1.15);
    if (il) { fecharMapa(); saltarPara(il); return; }
  }
  modoSalto = false; fecharMapa();
}; $('btMapa').onclick = abrirMapa;
$('btSom').onclick = () => { mudo = !mudo; $('btSom').textContent = mudo ? '🔇' : '🔊'; };

// ---------- modo demonstração ----------
// T leva à ilha seguinte (de 1 a 26, voltando ao início); se estiver trancada, a demonstração a destranca
function teletransporteDemo() {
  const al = ILHAS[(ilhaAtual + 1) % ILHAS.length];
  if (!livre(al.i)) { est.livres[al.i] = true; aplicarVisualBloqueio(); }
  explosao(jog.x, jog.y + 1, jog.z, ['#6EC8FF', '#B388FF', '#ffffff'], 60, 8); SFX.evolucao();
  jog.x = al.cx; jog.z = al.cz + 5; jog.y = 4; jog.vy = 0;
  salvar();
  toast('🌀', 'Teletransporte', al.u.regiao_mundo.nome);
}
function desbloquearDemo() { const prox = ILHAS.find(il => !livre(il.i)); if (prox) { est.livres[prox.i] = true; aplicarVisualBloqueio(); animarDesbloqueio(prox); salvar(); } }
$('dmXp').onclick = () => ganharXp(250, 'modo demonstração');
$('dmIlha').onclick = desbloquearDemo;
$('dmTele').onclick = teletransporteDemo;

// ---------- entrada ----------
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; teclas[k] = true;
  if (k === 'Escape') { fecharPainel(); fecharMapa(); }
  if (!emJogo) return;
  if (k === 'm') $('mapa').classList.contains('oculto') ? abrirMapa() : fecharMapa();
  if (pausado) return;
  if (k === 'e' || k === 'Enter') { const s = estacaoProxima(); if (s) abrirEstacao(s); }
  if (k === '1') usarSonda();
  if (k === '2') usarSalto();
  if (k === ' ' && jog.chao) { jog.vy = 8.5; jog.chao = false; SFX.pulo(); e.preventDefault(); }
  if (demo) {
    if (k === 'p') ganharXp(250, 'modo demonstração');
    if (k === 'u') desbloquearDemo();
    if (k === 't') teletransporteDemo();
  }
  if (k.startsWith('Arrow')) e.preventDefault();
});
addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; teclas[k] = false; });
addEventListener('blur', () => { for (const k in teclas) teclas[k] = false; });
let arrastando = false, moveu = 0;
const dedos = new Map(); let pinca = 0;
canvas.addEventListener('pointerdown', e => { arrastando = true; moveu = 0; dedos.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { canvas.setPointerCapture(e.pointerId); } catch { } if (dedos.size === 2) { const [a, b] = [...dedos.values()]; pinca = Math.hypot(a.x - b.x, a.y - b.y); } });
canvas.addEventListener('pointermove', e => {
  const ant = dedos.get(e.pointerId); if (!ant || !emJogo) return;
  const dx = e.clientX - ant.x, dy = e.clientY - ant.y; ant.x = e.clientX; ant.y = e.clientY;
  if (dedos.size >= 2) { const [a, b] = [...dedos.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinca) camCtl.alvoDist = Math.min(30, Math.max(6, camCtl.alvoDist * pinca / d)); pinca = d; moveu += 10; return; }
  moveu += Math.abs(dx) + Math.abs(dy); const sens = e.pointerType === 'touch' ? .008 : .005;
  camCtl.yaw -= dx * sens; camCtl.pitch = Math.min(1.25, Math.max(.18, camCtl.pitch + dy * sens * .8));
});
const soltar = e => { dedos.delete(e.pointerId); if (dedos.size < 2) pinca = 0; };
canvas.addEventListener('pointercancel', e => { soltar(e); arrastando = false; });
canvas.addEventListener('pointerup', e => {
  soltar(e); arrastando = false; if (!emJogo || pausado || moveu > 6) return;
  // clique em NPC próximo abre a missão
  const ray = new THREE.Raycaster(), m = new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(m, camera);
  const alvos = ESTACOES.filter(s => s.grupo.visible).map(s => s.grupo);
  const hit = ray.intersectObjects(alvos, true)[0];
  if (hit) { const s = ESTACOES.find(s => s.grupo === hit.object.parent || s.grupo === hit.object); if (s) { if (Math.hypot(s.x - jog.x, s.z - jog.z) < 6) abrirEstacao(s); else toast('🚶', 'Aproxime-se do personagem', s.topico.titulo); } }
});
canvas.addEventListener('wheel', e => { camCtl.alvoDist = Math.min(30, Math.max(6, camCtl.alvoDist * (1 + e.deltaY * .001))); e.preventDefault(); }, { passive: false });

const joy = { x: 0, y: 0, ativo: false, id: null };
(function controlesToque() {
  const base = $('joy'), pino = base.querySelector('.pino'), R = 55;
  const mover = e => { const r = base.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy); if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    joy.x = dx / R; joy.y = -dy / R; pino.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; base.classList.toggle('correndo', Math.hypot(joy.x, joy.y) > .92); };
  base.addEventListener('pointerdown', e => { joy.ativo = true; joy.id = e.pointerId; try { base.setPointerCapture(e.pointerId); } catch { } mover(e); e.preventDefault(); });
  base.addEventListener('pointermove', e => { if (joy.ativo && e.pointerId === joy.id) mover(e); });
  const fim = e => { if (e.pointerId !== joy.id) return; joy.ativo = false; joy.x = joy.y = 0; pino.style.transform = ''; base.classList.remove('correndo'); };
  base.addEventListener('pointerup', fim); base.addEventListener('pointercancel', fim);
  $('btPular').addEventListener('pointerdown', e => { e.preventDefault(); if (emJogo && !pausado && jog.chao) { jog.vy = 8.5; jog.chao = false; SFX.pulo(); } });
  $('btFalar').addEventListener('pointerdown', e => { e.preventDefault(); const st = estacaoProxima(); if (emJogo && !pausado && st) abrirEstacao(st); });
  $('prompt').addEventListener('click', () => { const st = estacaoProxima(); if (emJogo && !pausado && st) abrirEstacao(st); });
})();

function estacaoProxima() { let m = null, d = 3.4; for (const e of ESTACOES) { if (!livre(e.ilha)) continue; const dd = Math.hypot(e.x - jog.x, e.z - jog.z); if (dd < d) { d = dd; m = e; } } return m; }

// ---------- loop ----------
const relogio = new THREE.Clock();
let tempo = 0, acc = 0, accRepoe = 0, intro = 0;
const camPos = new THREE.Vector3(), camAlvo = new THREE.Vector3(), tmp = new THREE.Vector3();

function atualizarJogador(dt) {
  let ix = 0, iz = 0;
  if (teclas.w || teclas.ArrowUp) iz += 1; if (teclas.s || teclas.ArrowDown) iz -= 1;
  if (teclas.a || teclas.ArrowLeft) ix -= 1; if (teclas.d || teclas.ArrowRight) ix += 1;
  if (teclas.q) camCtl.yaw += dt * 2;
  if (joy.ativo) { ix += joy.x; iz += joy.y; }
  const n = Math.hypot(ix, iz), fx = -Math.sin(camCtl.yaw), fz = -Math.cos(camCtl.yaw), rx = -fz, rz = fx;
  let mx = 0, mz = 0;
  if (n) { mx = (fx * iz + rx * ix) / n; mz = (fz * iz + rz * ix) / n; }
  const correr = teclas.Shift || (joy.ativo && n > .92);
  const alvoVel = n > .08 ? (correr ? 11 : 6.8) * Math.min(1, Math.max(.45, n)) : 0;
  jog.vel = lerp(jog.vel, alvoVel, Math.min(1, dt * 10));
  if (n > .08) {
    const nx = jog.x + mx * jog.vel * dt, nz = jog.z + mz * jog.vel * dt;
    if (pode(nx, nz)) { jog.x = nx; jog.z = nz; } else if (pode(nx, jog.z)) jog.x = nx; else if (pode(jog.x, nz)) jog.z = nz;
    const alvoRot = Math.atan2(mx, mz); let dr = alvoRot - jog.rot; dr = Math.atan2(Math.sin(dr), Math.cos(dr)); jog.rot += dr * Math.min(1, dt * 12);
  }
  // pulo
  jog.vy -= 22 * dt; jog.y += jog.vy * dt; if (jog.y <= 1) { if (!jog.chao && jog.vy < -6) explosao(jog.x, 1.1, jog.z, ['#ffffff', '#e0f2f1'], 10, 2); jog.y = 1; jog.vy = 0; jog.chao = true; }
  if (!evo) { avatar.position.set(jog.x, jog.y, jog.z); avatar.rotation.y = jog.rot; }
  const f = formas[formaVisivel]; if (f) f.upd(tempo, jog.vel > .5);
  // ilha atual
  const il = ilhaPerto(jog.x, jog.z);
  if (il && Math.hypot(jog.x - il.cx, jog.z - il.cz) < il.R && il.i !== ilhaAtual) { ilhaAtual = il.i; banner(`${il.u.serie}ª série · Unidade ${il.i + 1}`, il.u.regiao_mundo.nome, il.u.titulo); }
  // coletáveis
  for (const o of ORBES) if (o.mesh && (o.x - jog.x) ** 2 + (o.z - jog.z) ** 2 < 1.7) {
    est.orbes[o.id] = Date.now(); est.cristais = (est.cristais || 0) + 1; est.cristaisTotal = (est.cristaisTotal || 0) + 1;
    removerColetavel(o); SFX.coleta(); explosao(o.x, 1.8, o.z, ['#7DF9FF', '#ffffff'], 30, 4); ganharXp(5, 'biocristal +1 💎'); diaria('orbes'); verificarConquistas(); atualizarPoderes();
  }
  for (const p of PILULAS) if (p.mesh && (p.x - jog.x) ** 2 + (p.z - jog.z) ** 2 < 1.7) {
    est.pilulasCol[p.id] = Date.now(); est.pilulas[p.ilha] = (est.pilulas[p.ilha] || 0) + 1;
    removerColetavel(p); SFX.coleta(); explosao(p.x, 1.6, p.z, ['#FF8FAB', '#ffffff'], 30, 4); atualizarPoderes(); salvar();
    fatoDaIlha(ILHAS[p.ilha]).then(f => toastLongo('💊', 'Pílula de conhecimento: guardada para os desafios desta ilha e da próxima', f ? f.titulo + ': ' + f.texto : 'Use-a num desafio para eliminar 2 alternativas erradas.'));
  }
  for (const fr of FRAGS) if (fr.mesh && (fr.espera || 0) < tempo && (fr.x - jog.x) ** 2 + (fr.z - jog.z) ** 2 < 1.8) { fr.espera = tempo + 4; abrirFragmento(fr); break; }
  // prompt
  const s = estacaoProxima(), pr = $('prompt');
  $('btFalar').classList.toggle('oculto', !(s && !pausado));
  if (s && !pausado) { pr.innerHTML = `<span class="tecla">${TOQUE ? '👆' : 'E'}</span> ${s.premium ? '💎 Baú premium · ' + esc(s.topico.titulo) : s.pronto ? (est.feitas[s.topico.id] ? '✅ ' : '💬 ') + esc(s.topico.titulo) : '🚧 Estação em construção'}`; pr.classList.remove('oculto'); }
  else pr.classList.add('oculto');
  // NPCs olham para o jogador
  for (const e of ESTACOES) if (e.cabeca && e.grupo.visible && Math.hypot(e.x - jog.x, e.z - jog.z) < 7) e.grupo.rotation.y = lerp(e.grupo.rotation.y, Math.atan2(jog.x - e.x, jog.z - e.z), .1);
}

function atualizarCamera(dt) {
  camCtl.dist = lerp(camCtl.dist, camCtl.alvoDist, Math.min(1, dt * 4));
  if (!emJogo) {   // órbita da tela inicial
    intro += dt * .05; const L = limitesMundo(), cx = (L.x0 + L.x1) / 2, cz = (L.z0 + L.z1) / 2;
    camera.position.set(cx + Math.cos(intro) * 170, 95, cz + Math.sin(intro) * 120); camera.lookAt(cx, 0, cz); return;
  }
  camAlvo.set(jog.x, jog.y + 1.6, jog.z);
  tmp.set(Math.sin(camCtl.yaw) * Math.cos(camCtl.pitch), Math.sin(camCtl.pitch), Math.cos(camCtl.yaw) * Math.cos(camCtl.pitch)).multiplyScalar(camCtl.dist).add(camAlvo);
  camPos.lerp(tmp, Math.min(1, dt * (transicao > 0 ? 1.6 : 7))); if (transicao > 0) transicao -= dt;
  camera.position.copy(camPos); camera.lookAt(camAlvo);
}
let transicao = 0;

function animarMundo(dt) {
  tempoU.value = tempo;
  for (const il of ILHAS) { il.icone.rotation.y += dt * .8; il.icone.position.y = 6.6 + Math.sin(tempo * 1.5 + il.i) * .35; il.halo.position.y = il.icone.position.y; il.halo.material.opacity = .55 + Math.sin(tempo * 2 + il.i) * .2; }
  for (const e of ESTACOES) if (e.gema && e.grupo.visible) {
    const feito = est && est.feitas[e.topico.id]; e.gema.material.color.set(feito ? '#36D399' : '#FFD166'); e.halo.material.color.set(feito ? '#36D399' : '#FFD166');
    e.gema.rotation.y += dt * 2; e.gema.position.y = 2.75 + Math.sin(tempo * 3 + e.x) * .15; e.halo.position.y = e.gema.position.y;
  }
  for (const o of ORBES) if (o.mesh) { if (!livre(o.ilha)) { o.mesh.visible = o.glow.visible = false; continue; } o.mesh.visible = o.glow.visible = true; o.mesh.position.set(o.x, 1.8 + Math.sin(tempo * 2.5 + o.fase) * .25, o.z); o.mesh.rotation.y += dt * 2; o.mesh.rotation.x += dt; o.glow.position.copy(o.mesh.position); }
  for (const f of FRAGS) if (f.mesh) { if (!livre(f.ilha)) { f.mesh.visible = f.glow.visible = false; continue; } f.mesh.visible = f.glow.visible = true; f.mesh.position.set(f.x, 2 + Math.sin(tempo * 1.8 + f.fase) * .3, f.z); f.mesh.rotation.y += dt * 1.4; f.glow.position.copy(f.mesh.position); }
  for (const p of PILULAS) if (p.mesh) { if (!livre(p.ilha)) { p.mesh.visible = p.glow.visible = false; continue; } p.mesh.visible = p.glow.visible = true; p.mesh.position.set(p.x, 1.6 + Math.sin(tempo * 2.2 + p.fase) * .22, p.z); p.mesh.rotation.z = .9; p.mesh.rotation.y += dt * 1.8; p.glow.position.copy(p.mesh.position); }
  if (feixes.length) { if (tempo > sondaAte) { feixes.forEach(f => scene.remove(f)); feixes = []; atualizarPoderes(); } else feixes.forEach((f, k) => { f.material.opacity = .3 + Math.sin(tempo * 5 + k) * .15; f.rotation.y += dt; }); }
  for (const p of PONTES) if (p.barreira.visible) p.barreira.material.opacity = .35 + Math.sin(tempo * 4) * .15;
  // nuvens das ilhas recém-desbloqueadas se dissipam
  if (desbloqueando.length) {
    const dm = new THREE.Object3D();
    desbloqueando = desbloqueando.filter(d => {
      d.t += dt; const f = Math.max(0, 1 - d.t / 1.8);
      for (const n of d.il.nuvens) { dm.position.set(n.x, n.y + d.t * 4, n.z); const s = n.s * (1 + d.t * .6) * f + .0001; dm.scale.set(s * 1.3, s * .75, s); dm.updateMatrix(); nuvens.setMatrixAt(n.k, dm.matrix); }
      nuvens.instanceMatrix.needsUpdate = true;
      if (d.t > 1.8) { aplicarVisualBloqueio(); return false; } return true;
    });
  }
  // vagalumes seguem o jogador
  const cx = emJogo ? jog.x : 0, cz = emJogo ? jog.z : 0;
  for (let k = 0; k < NV; k++) { const b = vbase[k]; vpos[k * 3] = cx + b[0] + Math.sin(tempo * .4 + b[3]) * 2; vpos[k * 3 + 1] = b[1] + Math.sin(tempo * .9 + b[3] * 2) * .6; vpos[k * 3 + 2] = cz + b[2] + Math.cos(tempo * .35 + b[3]) * 2; }
  vgeo.attributes.position.needsUpdate = true;
  // sol acompanha o jogador para manter sombras nítidas por perto
  const sx = emJogo ? jog.x : 0, sz = emJogo ? jog.z : 0; sol.position.set(sx + 40, 80, sz + 28); sol.target.position.set(sx, 0, sz);
}

function loop() {
  requestAnimationFrame(loop);
  if (document.hidden) { relogio.getDelta(); return; }
  const dt = Math.min(.05, relogio.getDelta()); tempo += dt;
  if (emJogo && !pausado && !evo) atualizarJogador(dt);
  else if (emJogo && !evo) { const f = formas[formaVisivel]; if (f) f.upd(tempo, false); }
  atualizarEvolucao(dt);
  if (evo) { const f = formas[formaVisivel]; if (f) f.upd(tempo, false); }
  animarMundo(dt); atualizarParticulas(dt); atualizarCamera(dt); atualizarFlutuantes(dt);
  if (emJogo && (acc += dt) > .12) { acc = 0; desenharMinimapa(); retrato(tempo); }
  if (emJogo && (accRepoe += dt) > 5) { accRepoe = 0; criarColetaveis(); atualizarPoderes(); }
  renderer.render(scene, camera);
}

// ---------- início ----------
let corSel = 0;
function telaInicial(salvo) {
  const tem = EV.temProgresso(salvo);
  if (salvo) { corSel = salvo.cor || 0; if (salvo.nome && salvo.nome !== 'Evonauta' && !$('nome').value) $('nome').value = salvo.nome; }
  $('cores').innerHTML = CORES_JOGADOR.map((c, k) => `<button style="background:${c}" data-k="${k}" class="${k === corSel ? 'sel' : ''}" title="Cor do avatar"></button>`).join('');
  $('cores').querySelectorAll('button').forEach(b => b.onclick = () => { corSel = +b.dataset.k; $('cores').querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b)); });
  $('btCont').classList.toggle('oculto', !tem);
  $('btCont').classList.toggle('prim', tem); $('btNovo').classList.toggle('prim', !tem);
  $('btNovo').textContent = tem ? '↺ Recomeçar do zero' : '▶ Começar expedição';
}
function comecar(novo) {
  const salvo = EV.carregar(), nome = $('nome').value.trim() || 'Evonauta';
  demo = $('demo').checked;
  est = EV.completar(!novo && salvo ? salvo : EV.novo(nome));
  est.nome = nome; if (novo && salvo && salvo.uid) est.uid = salvo.uid; est.cor = corSel;
  if (novo) { est.pos3d = null; combo = 0; }
  if (!Array.isArray(est.livres) || !est.livres.length) est.livres = [true];
  est.livres = ILHAS.map((_, i) => !!est.livres[i] || i === 0);
  verificarDesbloqueios(false);
  montarFormas(CORES_JOGADOR[est.cor] || CORES_JOGADOR[0]);
  est.pilulas ||= {}; est.pilulasCol ||= {};
  if (est.cristais == null) { est.cristais = Object.keys(est.orbes || {}).length; est.cristaisTotal = est.cristais; }
  criarColetaveis(); aplicarVisualBloqueio();
  $('poderes').classList.remove('oculto'); atualizarPoderes();
  if (!est.vistoPoderes) { est.vistoPoderes = true; setTimeout(() => toastLongo('🚀', 'Novidade a bordo', 'Colete 💊 pílulas de conhecimento para usar nos desafios e 💎 biocristais para ativar a sonda (tecla 1) e o salto de dobra (tecla 2).'), 3500); }
  const p = est.pos3d; if (p && noChao(p.x, p.z)) { jog.x = p.x; jog.z = p.z; } else { jog.x = ILHAS[0].cx; jog.z = ILHAS[0].cz + 5; }
  jog.rot = Math.PI; camCtl.yaw = 0; camPos.copy(camera.position); transicao = 1.6;
  emJogo = true; pausado = false;
  $('inicio').classList.add('oculto');
  ['perfil', 'acoes', 'diarias', 'minimapa', 'dica'].forEach(id => $(id).classList.remove('oculto'));
  $('demoBts').classList.toggle('oculto', !demo);
  $('dicaDemo').innerHTML = demo ? '<br><b style="color:var(--ouro)">Demo:</b> <b>P</b> +XP/evoluir · <b>U</b> desbloquear ilha · <b>T</b> teletransporte' : '';
  atualizarHud(); verificarConquistas(); salvar(); if (window.salvarNaNuvem) window.salvarNaNuvem(); setInterval(salvar, 4000);
  setTimeout(() => toast('🧬', `Bem-vindo(a), ${est.nome}!`, TOQUE ? 'Use o joystick para andar e arraste a tela para girar a câmera' : 'Fale com os personagens com ❗ para receber missões'), 1200);
}
addEventListener('progresso-sincronizado', () => { if (!emJogo) telaInicial(EV.carregar()); });
addEventListener('storage', e => { if (e.key === EV.CHAVE && est) { const novo = EV.carregar(); if (novo && novo.xp !== est.xp) { const a = nivelDe(est.xp); est.xp = novo.xp; est.aulas = novo.aulas; atualizarHud(); if (nivelDe(est.xp) > a) evoluir(formaDe(a), formaDe(nivelDe(est.xp)), nivelDe(est.xp)); } } });

(async function iniciar() {
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]); } catch { }
  try { CUR = await fetch(BASE + 'curriculo.json').then(r => r.json()); }
  catch { $('carga').textContent = 'Não foi possível carregar o currículo. Abra pelo servidor de prévia.'; return; }
  gerarMundo();
  const prontas = ESTACOES.filter(e => e.pronto).length;
  $('carga').textContent = `${ILHAS.length} ilhas · ${ESTACOES.length} estações · ${prontas} missões disponíveis · ${ORBES.length} biocristais escondidos`;
  telaInicial(EV.carregar());
  let confirmaReset = 0;
$('btNovo').onclick = () => {
  const s = EV.carregar(), bt = $('btNovo');
  if (!EV.temProgresso(s)) return comecar(false);
  // confirmação na própria tela (confirm() pode estar bloqueado pelo navegador)
  if (Date.now() - confirmaReset > 5000) {
    confirmaReset = Date.now(); bt.classList.add('perigo'); bt.textContent = '⚠ Apagar ' + (s.xp || 0) + ' XP? Toque de novo';
    setTimeout(() => { if (!emJogo && Date.now() - confirmaReset >= 5000) { bt.classList.remove('perigo'); telaInicial(EV.carregar()); } }, 5100);
    return;
  }
  confirmaReset = 0; bt.classList.remove('perigo'); comecar(true);
}; $('btCont').onclick = () => comecar(false);
  $('nome').addEventListener('keydown', e => { if (e.key === 'Enter') comecar(false); });
  est = EV.completar(null); est.livres = ILHAS.map((_, i) => i < 3); aplicarVisualBloqueio(); est = null;
  // ao voltar da aula (?continuar), entra direto no jogo e reabre a estação de onde saiu
  const qs = new URLSearchParams(location.search);
  if (qs.has('continuar') && EV.temProgresso(EV.carregar())) {
    comecar(false);
    const alvo = qs.get('estacao') && ESTACOES.find(e => e.topico.id === qs.get('estacao'));
    if (alvo && livre(alvo.ilha)) { jog.x = alvo.x; jog.z = alvo.z + 2.6; setTimeout(() => abrirEstacao(alvo), 900); }
    history.replaceState(null, '', location.pathname);
  }
  loop();
})();

// acesso de depuração pelo console (útil para testes e demonstrações)
window.EXP = { jog, ILHAS, PONTES, ESTACOES, ORBES, PILULAS, get est() { return est; }, abrirEstacao, ganharXp, noChao, pode, usarSonda, usarSalto, saltarPara, get feixes() { return feixes; }, abrirFragmento, camCtl, teclas, FRAGS, abrirMapa, fecharMapa, get emJogo() { return emJogo; } };

// botões dos poderes
$('pdSonda').onclick = usarSonda; $('pdSalto').onclick = usarSalto;
