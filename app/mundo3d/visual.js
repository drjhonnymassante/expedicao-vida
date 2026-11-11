// Camada visual do mundo 3D: cel shading, céu com ciclo de dia e noite, água estilizada,
// grama com vento, iluminação e pós-processamento. A lógica do jogo fica em main.js.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import * as BGU from 'three/addons/utils/BufferGeometryUtils.js';

const lerp = (a, b, k) => a + (b - a) * k;
const C = c => new THREE.Color(c);

// ---------- cel shading ----------
// rampa de 3 degraus com transições macias (filtro linear no limite entre as faixas)
function criarRampa() {
  const n = 64, dados = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1);
    const s = (a, w) => Math.min(1, Math.max(0, (x - a) / w));
    const v = .38 + .27 * s(.30, .06) + .35 * s(.62, .07);
    dados[i] = Math.round(v * 255);
  }
  const t = new THREE.DataTexture(dados, n, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
  return t;
}
const RAMPA = criarRampa();
const SEM = new Set(['roughness', 'metalness', 'specular', 'shininess']);
export function toon(cor, extra = {}) {
  const p = { color: cor, gradientMap: RAMPA };
  for (const [k, v] of Object.entries(extra)) if (!SEM.has(k) && k !== 'flatShading') p[k] = v;
  const m = new THREE.MeshToonMaterial(p);
  if (extra.flatShading) m.flatShading = true;   // não é opção do construtor no toon, mas o shader respeita a propriedade
  return m;
}

// ---------- shaders ----------
const CEU_VS = 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }';
const CEU_FS = `
uniform vec3 topo, hor, sol; uniform float noite, uTempo; varying vec3 vP;
float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
void main(){
  float h = clamp(vP.y*1.6+.15, 0., 1.);
  vec3 c = mix(hor, topo, pow(h, .7));
  float ds = max(dot(vP, sol), 0.);
  c += vec3(1.,.93,.75) * pow(ds, 260.) * 1.6 + vec3(1.,.82,.55) * pow(ds, 9.) * .22 * (1. - noite*.6);
  // lua do lado oposto ao sol
  float dl = max(dot(vP, -sol), 0.);
  c += vec3(.85,.9,1.) * (smoothstep(.9975, .9992, dl) * .9 + pow(dl, 60.) * .08) * noite;
  // estrelas
  vec3 g = floor(vP * 140.); float st = step(.9965, hash(g)) * (sin(uTempo*2. + hash(g+1.)*30.)*.3+.7);
  c += vec3(st) * noite * smoothstep(.0, .25, vP.y);
  gl_FragColor = vec4(c, 1.);
}`;

const AGUA_VS = `
uniform float uTempo; varying vec3 vW; varying vec3 vN;
#include <fog_pars_vertex>
float onda(vec2 p, float t){ return sin(p.x*.09 + t*1.1)*.32 + cos(p.y*.11 + t*.9)*.26 + sin((p.x+p.y)*.05 + t*.6)*.2; }
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  float h = onda(w.xz, uTempo);
  float e = .6;
  float dx = (onda(w.xz + vec2(e,0.), uTempo) - h) / e, dz = (onda(w.xz + vec2(0.,e), uTempo) - h) / e;
  vN = normalize(vec3(-dx, 1., -dz));
  w.y += h; vW = w.xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const AGUA_FS = `
