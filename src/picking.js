const THREE = require('three')
require('three-examples/controls/OrbitControls')
const { innerWidth: W, innerHeight: H } = window
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(45, W / H, 1, 1000)
const scene = new THREE.Scene()
const controls = new THREE.OrbitControls(camera, renderer.domElement)

renderer.setSize(W, H)
renderer.setClearColor(0xa0a0a0)
document.body.appendChild(renderer.domElement)
renderer.domElement.addEventListener('mousedown', onMouseDown)
renderer.domElement.addEventListener('touchstart', onMouseDown)

camera.position.set(0, 0, 10)
camera.lookAt(new THREE.Vector3())

const raycaster = new THREE.Raycaster()
let pickedObj = new THREE.Mesh()

const cube = new THREE.BoxGeometry(1, 1, 1)
const mat = new THREE.MeshBasicMaterial({ color: 0x00ab45 })
const mesh = new THREE.Mesh(cube, mat)

const group = getManyRandom(mesh, 50)
group.name = 'group'

scene.add(group)


renderLoop()

function renderLoop() {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(renderLoop)
}
/**
 * 
 * @param {MouseEvent} e 
 */
function onMouseDown(e) {
  let offset = new THREE.Vector2()
  const rect = e.target.getBoundingClientRect()
  if (e.type === 'mousedown' && e.which === 1) {
    offset.set(
      e.clientX - rect.left,
      e.clientY - rect.top
    )
  } else if (e.type === 'touchstart' && e.touches.length === 1) {
    offset.set(
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top
    )
  } else {
    return
  }
  pickObject({
    x: offset.x / rect.width * 2 - 1,
    y: -(offset.y / rect.height * 2 - 1)
  })
}

function pickObject(v2) {
  const hit = shootray(v2)
  pickedObj.material.wireframe = false
  if (hit) {
    hit.object.material.wireframe = true
    pickedObj = hit.object
  }
}
/**
 * 
 * @param {THREE.Vector2} v2
 */
function shootray(v2) {
  raycaster.setFromCamera(v2, camera)
  const intersects = raycaster.intersectObjects(scene.getObjectByName('group').children)
  return intersects[0]
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}
/**
 * 
 * @param {THREE.Mesh} mesh 
 * @param {number} n 
 */
function getManyRandom(mesh, n) {
  const c = () => Math.random()
  const s = () => rand(0.5, 1.5)
  const p = () => rand(-5, 5)
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const m = mesh.material.clone()
    const g = mesh.geometry.clone()
    m.color.set(new THREE.Color(c(), c(), c()))
    g.scale(s(), s(), s())
    const _mesh = new THREE.Mesh(g, m)
    _mesh.position.set(p(), p(), p())
    group.add(_mesh)
  }
  return group
}

window.__scene = scene
window.__renderer = renderer
window.THREE = THREE