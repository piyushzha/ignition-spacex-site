/* ============ mini3d.js ============
   A small, self-contained rotating Starship model embedded directly in the
   Gallery/Timeline section — separate from the full fleet viewer on
   rockets-3d.html so this page stays light and this file stays readable. */

function initMini3D(){
  const canvas = document.getElementById('mini3d');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 1, 9);

  // lights — one white key light, one orange accent to match the Starship theme
  scene.add(new THREE.AmbientLight(0x1b2436, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 5);
  scene.add(key);
  const glow = new THREE.PointLight(0xff5a1f, 2, 14);
  glow.position.set(0, -2, 3);
  scene.add(glow);

  // materials
  const bodyMat   = new THREE.MeshStandardMaterial({ color:0x1a1e26, metalness:0.65, roughness:0.4 });
  const noseMat   = new THREE.MeshStandardMaterial({ color:0xe3e7ec, metalness:0.8, roughness:0.28 });
  const flapMat   = new THREE.MeshStandardMaterial({ color:0x8f97a3, metalness:0.55, roughness:0.35, side:THREE.DoubleSide });
  const glowMat   = new THREE.MeshStandardMaterial({ color:0x2a2e35, metalness:0.7, roughness:0.3, emissive:0xff5a1f, emissiveIntensity:0.6 });

  const rocket = new THREE.Group();

  const bodyH = 5, bodyR = 0.42;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(bodyR, bodyR, bodyH, 28), bodyMat);
  body.position.y = bodyH/2;
  rocket.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(bodyR, bodyH*0.18, 28), noseMat);
  nose.position.y = bodyH + (bodyH*0.18)/2;
  rocket.add(nose);

  const ring = new THREE.Mesh(new THREE.CylinderGeometry(bodyR*1.03, bodyR*1.03, 0.05, 28), glowMat);
  ring.position.y = bodyH*0.6;
  rocket.add(ring);

  // engine cluster glow
  for(let i=0;i<9;i++){
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(bodyR*0.11, bodyR*0.14, 0.22, 10), glowMat);
    const ring2 = Math.min(i,7);
    const ang = (ring2/8)*Math.PI*2;
    const rad = bodyR*0.55;
    nozzle.position.set(Math.cos(ang)*rad, -0.1, Math.sin(ang)*rad);
    rocket.add(nozzle);
  }

  // four flaps
  const flapGeo = new THREE.BoxGeometry(bodyR*1.1, bodyH*0.22, 0.04);
  const f1 = new THREE.Mesh(flapGeo, flapMat); f1.position.set(bodyR, bodyH*0.82, 0); f1.rotation.z = 0.35; rocket.add(f1);
  const f2 = new THREE.Mesh(flapGeo, flapMat); f2.position.set(-bodyR, bodyH*0.82, 0); f2.rotation.z = -0.35; rocket.add(f2);
  const f3 = new THREE.Mesh(flapGeo.clone(), flapMat); f3.scale.set(1,0.6,1); f3.position.set(bodyR*0.95, 0.35, 0); f3.rotation.z = 0.4; rocket.add(f3);
  const f4 = new THREE.Mesh(flapGeo.clone(), flapMat); f4.scale.set(1,0.6,1); f4.position.set(-bodyR*0.95, 0.35, 0); f4.rotation.z = -0.4; rocket.add(f4);

  rocket.position.y = -bodyH*0.5;
  scene.add(rocket);

  // drag-to-rotate, matching the interaction on the full 3D page
  let dragging = false, lastX = 0, autoSpin = true, rotY = 0.6;
  canvas.addEventListener('pointerdown', e => { dragging = true; autoSpin = false; lastX = e.clientX; });
  window.addEventListener('pointerup', () => dragging = false);
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX) * 0.01;
    lastX = e.clientX;
  });

  function resize(){
    const size = canvas.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function animate(){
    requestAnimationFrame(animate);
    if (autoSpin) rotY += 0.004;
    rocket.rotation.y = rotY;
    renderer.render(scene, camera);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', initMini3D);