uniform float uTempo; uniform vec3 uCor, uCorRasa, uEspuma, uSol; uniform float uNoite;
uniform vec4 uIlhas[26]; uniform vec3 uCorIlha[26]; uniform int uN;
varying vec3 vW; varying vec3 vN;
#include <fog_pars_fragment>
void main(){
  float d = 1e9; vec3 corIlha = uCor;
  for (int i = 0; i < 26; i++) { if (i >= uN) break; float di = length(vW.xz - uIlhas[i].xy) - uIlhas[i].z; if (di < d) { d = di; corIlha = uCorIlha[i]; } }
  float raso = 1. - smoothstep(0., 6.5, d);
  vec3 cor = mix(uCor, mix(uCorRasa, corIlha, .5), raso * .85);
  // ondas que rolam para a praia e espuma na borda
  float fio = sin((d - uTempo*.9)*2.1 + sin(vW.x*.4 + uTempo*.5)*.8) * .5 + .5;
  float espuma = smoothstep(.72, .97, fio) * smoothstep(4.6, 1.2, d) * .7 + smoothstep(1.1, .15, d) * .9;
  float salp = sin(vW.x*1.7 + uTempo*2.) * sin(vW.z*1.9 - uTempo*1.6);
  espuma *= .8 + salp*.2;
  cor = mix(cor, uEspuma, clamp(espuma, 0., 1.));
  vec3 vd = normalize(cameraPosition - vW);
  float dif = max(dot(vN, uSol), 0.) * .3 + .72;
  vec3 hv = normalize(uSol + vd);
  float spec = pow(max(dot(vN, hv), 0.), 110.) * .9 * (1. - uNoite*.5);
  float perto = 1. - smoothstep(20., 70., length(cameraPosition - vW));
  float brilho = pow(max(sin(vW.x*3.1 + uTempo*1.4) * sin(vW.z*2.7 - uTempo*1.1) * sin((vW.x - vW.z)*1.3 + uTempo*.7), 0.), 24.) * .09 * (1. - raso) * perto;
  float fres = pow(1. - max(dot(vN, vd), 0.), 3.) * .22;
  gl_FragColor = vec4(cor * dif + spec + brilho + fres, .94);
  #include <fog_fragment>
}`;

// contorno leve a partir das bordas de profundidade (some com a distância)
const CONTORNO = {
  uniforms: { tDiffuse: { value: null }, tDepth: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uNear: { value: .1 }, uFar: { value: 900 }, uForca: { value: .55 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `
uniform sampler2D tDiffuse, tDepth; uniform vec2 uRes; uniform float uNear, uFar, uForca; varying vec2 vUv;
float lin(vec2 uv){ float z = texture2D(tDepth, uv).x * 2. - 1.; return (2.*uNear*uFar) / (uFar + uNear - z*(uFar - uNear)); }
void main(){
  vec2 px = 1. / uRes;
  float c = lin(vUv);
  float e = abs(lin(vUv + vec2(px.x, 0.)) - c) + abs(lin(vUv - vec2(px.x, 0.)) - c) + abs(lin(vUv + vec2(0., px.y)) - c) + abs(lin(vUv - vec2(0., px.y)) - c);
  float limiar = c * .028 + .06;
  float borda = smoothstep(limiar, limiar * 3., e);
  float fade = 1. - smoothstep(55., 150., c);
  vec4 cor = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(cor.rgb * (1. - borda * fade * uForca), cor.a);
}` };

// correção de cor e vinheta (depois do tone mapping)
const GRADE = {
  uniforms: { tDiffuse: { value: null }, uContraste: { value: 1.07 }, uSat: { value: 1.14 }, uQuente: { value: .02 }, uVinheta: { value: .28 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `
