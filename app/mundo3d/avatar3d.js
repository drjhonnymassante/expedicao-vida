// Avatar do jogador: personagem glTF (KayKit Adventurers, CC0) com animações, lenço na cor escolhida,
// aura e insígnias que crescem com o nível. Também monta a prévia giratória da tela inicial.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export const PERSONAGENS = [
  { id: 'knight', nome: 'Guardião(ã)', desc: 'Firme e protetor(a)', arquivo: 'Knight.glb' },
  { id: 'rogue', nome: 'Explorador(a)', desc: 'Ágil e curioso(a)', arquivo: 'Rogue.glb' },
  { id: 'mage', nome: 'Sábio(a)', desc: 'Mente de laboratório', arquivo: 'Mage.glb' },
  { id: 'barbarian', nome: 'Desbravador(a)', desc: 'Força da expedição', arquivo: 'Barbarian.glb' },
];
export const PATENTES = ['Recruta', 'Explorador(a)', 'Naturalista', 'Pesquisador(a)', 'Biólogo(a)', 'Especialista', 'Doutor(a)', 'Cientista-chefe'];
export const patente = n => PATENTES[Math.min(PATENTES.length - 1, Math.max(0, n - 1))];
export const ESCALA = 1.0;

const BASE = '../vendor/kaykit/';
const loader = new GLTFLoader();
const cache = {};
export function carregarPersonagem(id) {
  const p = PERSONAGENS.find(x => x.id === id) || PERSONAGENS[0];
  return cache[p.id] ||= new Promise((ok, erro) => loader.load(BASE + p.arquivo, ok, undefined, erro));
}

// instancia um personagem carregado: clone com esqueleto, materiais toon, sem sombras duplicadas
function instanciar(gltf, toon) {
  const obj = SkeletonUtils.clone(gltf.scene);
  obj.traverse(m => {
    if (!m.isMesh) return;
    const mapa = m.material && m.material.map;
    m.material = toon('#ffffff', { map: mapa || null });
    m.castShadow = true; m.receiveShadow = false; m.frustumCulled = false;
  });
  obj.scale.setScalar(ESCALA);
  return obj;
}

function criarMixer(obj, gltf) {
  const mixer = new THREE.AnimationMixer(obj), acoes = {};
  for (const clip of gltf.animations) { const a = mixer.clipAction(clip); acoes[clip.name] = a; }
  for (const n of ['Jump_Start', 'Jump_Land', 'Cheer', 'Interact', 'PickUp']) if (acoes[n]) { acoes[n].setLoop(THREE.LoopOnce, 1); acoes[n].clampWhenFinished = true; }
  return { mixer, acoes };
}

