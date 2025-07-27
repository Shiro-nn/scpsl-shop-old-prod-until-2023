window.addEventListener('load', async() => {
/*
https://bulkresizephotos.com/
https://sketchfab.com/3d-models/mtech-usa-xtreme-tactical-knife-d4dc5040a0e94dcd9dbba7f91bb2d01f
https://sketchfab.com/3d-models/classic-m4-a747ebdbb3d941ecb09b459c62865a75
https://sketchfab.com/3d-models/fn-spr-a3g-9931c4b26dab4a878cdff7989731d25b
https://sketchfab.com/3d-models/swat-operator-9e82fabf26194896b5ad4a364d864eab
https://sketchfab.com/3d-models/swat-operator-4k-followers-special-remaster-f6923917c8014578b1c1cb2b4c249268
https://sketchfab.com/3d-models/swat-with-m4-d9f90f73acf34a2f938548384e6d3665
https://sketchfab.com/3d-models/swat-operator-remastered-732d2eec5a0c456bafedd08af35134c3
https://sketchfab.com/3d-models/man-in-coat-human-riged-model-758a855697be47a1be0d707623e3907e

https://www.youtube.com/watch?v=XZOWXltX0M4
https://www.youtube.com/watch?v=p8xQ0waBwPo
http://www.makehumancommunity.org/content/downloads.html

https://www.youtube.com/watch?v=yn88Eqa9ogI

https://www.youtube.com/watch?v=FRQ-3FzZVuE
https://metahuman.unrealengine.com

animations
https://www.youtube.com/watch?v=XsX0X8odGsY
https://www.youtube.com/watch?v=IAiTYaiZmY0
*/

const container = document.querySelector('.setup');
const bar = document.querySelector('.setup .progress hr');
const barCounter = document.querySelector('.setup .progress cnt');
const barProgresser = document.querySelector('.setup .progress prgs');
let _barCount = 0;

await LoadScript(cdn_host+'/three.js/examples/js/loaders/GLTFLoader.js');
Progress(50);
await LoadScript(cdn_host+'/three.js/examples/js/loaders/DRACOLoader.js');
Progress(100);
AddCount();

const DracoLoader = new THREE.DRACOLoader().setDecoderPath(cdn_host+'/three.js/examples/js/libs/draco/gltf/');
const loader = new THREE.GLTFLoader().setDRACOLoader(DracoLoader);

const clock = new THREE.Clock();
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth - 20, container.clientHeight - 20);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

const animationMixers = [];

const ambientLight = new THREE.AmbientLight(0x506886, 0.4);
scene.add(ambientLight);

const _model = await LoadTexture('warehouse-optimize.glb', (pr) => Progress(pr));
scene.add(_model.scene);
AddCount();

const _lights = await LoadTexture('lights.glb', (pr) => Progress(pr));
AddCount();
scene.add(_lights.scene);

const camera = _lights.cameras[0];

/*
blender -> three.js
z > y
y > -z
*/
const _swat1 = await LoadTexture('swat-1.glb', (pr) => Progress(pr));
AddCount();
scene.add(_swat1.scene);
_swat1.scene.position.set(0.952504, -2.92667, -10.2349);
_swat1.scene.rotation.set(0, -0.3, 0, 'XYZ');
const _swat2 = await LoadTexture('swat-2.glb', (pr) => Progress(pr));
AddCount();
scene.add(_swat2.scene);
_swat2.scene.position.set(1.55842, -2.89994, -9.31497);
const _swat3 = await LoadTexture('swat-3.glb', (pr) => Progress(pr));
AddCount();
scene.add(_swat3.scene);
_swat3.scene.position.set(2.37912, -2.93803, -8.71275);
_swat3.scene.scale.set(0.01, 0.01, 0.01);
_swat3.scene.rotation.set(0, -0.7, 0, 'XYZ');

try{
if(_swat2.animations.length > 0){
    const animationMixer = new THREE.AnimationMixer(_swat2.scene);
    const action = animationMixer.clipAction(_swat2.animations[0]);
    action.play();
    animationMixers.push(animationMixer);
}
}catch{}

document.querySelector('.setup .progress').outerHTML = '';

animate();

MainRender();

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    for (let i = 0; i < animationMixers.length; i++) {
        try{animationMixers[i].update(delta);}catch{}
    }

    renderer.render(scene, camera);
};
function LoadTexture(url, cb = {}) {
    return new Promise(resolve => {
        //loader.load(cdn_host+'/scpsl/img/clans-wars/models/'+url, (gltf) => resolve(gltf),
        loader.load('/img/clans/models/'+url, (gltf) => resolve(gltf),
        function(xhr) {
            try{cb(Math.round(xhr.loaded / xhr.total * 100));}catch{}
        },
        function(error) {
            console.error(error);
            resolve();
        });
    });
}
function LoadScript(url){
    return new Promise(r => {
        const script = document.createElement('script');
        script.onload = r;
        script.src = url;
        document.body.appendChild(script);
    });
}

async function MainRender() {
    const base = document.createElement('div');
    base.className = 'post-progress';
    container.appendChild(base);
    const hr = document.createElement('hr');
    base.appendChild(hr);
    const _new = await LoadTexture('warehouse.glb', (pr) => hr.style.width = pr + '%');
    if(_new == undefined){
        base.outerHTML = '';
        setTimeout(() => MainRender(), 5000);
        return;
    }
    scene.add(_new.scene);
    base.outerHTML = '';
    scene.remove(_model);
}

function AddCount() {
    _barCount++;
    barCounter.innerHTML = _barCount;
}
function Progress(percent) {
    barProgresser.innerHTML = percent + '%';
    bar.style.width = percent + '%';
}

window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth - 20, container.clientHeight - 20);
});
});