uniform sampler2D tDiffuse; uniform float uContraste, uSat, uQuente, uVinheta; varying vec2 vUv;
void main(){
  vec3 c = texture2D(tDiffuse, vUv).rgb;
  c = (c - .5) * uContraste + .5;
  float l = dot(c, vec3(.299, .587, .114)); c = mix(vec3(l), c, uSat);
  c += vec3(uQuente, uQuente * .4, -uQuente);
  vec2 q = vUv - .5; c *= 1. - dot(q, q) * uVinheta * 1.6;
  gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
}` };

// ---------- textura de nuvem (canvas) ----------
function texNuvem() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  const bolha = (x, y, r) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.55, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  [[70, 78, 42], [120, 62, 52], [170, 76, 44], [100, 90, 36], [150, 92, 38], [205, 86, 30]].forEach(([x, y, r]) => bolha(x, y, r));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------- fábrica ----------
export function criarVisual({ renderer, scene, camera, qualidade = 'alta', toque = false }) {
  const alta = qualidade === 'alta';
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;

  // luzes
  const hemi = new THREE.HemisphereLight('#d8f0ff', '#4c6b3c', 1.0);
  const sol = new THREE.DirectionalLight('#fff1d6', 2.4);
  sol.castShadow = true; sol.shadow.mapSize.set(alta ? 2048 : 1024, alta ? 2048 : 1024);
  Object.assign(sol.shadow.camera, { left: -42, right: 42, top: 42, bottom: -42, near: 1, far: 240 });
  sol.shadow.bias = -.0005; sol.shadow.normalBias = .035;
  scene.add(hemi, sol, sol.target);
  scene.fog = new THREE.Fog('#a9d3ee', 150, 540);

  // céu
  const ceuU = { topo: { value: C('#2f7fd1') }, hor: { value: C('#cfeeff') }, sol: { value: new THREE.Vector3(.5, .45, .3).normalize() }, noite: { value: 0 }, uTempo: { value: 0 } };
  const ceu = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: ceuU, vertexShader: CEU_VS, fragmentShader: CEU_FS }));
  scene.add(ceu);

  // nuvens do céu (sprites grandes, à deriva)
  const nuvemTex = texNuvem(), nuvens = [];
  for (let k = 0; k < (alta ? 26 : 14); k++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: nuvemTex, transparent: true, depthWrite: false, opacity: .9 }));
    const esc = 26 + Math.random() * 30;
    s.scale.set(esc, esc * .5, 1); s.position.set((Math.random() - .5) * 700, 58 + Math.random() * 30, (Math.random() - .5) * 600);
    s.userData.vel = .6 + Math.random() * .9; scene.add(s); nuvens.push(s);
  }

  // água
  const tempoU = { value: 0 };
  const aguaU = {
    uTempo: tempoU, uCor: { value: C('#1a7fc0') }, uCorRasa: { value: C('#3fb6d6') }, uEspuma: { value: C('#eefbff') }, uSol: ceuU.sol, uNoite: ceuU.noite,
    uIlhas: { value: Array.from({ length: 26 }, () => new THREE.Vector4(0, 0, 0, 0)) }, uCorIlha: { value: Array.from({ length: 26 }, () => C('#1a7fc0')) }, uN: { value: 0 },
  };
  const aguaMat = new THREE.ShaderMaterial({ uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]), vertexShader: AGUA_VS, fragmentShader: AGUA_FS, transparent: true, fog: true });
  Object.assign(aguaMat.uniforms, aguaU);
  const agua = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1000, alta ? 160 : 90, alta ? 115 : 65), aguaMat);
  agua.rotation.x = -Math.PI / 2; agua.position.y = -.15; scene.add(agua);
  function registrarIlhas(ilhas) {
    ilhas.slice(0, 26).forEach((il, i) => { aguaU.uIlhas.value[i].set(il.cx, il.cz, il.R + 2.6, 0); aguaU.uCorIlha.value[i].set(il.tema.agua || '#1a7fc0'); });
    aguaU.uN.value = Math.min(26, ilhas.length);
  }

  // grama instanciada com vento
  let grama = null;
  function criarGrama(tufos) {
    if (!tufos.length) return;
    const folha = new THREE.PlaneGeometry(.46, .8, 1, 3); folha.translate(0, .4, 0);
    const p = folha.attributes.position; for (let k = 0; k < p.count; k++) { const y = p.getY(k); p.setX(k, p.getX(k) * (1 - (y / .8) * .7) + (y / .8) ** 2 * .12); }
    const cruz = folha.clone().rotateY(Math.PI / 2);
    const geo = BGU.mergeGeometries([folha, cruz]); geo.computeVertexNormals();
    const m = toon('#ffffff', { side: THREE.DoubleSide });
    m.onBeforeCompile = sh => {
      sh.uniforms.uTempo = tempoU;
      sh.vertexShader = 'uniform float uTempo;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        float fase = instanceMatrix[3].x * .35 + instanceMatrix[3].z * .27;
        float v = clamp(position.y / .9, 0., 1.); v *= v;
        transformed.x += (sin(uTempo * 1.7 + fase) * .2 + sin(uTempo * 3.3 + fase * 2.3) * .07) * v;
        transformed.z += cos(uTempo * 1.25 + fase * 1.4) * .12 * v;`);
    };
    grama = new THREE.InstancedMesh(geo, m, tufos.length);
    grama.receiveShadow = true;
    const d = new THREE.Object3D(), cor = new THREE.Color();
    tufos.forEach((t, k) => {
      d.position.set(t.x, 1, t.z); d.rotation.set(0, t.r, 0); const s = t.s; d.scale.set(s, s * (.8 + t.h * .6), s); d.updateMatrix(); grama.setMatrixAt(k, d.matrix);
      cor.set(t.cor).offsetHSL((t.h - .5) * .04, -.06, .08 + (t.h - .5) * .16); grama.setColorAt(k, cor);
    });
    grama.instanceMatrix.needsUpdate = true; grama.instanceColor.needsUpdate = true;
    scene.add(grama);
  }

  // pós-processamento
  let composer = null, contorno = null, smaa = null, bloom = null;
  function montarPost() {
    const alvo = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthTexture: new THREE.DepthTexture(1, 1, THREE.UnsignedIntType) });
    composer = new EffectComposer(renderer, alvo);
    // o clone compartilha a mesma DepthTexture: cada alvo precisa da sua, senão o contorno lê o que está escrevendo
    composer.renderTarget2.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
    composer.addPass(new RenderPass(scene, camera));
    contorno = new ShaderPass(CONTORNO);
    contorno.render = function (r, w, rd, ...resto) { this.uniforms.tDepth.value = rd.depthTexture; ShaderPass.prototype.render.call(this, r, w, rd, ...resto); };
    contorno.uniforms.uNear.value = camera.near; contorno.uniforms.uFar.value = camera.far;
    composer.addPass(contorno);
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), alta ? .32 : .26, .55, .86);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.addPass(new ShaderPass(GRADE));
    if (alta) { smaa = new SMAAPass(1, 1); composer.addPass(smaa); }
  }
  if (qualidade !== 'baixa') montarPost();

  function redimensionar() {
    const w = innerWidth, h = innerHeight, pr = renderer.getPixelRatio();
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    if (composer) { composer.setSize(w, h); contorno.uniforms.uRes.value.set(w * pr, h * pr); }
  }

  // ciclo de dia e noite (um dia completo a cada ~12 minutos; a noite nunca fica escura demais)
  const DIA = { topo: C('#2b7cd3'), hor: C('#b8e0ff'), nevoa: C('#a9d3ee'), sol: C('#fff1d6'), hemi: C('#d8f0ff') };
  const TARDE = { topo: C('#4a5fb0'), hor: C('#ffb27a'), nevoa: C('#e8c3a8'), sol: C('#ffb36b'), hemi: C('#f2c9a5') };
  const NOITE = { topo: C('#0b1a3a'), hor: C('#2a4a7a'), nevoa: C('#1e3a5c'), sol: C('#9fb7ff'), hemi: C('#5c7fb8') };
  let hora = .3;                      // 0 = meia-noite, .25 = amanhecer, .5 = meio-dia, .75 = anoitecer
  const tmp = new THREE.Color(), tmp2 = new THREE.Color();
  function paleta(k, cor) {           // k: -1 noite ... 0 crepúsculo ... 1 dia
    if (k >= 0) return tmp.copy(TARDE[cor]).lerp(DIA[cor], Math.min(1, k * 1.6));
    return tmp.copy(TARDE[cor]).lerp(NOITE[cor], Math.min(1, -k * 1.4));
  }
  const chaoHemi = new THREE.Color('#4c6b3c'), nevoaIlha = new THREE.Color('#bfe3f7');
  let temaAtual = null;

  function atualizar(dt, foco, tema) {
    tempoU.value += dt; ceuU.uTempo.value = tempoU.value;
    hora = (hora + dt / 720) % 1;
    const a = hora * Math.PI * 2, elev = -Math.cos(a);               // -1 meia-noite, 1 meio-dia
    const k = Math.max(-1, Math.min(1, elev * 1.8));
    const noite = THREE.MathUtils.smoothstep(-k, .05, .5);
    ceuU.noite.value = noite;
    ceuU.sol.value.set(Math.sin(a) * .7, Math.max(.08, elev), .45).normalize();
    ceuU.topo.value.copy(paleta(k, 'topo')); ceuU.hor.value.copy(paleta(k, 'hor'));
    sol.color.copy(paleta(k, 'sol')); sol.intensity = lerp(1.0, 2.4, Math.max(0, Math.min(1, (k + .3) / 1.3)));
    hemi.color.copy(paleta(k, 'hemi')); hemi.intensity = lerp(1.0, .75, noite);
    // cor do chão do hemisfério e da névoa seguem a ilha onde o jogador está
    if (tema && tema !== temaAtual) temaAtual = tema;
    if (temaAtual) { tmp2.set(temaAtual.chao[0]); chaoHemi.lerp(tmp2, Math.min(1, dt * .8)); tmp2.set(temaAtual.ambiente || temaAtual.chao[1]).lerp(DIA.nevoa, .55); nevoaIlha.lerp(tmp2, Math.min(1, dt * .6)); }
    hemi.groundColor.copy(chaoHemi);
    scene.fog.color.copy(paleta(k, 'nevoa')).lerp(nevoaIlha, k > 0 ? .5 * Math.min(1, k * 1.6) : 0);
    // sol acompanha o jogador para manter sombras nítidas por perto
    const sd = ceuU.sol.value;
    sol.position.set(foco.x + sd.x * 110, Math.max(28, sd.y * 110), foco.z + sd.z * 110); sol.target.position.set(foco.x, 0, foco.z);
    ceu.position.set(foco.x, 0, foco.z);
    // nuvens à deriva (dão a volta no mundo)
    for (const n of nuvens) { n.position.x += n.userData.vel * dt; if (n.position.x > foco.x + 380) n.position.x -= 760; else if (n.position.x < foco.x - 380) n.position.x += 760; n.material.opacity = .9 - noite * .55; n.material.color.setScalar(1 - noite * .55); }
    agua.position.x = foco.x; agua.position.z = foco.z;
  }

  function render() { if (composer) composer.render(); else renderer.render(scene, camera); }

  // foto de cima do arquipélago para o mapa: renderiza o mundo real com câmera ortográfica
  const camFoto = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 600);
  let rtFoto = null;
  function fotoDeCima(L, w, h) {
    if (!rtFoto || rtFoto.width !== w || rtFoto.height !== h) { if (rtFoto) rtFoto.dispose(); rtFoto = new THREE.WebGLRenderTarget(w, h, { colorSpace: THREE.SRGBColorSpace }); }
    const cx = (L.x0 + L.x1) / 2, cz = (L.z0 + L.z1) / 2;
    camFoto.left = -(L.x1 - L.x0) / 2; camFoto.right = (L.x1 - L.x0) / 2; camFoto.top = (L.z1 - L.z0) / 2; camFoto.bottom = -(L.z1 - L.z0) / 2;
    camFoto.position.set(cx, 300, cz); camFoto.up.set(0, 0, -1); camFoto.lookAt(cx, 0, cz); camFoto.updateProjectionMatrix();
    const fog = scene.fog; scene.fog = null; ceu.visible = false; nuvens.forEach(n => n.visible = false);
    const alvoAntes = renderer.getRenderTarget();
    renderer.setRenderTarget(rtFoto); renderer.render(scene, camFoto);
    const px = new Uint8Array(w * h * 4); renderer.readRenderTargetPixels(rtFoto, 0, 0, w, h, px); renderer.setRenderTarget(alvoAntes);
    scene.fog = fog; ceu.visible = true; nuvens.forEach(n => n.visible = true);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), img = g.createImageData(w, h);
    for (let y = 0; y < h; y++) img.data.set(px.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
    g.putImageData(img, 0, 0); return c;
  }

  return { sol, hemi, agua, aguaU, tempoU, registrarIlhas, criarGrama, redimensionar, atualizar, render, fotoDeCima, set hora(h) { hora = h; }, get hora() { return hora; }, get composer() { return composer; } };
}