export function criarAvatar3D({ toon }) {
  const grupo = new THREE.Group();
  let obj = null, mixer = null, acoes = {}, atual = null, umaVez = null, corAtual = '#36D399', nivelAtual = 1;
  // aura no chão e insígnias orbitando (nível)
  const aura = new THREE.Mesh(new THREE.RingGeometry(.55, 1.05, 40), new THREE.MeshBasicMaterial({ color: '#36D399', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  aura.rotation.x = -Math.PI / 2; aura.position.y = .04; grupo.add(aura);
  const insignias = new THREE.Group(); grupo.add(insignias);
  const insGeo = new THREE.OctahedronGeometry(.11, 0);

  function tocar(nome, fade = .18, repetir = true) {
    const a = acoes[nome]; if (!a || atual === a) return a;
    a.reset(); a.enabled = true; a.setEffectiveWeight(1);
    if (atual) a.crossFadeFrom(atual, fade, true); else a.play();
    a.play(); atual = a; return a;
  }
  function umaVezSo(nome) {
    const a = tocar(nome, .12, false); if (!a) return;
    umaVez = a;
    const fim = ev => { if (ev.action !== a) return; mixer.removeEventListener('finished', fim); if (umaVez === a) umaVez = null; };
    mixer.addEventListener('finished', fim);
  }

  function aplicarNivel(n) {
    nivelAtual = n;
    const k = Math.min(1, (n - 1) / 7);
    grupo.scale.setScalar(1 + k * .22);
    aura.material.opacity = n > 1 ? .18 + k * .4 : 0; aura.material.color.set(corAtual);
    while (insignias.children.length) insignias.remove(insignias.children[0]);
    for (let i = 0; i < Math.min(7, n - 1); i++) {
      const m = new THREE.Mesh(insGeo, new THREE.MeshBasicMaterial({ color: i < 3 ? '#FFD166' : i < 6 ? '#6EC8FF' : '#B388FF' }));
      m.userData.fase = i / Math.min(7, n - 1) * Math.PI * 2; insignias.add(m);
    }
  }

  function lenco(cor) {
    if (!obj) return;
    const cabeca = obj.getObjectByName('head') || obj.getObjectByName('spine');
    if (!cabeca) return;
    const antigo = cabeca.getObjectByName('lenco'); if (antigo) cabeca.remove(antigo);
    const t = new THREE.Mesh(new THREE.TorusGeometry(.19, .07, 8, 18), toon(cor)); t.name = 'lenco';
    t.rotation.x = Math.PI / 2; t.position.y = -.02; cabeca.add(t);
  }

  async function carregar(id, cor) {
    corAtual = cor || corAtual;
    let gltf;
    try { gltf = await carregarPersonagem(id); }
    catch (e) { console.warn('avatar: não foi possível carregar o personagem', e); return reserva(cor); }
    if (obj) grupo.remove(obj);
    obj = instanciar(gltf, toon); grupo.add(obj);
    ({ mixer, acoes } = criarMixer(obj, gltf)); atual = null; umaVez = null;
    lenco(corAtual); aplicarNivel(nivelAtual); tocar('Idle');
    return true;
  }
  // boneco de reserva quando o glTF não carrega (offline ou aparelho antigo)
  function reserva(cor) {
    if (obj) grupo.remove(obj);
    obj = new THREE.Group(); const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(.3, .7, 6, 12), toon(cor || '#36D399')); corpo.position.y = .95; corpo.castShadow = true;
    const cab = new THREE.Mesh(new THREE.SphereGeometry(.3, 14, 10), toon('#f1c8a5')); cab.position.y = 1.7; cab.castShadow = true;
    obj.add(corpo, cab); grupo.add(obj); mixer = null; acoes = {}; return false;
  }

  function atualizar(dt, s = {}) {
    if (mixer) {
      if (!umaVez) {
        if (s.chao === false) tocar('Jump_Idle', .12);
        else if (s.vel > 8) tocar('Running_A');
        else if (s.vel > .6) tocar('Walking_A');
        else tocar('Idle', .25);
        if (atual === acoes.Walking_A) atual.timeScale = Math.max(.7, s.vel / 6);
        if (atual === acoes.Running_A) atual.timeScale = Math.max(.9, s.vel / 10);
      }
      mixer.update(dt);
    }
    const t = performance.now() / 1000;
    aura.rotation.z += dt * .6; aura.scale.setScalar(1 + Math.sin(t * 2) * .05);
    insignias.children.forEach((m, i) => { const a = t * .9 + m.userData.fase; m.position.set(Math.cos(a) * .75, 1.75 + Math.sin(t * 2 + i) * .08, Math.sin(a) * .75); m.rotation.y += dt * 2; });
  }

  // retrato: renderiza o rosto do personagem num canvas 2D (usado no HUD)
  const camRetrato = new THREE.PerspectiveCamera(28, 1, .1, 50), rt = new THREE.WebGLRenderTarget(128, 128), px = new Uint8Array(128 * 128 * 4), alvoW = new THREE.Vector3();
  function retrato(renderer, scene, canvas2d) {
    if (!obj) return;
    grupo.getWorldPosition(alvoW); const esc = grupo.scale.x * ESCALA;
    const ang = grupo.rotation.y + (grupo.parent ? grupo.parent.rotation.y : 0);
    camRetrato.position.set(alvoW.x + Math.sin(ang) * 2.6, alvoW.y + 1.55 * esc, alvoW.z + Math.cos(ang) * 2.6);
    camRetrato.lookAt(alvoW.x, alvoW.y + 1.35 * esc, alvoW.z);
    const fundo = scene.background; scene.background = null;
    const alvoAntes = renderer.getRenderTarget();
    renderer.setRenderTarget(rt); renderer.render(scene, camRetrato); renderer.readRenderTargetPixels(rt, 0, 0, 128, 128, px); renderer.setRenderTarget(alvoAntes);
    scene.background = fundo;
    const g = canvas2d.getContext('2d'), img = g.createImageData(128, 128), d = img.data;
    for (let y = 0; y < 128; y++) d.set(px.subarray((127 - y) * 512, (128 - y) * 512), y * 512);   // o WebGL devolve de cabeça para baixo
    g.putImageData(img, 0, 0);
  }

  return { grupo, carregar, atualizar, retrato, nivel: aplicarNivel, cor(c) { corAtual = c; lenco(c); aura.material.color.set(c); }, comemorar: () => umaVezSo('Cheer'), interagir: () => umaVezSo('Interact'), pegar: () => umaVezSo('PickUp'), get pronto() { return !!mixer; } };
}

// prévia giratória da tela inicial (renderizador próprio, leve)
export function criarPrevia(canvas, toon) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, canvas.width / canvas.height, .1, 20);
  camera.position.set(0, 1.4, 5.2); camera.lookAt(0, 1.0, 0);
  scene.add(new THREE.HemisphereLight('#e8f4ff', '#4a5a4a', 1.1));
  const luz = new THREE.DirectionalLight('#fff3df', 2.0); luz.position.set(2, 4, 3); scene.add(luz);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.9, 1, .18, 32), toon('#2f3f5a')); base.position.y = -.09; scene.add(base);
  let obj = null, mixer = null, pedido = 0, girando = true;
  async function mostrar(id, cor) {
    const meu = ++pedido;
    let gltf; try { gltf = await carregarPersonagem(id); } catch { return; }
    if (meu !== pedido) return;
    if (obj) scene.remove(obj);
    obj = instanciar(gltf, toon); scene.add(obj);
    const cab = obj.getObjectByName('head'); if (cab) { const t = new THREE.Mesh(new THREE.TorusGeometry(.19, .07, 8, 18), toon(cor)); t.rotation.x = Math.PI / 2; t.position.y = -.02; cab.add(t); }
    ({ mixer } = criarMixer(obj, gltf)); mixer.clipAction(gltf.animations.find(a => a.name === 'Idle') || gltf.animations[0]).play();
  }
  const relogio = new THREE.Clock();
  function quadro() {
    if (!renderer.domElement.isConnected || renderer.domElement.closest('.oculto')) { requestAnimationFrame(quadro); return; }
    const dt = Math.min(.05, relogio.getDelta());
    if (mixer) mixer.update(dt); if (obj && girando) obj.rotation.y += dt * .7;
    renderer.render(scene, camera); requestAnimationFrame(quadro);
  }
  quadro();
  return { mostrar, cor(c) { if (obj) { const cab = obj.getObjectByName('head'); const t = cab && cab.children.find(x => x.geometry && x.geometry.type === 'TorusGeometry'); if (t) t.material.color.set(c); } }, parar() { girando = false; }, comemorar() { if (!mixer || !obj) return; } };
}
