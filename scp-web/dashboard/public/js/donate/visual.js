const LoaderProgress = document.getElementById('loaderProgress');
const LoaderStat = LoaderProgress.querySelector('hr');
let perc = {
    cur: 0,
    avail: 0,
}
const interv = setInterval(() => {
    if(perc.cur > perc.avail) perc.cur--;
    if(perc.cur < perc.avail) perc.cur++;
    LoaderStat.style.width = perc.cur + '%';
}, 1);
function DestroyLoaderStat(){
    try{clearInterval(interv);}catch{}
    try{LoaderProgress.outerHTML = '';}catch{}
}
function UpdateLoaderStat(per) {
    if(per < 0) per = 0;
    if(per > 100) per = 100;
    perc.avail = per;
}

const logger = new Logger();

import * as THREE from 'three';
UpdateLoaderStat(4);
import { GLTFLoader } from 'https://cdn.scpsl.shop/three.js/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('render');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
container.appendChild(renderer.domElement);

camera.position.set(-9.549533267279543, 2.3567125844771795, 2.6786963345517893);
camera.rotation.set(-0.9518292297822445, -1.1410926649738609, -0.906143536424804, 'XYZ');

/*
camera.position.set(-316.28, -998, -2234.59);
camera.rotation.set(0, -1.5, 0, 'XYZ');
import { FlyControls } from 'https://cdn.scpsl.shop/three.js/examples/jsm/controls/FlyControls.js';
const _fly = new FlyControls(camera, renderer.domElement);
_fly.movementSpeed = 10;
_fly.domElement = container;
_fly.rollSpeed = Math.PI / 6;
_fly.autoForward = false;
_fly.dragToLook = false;
*/

const ambientLight = new THREE.AmbientLight(0x506886, 0.4);
scene.add(ambientLight);

const loader = new GLTFLoader();

const clock = new THREE.Clock();


let mixers = [];

const Models = {
    ClassD: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
    Scientist: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
    Guard: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
    MTF: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
    Chaos: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
    Hand: {
        root: null,
        nimb: null,
        light: null,
        doctor: null,
        flasher: null,
    },
}
const sums = {
    nimb: 99,
    light: 75,
    doctor: 399,
    flasher: 599,
}
/*
ClassD: 0,
Scientist: 1,
Guard: 2,
MTF: 3,
Chaos: 4,
Hand: 5,
*/
let SelectedRole = 0;
let VisualData = {
    active: false,
    expires: 0,
    sum: 0,
    root: {
        nimb: false,
        light: false,
        doctor: false,
        flasher: false,
    },
    ClassD: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
    Scientist: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
    Guard: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
    MTF: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
    Chaos: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
    Hand: {
        nimb: true,
        light:{
            buy: true,
            color: {r: 255, g: 0, b: 0}
        },
        doctor: true,
        flasher: true,
    },
}
let LatestData = JSON.parse(JSON.stringify(VisualData));
let rendered = false;

async function Init() {
    {
        const _model = await LoadTexture('/HCZ_457.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 4));
        scene.add(_model.scene);
        {
            const light = new THREE.PointLight(0xffe7d2, 7, 7.8);
            light.position.set(-9.445, 3.662, -0.013);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xff0000, 1, 7);
            light.position.set(-0.755, 3.66, -0.008);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        setTimeout(() => {
            let animationMixer = new THREE.AnimationMixer(_model.scene);
            let animation = animationMixer.clipAction(_model.animations[1]);
            animation.setLoop(THREE.LoopOnce);
            animation.clampWhenFinished = true;
            animation.enable = true;
            animation.play();
            mixers.push(animationMixer);
            setTimeout(() => mixers = mixers.filter(x => x != animationMixer), 1000 * animation._clip.duration);
        }, 60000);
        document.onkeydown = function(e) {
            if(window.event.keyCode == 'W'.charCodeAt(0)){
                camera.position.setX(camera.position.x-1)
                return false;
            }
            if(window.event.keyCode == 'S'.charCodeAt(0)){
                camera.position.setX(camera.position.x+1)
                return false;
            }
            if(window.event.keyCode == 'A'.charCodeAt(0)){
                camera.position.setZ(camera.position.z-1)
                return false;
            }
            if(window.event.keyCode == 'D'.charCodeAt(0)){
                camera.position.setZ(camera.position.z+1)
                return false;
            }
            if(window.event.keyCode == 'Q'.charCodeAt(0)){
                camera.position.setY(camera.position.y-1)
                return false;
            }
            if(window.event.keyCode == 'E'.charCodeAt(0)){
                camera.position.setY(camera.position.y+1)
                return false;
            }
            if(window.event.keyCode == 'R'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x, camera.rotation.y+0.05, camera.rotation.z, 'XYZ')
                return false;
            }
            if(window.event.keyCode == 'T'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x, camera.rotation.y-0.05, camera.rotation.z, 'XYZ')
                return false;
            }
            if(window.event.keyCode == 'Y'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x+0.05, camera.rotation.y, camera.rotation.z, 'XYZ')
                return false;
            }
            if(window.event.keyCode == 'H'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x-0.05, camera.rotation.y, camera.rotation.z, 'XYZ')
                return false;
            }
            if(window.event.keyCode == 'U'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z+0.05, 'XYZ')
                return false;
            }
            if(window.event.keyCode == 'J'.charCodeAt(0)){
                camera.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z-0.05, 'XYZ')
                return false;
            }
            if(!(e.ctrlKey && e.shiftKey)) return;
            if(window.event.keyCode == 'Z'.charCodeAt(0)){
                console.log(camera);
                return false;
            }
            if(window.event.keyCode == 'X'.charCodeAt(0)){
                let animationMixer = new THREE.AnimationMixer(_model.scene);
                let animation = animationMixer.clipAction(_model.animations[1]);
                animation.setLoop(THREE.LoopOnce);
                animation.clampWhenFinished = true;
                animation.enable = true;
                animation.play();
                mixers.push(animationMixer);
                setTimeout(() => mixers = mixers.filter(x => x != animationMixer), 1000 * animation._clip.duration);
                return false;
            }
            if(window.event.keyCode == 'C'.charCodeAt(0)){
                let animationMixer = new THREE.AnimationMixer(_model.scene);
                let animation = animationMixer.clipAction(_model.animations[0]);
                animation.setLoop(THREE.LoopOnce);
                animation.clampWhenFinished = true;
                animation.enable = true;
                animation.play();
                mixers.push(animationMixer);
                setTimeout(() => mixers = mixers.filter(x => x != animationMixer), 1000 * animation._clip.duration);
                return false;
            }
            if(window.event.keyCode == 'V'.charCodeAt(0)){
                console.log(mixers)
                return false;
            }
        }
    }
    {
        const _model = await LoadTexture('/Surface.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 12));
        scene.add(_model.scene);
        _model.scene.position.set(0, 1000, 0);
        {
            const light = new THREE.PointLight(0xffe7d2, 7, 7.8);
            light.position.set(-9.445, 1003.662, -0.013);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xff0000, 1, 7);
            light.position.set(-0.755, 1003.66, -0.008);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 2){
                _pl();
                setInterval(() => _pl(), 1000 * 60 * 5);
                function _pl() {
                    const animation = mixer.clipAction(clip);
                    animation.setLoop(THREE.LoopOnce);
                    animation.clampWhenFinished = true;
                    animation.enable = true;
                    animation.play();
                    mixers.push(mixer);
                    setTimeout(() => mixers = mixers.filter(x => x != mixer), 1000 * animation._clip.duration);
                }
            }
        });
        mixers.push(mixer);
    }
    {
        const _model = await LoadTexture('/EZ_Chef.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 20));
        scene.add(_model.scene);
        _model.scene.position.set(-316.28, -1000, -2234.59);
        {
            const light = new THREE.PointLight(0xffe7d2, 7, 7.8);
            light.position.set(-9.445, 1003.662, -0.013);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xff0000, 1, 7);
            light.position.set(-0.755, 1003.66, -0.008);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
    }
    {
        const _model = await LoadTexture('/ClassDShotGun.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 28));
        //_model.scene.rotation.set(0,180,0);
        scene.add(_model.scene);
        Models.ClassD.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1) mixer.clipAction(clip).play();
            else if(i == 15 || i == 38){
                const _action = mixer.clipAction(clip);
                _action.play();
                setTimeout(() => _action.stop(), 1000 * 60 * 5);
            }else if(i == 25){
                const _action = mixer.clipAction(clip);
                setTimeout(() => _action.play(), 1000 * 60 * 5);
            }
        });
        mixers.push(mixer);
    }
    {
        const _model = await LoadTexture('/TutorialE11Rifle.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 36));
        scene.add(_model.scene);
        Models.Hand.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1) mixer.clipAction(clip).play();
            else if(i == 11){
                const _action = mixer.clipAction(clip);
                _action.play();
                setTimeout(() => _action.stop(), 1000 * 60 * 5);
            }else if(i == 20){
                const _action = mixer.clipAction(clip);
                setTimeout(() => _action.play(), 1000 * 60 * 5);
            }
        });
        mixers.push(mixer);

        _model.scene.position.set(0, 0, 0);
    }
    {
        const _model = await LoadTexture('/Scientist.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 44));
        _model.scene.rotation.set(0, -1.5, 0);
        _model.scene.position.set(99.35, 987.1991, 58.56);
        _model.scene.scale.set(1.6, 1.6, 1.6);
        scene.add(_model.scene);
        Models.Scientist.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 0 || i == 7) mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(97, 991.1991, 56.5);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(101, 991.1991, 60.5);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
    }
    {
        const _model = await LoadTexture('/ChaosInsurgency.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 52));
        _model.scene.rotation.set(0, -1.5, 0);
        _model.scene.position.set(12, 987.2094, 59);
        _model.scene.scale.set(1.6, 1.6, 1.6);
        scene.add(_model.scene);
        Models.Chaos.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1 || i == 27) mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(10, 991.2094, 57);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(14, 991.2094, 61);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
    }
    {
        const _model = await LoadTexture('/MTFComander.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 60));
        _model.scene.rotation.set(0.45, -4.7, -0.45);
        _model.scene.position.set(174, 992.4335, 59);
        _model.scene.scale.set(1.493463, 1.493463, 1.493463);
        scene.add(_model.scene);
        Models.MTF.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1 || i == 17) mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(176, 996.4335, 57);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
        {
            const light = new THREE.PointLight(0xffe7d2, 4, 15);
            light.position.set(172, 996.4335, 61);
            light.scale.set(1.284, 1.284, 1.284);
            scene.add(light);
        }
    }
    {
        const _model = await LoadTexture('/Guard.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8) + 68));
        _model.scene.rotation.set(1, -1.5, 1);
        _model.scene.position.set(-318.5443, -1000, -2234.624);
        _model.scene.scale.set(1.6, 1.6, 1.6);
        scene.add(_model.scene);
        Models.Guard.root = _model.scene;
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1 || i == 11) mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
    }
    for (let i = 1; 6 >= i; i++) {
        const _model = await LoadTexture('/Doctor.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8/6) + 76 + (8 / 6 * i*1.5)));
        _model.scene.scale.set(0, 0, 0);
        _model.scene.rotation.set(0, 0, 0);
        _model.scene.position.set(0, 0, 0);
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1 || i == 11 || i == 36) mixer.clipAction(clip).play();
        });
        mixers.push(mixer);
        scene.add(_model.scene);
        if(i == 1){
            Models.ClassD.doctor = _model.scene;
            _model.scene.rotation.set(0, -3.5, 0);
            _model.scene.position.set(-6.738, 0, 1.44);
        }
        else if(i == 2){
            Models.Scientist.doctor = _model.scene;
            Models.Scientist.root.attach(_model.scene);
            _model.scene.rotation.set(0, 1, 0);
            _model.scene.position.set(1, 0, -0.5);
        }
        else if(i == 3){
            Models.Guard.doctor = _model.scene;
            Models.Guard.root.attach(_model.scene);
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(0.5, 0, -0.5);
        }
        else if(i == 4){
            Models.MTF.doctor = _model.scene;
            _model.scene.rotation.set(0, -4.7, 0);
            _model.scene.position.set(172.97, 992.4335, 60.08);
        }
        else if(i == 5){
            Models.Chaos.doctor = _model.scene;
            _model.scene.rotation.set(0, -4.3, 0);
            _model.scene.position.set(13.5, 987.221, 57.959);
        }
        else if(i == 6){
            Models.Hand.doctor = _model.scene;
            _model.scene.rotation.set(0, -3.141, 0);
            _model.scene.position.set(-7.050226, 1000, 1.397172);
        }
    }
    for (let i = 1; 6 >= i; i++) {
        const _model = await LoadTexture('/Flasher.glb', (pr) => UpdateLoaderStat(Math.abs(pr/100*8/6) + 88 + (8 / 6 * i*1.5)));
        _model.scene.scale.set(0, 0, 0);
        _model.scene.rotation.set(0, 0, 0);
        _model.scene.position.set(0, 0, 0);
        const mixer = new THREE.AnimationMixer(_model.scene);
        _model.animations.forEach((clip, i) => {
            if(i == 1 || i == 33) mixer.clipAction(clip).play();
            else if(i == 36){
                const _clp = mixer.clipAction(clip);
                _clp.play();
                setInterval(() => {
                    let ii = 0;
                    const _interval = setInterval(() => {
                        ii++;
                        _clp.stop();
                        setTimeout(() => _clp.play(), 500);
                        if(ii == 30) clearInterval(_interval);
                    }, 1000);
                }, 60000);
            }
        });
        mixers.push(mixer);
        scene.add(_model.scene);
        if(i == 1){
            Models.ClassD.flasher = _model.scene;
            _model.scene.rotation.set(0, -3.5, 0);
            _model.scene.position.set(-6.4, 0, .44);
        }
        else if(i == 2){
            Models.Scientist.flasher = _model.scene;
            Models.Scientist.root.attach(_model.scene);
            _model.scene.rotation.set(0, 1, 0);
            _model.scene.position.set(1.5, 0, -1);
        }
        else if(i == 3){
            Models.Guard.flasher = _model.scene;
            Models.Guard.root.attach(_model.scene);
            _model.scene.rotation.set(0, .4, 0);
            _model.scene.position.set(1, 0, -.3);
        }
        else if(i == 4){
            Models.MTF.flasher = _model.scene;
            _model.scene.rotation.set(0, -4.7, 0);
            _model.scene.position.set(173.97, 992.4335, 61.08);
        }
        else if(i == 5){
            Models.Chaos.flasher = _model.scene;
            _model.scene.rotation.set(0, -1.5, 0);
            _model.scene.position.set(10.5, 987.221, 57.959);
        }
        else if(i == 6){
            Models.Hand.flasher = _model.scene;
            _model.scene.rotation.set(0, -3.5, 0);
            _model.scene.position.set(-6.3, 1000, .5);
        }
    }
    for (let i = 1; 6 >= i; i++) {
        const _model = await LoadTexture('/Nimb.glb', (pr) => UpdateLoaderStat(100));
        _model.scene.scale.set(0, 0, 0);//0.15, 0.15, 0.15
        _model.scene.rotation.set(0, 0, 0);
        _model.scene.position.set(0, 1.28, 0);
        scene.add(_model.scene);
        if(i == 1){
            Models.ClassD.nimb = _model.scene;
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(-6.621, 2.935, 3.024);
        }
        else if(i == 2){
            Models.Scientist.nimb = _model.scene;
            Models.Scientist.root.attach(_model.scene);
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(0, 1.79, 0);
        }
        else if(i == 3){
            Models.Guard.nimb = _model.scene;
            Models.Guard.root.attach(_model.scene);
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(0.025, 1.85, -0.025);
        }
        else if(i == 4){
            Models.MTF.nimb = _model.scene;
            _model.scene.rotation.set(0.45, -4.7, -0.45);
            _model.scene.position.set(174, 996.5, 59);
        }
        else if(i == 5){
            Models.Chaos.nimb = _model.scene;
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(12, 990.9, 59);
        }
        else if(i == 6){
            Models.Hand.nimb = _model.scene;
            _model.scene.rotation.set(0, 0, 0);
            _model.scene.position.set(-6.6, 1002.935, 3.04);
        }
    }
    for (let i = 1; 6 >= i; i++) {
        const light = new THREE.PointLight(0xff0000, 4, 15);
        light.position.set(0, 0, 0);
        light.visible = false;
        scene.add(light);
        if(i == 1){
            Models.ClassD.light = light;
            light.rotation.set(0, 0, 0);
            light.position.set(-6.621, 2.935, 3.024);
        }
        else if(i == 2){
            Models.Scientist.light = light;
            Models.Scientist.root.attach(light);
            light.rotation.set(0, 0, 0);
            light.position.set(0, 1.79, 0);
        }
        else if(i == 3){
            Models.Guard.light = light;
            Models.Guard.root.attach(light);
            light.rotation.set(0, 0, 0);
            light.position.set(0.025, 1.85, -0.025);
        }
        else if(i == 4){
            Models.MTF.light = light;
            light.rotation.set(0.45, -4.7, -0.45);
            light.position.set(174, 996.5, 59);
        }
        else if(i == 5){
            Models.Chaos.light = light;
            light.rotation.set(0, 0, 0);
            light.position.set(12, 990.9, 59);
        }
        else if(i == 6){
            Models.Hand.light = light;
            light.rotation.set(0, 0, 0);
            light.position.set(-6.6, 1002.935, 3.04);
        }
    }
    UpdateLoaderStat(100);
    rendered = true;
    
    while(!LoadedData){
        await sleep(1000);
    }
    document.getElementById('vis.loadData').style.display = 'none';

    DestroyLoaderStat();
    
    function animate() {
        requestAnimationFrame(animate);
  
        var delta = clock.getDelta();
        for (let i = 0; i < mixers.length; i++) {
            const mixer = mixers[i];
            if (mixer) mixer.update(delta);
        }
        
        //_fly.update(delta);

        renderer.render(scene, camera);
    };
    animate();
}

let LoadedData = false;
async function LoadData() {
    socket.on('visual.get', (data) => {
        if(data == null) return;
        VisualData = {...data};
        LatestData = JSON.parse(JSON.stringify(VisualData));
        LoadedData = true;
        try{UpdateElementsByData();}catch{}
    });
    if(socket.connected) socket.emit('visual.get');
    socket.on('connect', () => socket.emit('visual.get'));
}

Init();
LoadData();
UpdateData();
BuyButtonsPatcher();

async function BuyButtonsPatcher(){
    while(!LoadedData){
        await sleep(1000);
    }
    CreateBuyButton('visual.nimb', 1);
    CreateBuyButton('visual.light', 2);
    CreateBuyButton('visual.doctor', 3);
    CreateBuyButton('visual.flasher', 4);
    function CreateBuyButton(_rc, uid){
        const _el = document.getElementById(_rc, uid).querySelector('.m27');
        const _fa = _el.querySelector('span');
        _el.addEventListener('click', () => {
            if(SelectedRole == 0) UpdateButton(VisualData.ClassD, Models.ClassD, _fa, uid);
            else if(SelectedRole == 1) UpdateButton(VisualData.Scientist, Models.Scientist, _fa, uid, true);
            else if(SelectedRole == 2) UpdateButton(VisualData.Guard, Models.Guard, _fa, uid, true);
            else if(SelectedRole == 3) UpdateButton(VisualData.MTF, Models.MTF, _fa, uid);
            else if(SelectedRole == 4) UpdateButton(VisualData.Chaos, Models.Chaos, _fa, uid);
            else if(SelectedRole == 5) UpdateButton(VisualData.Hand, Models.Hand, _fa, uid);
            else logger.warn('Неизвестный ID роли');
        });
        const _el1 = document.getElementById(_rc, uid).querySelector('.m22');
        const _fa1 = _el1.querySelector('span');
        _el1.addEventListener('click', () => UpdateRootButton(_fa1, uid));
    }
    function UpdateButton(_vd, _md, _fa, uid, parset = false){
        if(uid == 1){
            if(!VisualData.root.nimb) return logger.log('Для изменения видимости, приобретите данный визуал');
            if(_vd.nimb){
                _vd.nimb = false;
                _fa.className = 'fa-solid fa-eye';
                _fa.style.color = '#b0f542';
                UpdateVisualModels(_vd, _md, uid, parset);
            }else{
                _vd.nimb = true;
                _fa.className = 'fa-solid fa-eraser';
                _fa.style.color = 'yellow';
                UpdateVisualModels(_vd, _md, uid, parset);
            }
        }
        else if(uid == 2){
            if(!VisualData.root.light) return logger.log('Для изменения видимости, приобретите данный визуал');
            if(_vd.light.buy){
                _vd.light.buy = false;
                _fa.className = 'fa-solid fa-eye';
                _fa.style.color = '#b0f542';
                UpdateVisualModels(_vd, _md, uid, parset);
            }else{
                _vd.light.buy = true;
                _fa.className = 'fa-solid fa-eraser';
                _fa.style.color = 'yellow';
                UpdateVisualModels(_vd, _md, uid, parset);
            }
        }
        else if(uid == 3){
            if(!VisualData.root.doctor) return logger.log('Для изменения видимости, приобретите данный визуал');
            if(_vd.doctor){
                _vd.doctor = false;
                _fa.className = 'fa-solid fa-eye';
                _fa.style.color = '#b0f542';
                UpdateVisualModels(_vd, _md, uid, parset);
            }else{
                _vd.doctor = true;
                _fa.className = 'fa-solid fa-eraser';
                _fa.style.color = 'yellow';
                UpdateVisualModels(_vd, _md, uid, parset);
            }
        }
        else if(uid == 4){
            if(!VisualData.root.flasher) return logger.log('Для изменения видимости, приобретите данный визуал');
            if(_vd.flasher){
                _vd.flasher = false;
                _fa.className = 'fa-solid fa-eye';
                _fa.style.color = '#b0f542';
                UpdateVisualModels(_vd, _md, uid, parset);
            }else{
                _vd.flasher = true;
                _fa.className = 'fa-solid fa-eraser';
                _fa.style.color = 'yellow';
                UpdateVisualModels(_vd, _md, uid, parset);
            }
        }
    }
    function UpdateVisualModels(_vd, _md, uid, parset = false){
        switch (uid) {
            case 1:
                if(VisualData.root.nimb && _vd.nimb) _md.nimb.scale.set(0.15, 0.15, 0.15);
                else _md.nimb.scale.set(0, 0, 0);
                break;
            case 2:
                if(VisualData.root.light && _vd.light.buy) _md.light.visible = true;
                else _md.light.visible = false;
                break;
            case 3:
                if(VisualData.root.doctor && _vd.doctor){
                    const scl = parset ? 0.7 : 1;
                    _md.doctor.scale.set(scl, scl, scl);
                }
                else _md.doctor.scale.set(0, 0, 0);
                break;
            case 4:
                if(VisualData.root.flasher && _vd.flasher){
                    const scl = parset ? 0.4 : 0.7;
                    _md.flasher.scale.set(scl, scl, scl);
                }
                else _md.flasher.scale.set(0, 0, 0);
                break;
        }
    }
    function UpdateRootButton(_fa, uid){
        if(uid == 1){
            if(VisualData.root.nimb){
                VisualData.sum -= sums.nimb;
                VisualData.root.nimb = false;
                _fa.className = 'fa-solid fa-plus';
                _fa.style.color = 'lime';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }else{
                VisualData.sum += sums.nimb;
                VisualData.root.nimb = true;
                _fa.className = 'fa-solid fa-minus';
                _fa.style.color = 'red';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }
        }
        else if(uid == 2){
            if(VisualData.root.light){
                VisualData.sum -= sums.light;
                VisualData.root.light = false;
                _fa.className = 'fa-solid fa-plus';
                _fa.style.color = 'lime';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }else{
                VisualData.sum += sums.light;
                VisualData.root.light = true;
                _fa.className = 'fa-solid fa-minus';
                _fa.style.color = 'red';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }
        }
        else if(uid == 3){
            if(VisualData.root.doctor){
                VisualData.sum -= sums.doctor;
                VisualData.root.doctor = false;
                _fa.className = 'fa-solid fa-plus';
                _fa.style.color = 'lime';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }else{
                VisualData.sum += sums.doctor;
                VisualData.root.doctor = true;
                _fa.className = 'fa-solid fa-minus';
                _fa.style.color = 'red';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }
        }
        else if(uid == 4){
            if(VisualData.root.flasher){
                VisualData.sum -= sums.flasher;
                VisualData.root.flasher = false;
                _fa.className = 'fa-solid fa-plus';
                _fa.style.color = 'lime';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }else{
                VisualData.sum += sums.flasher;
                VisualData.root.flasher = true;
                _fa.className = 'fa-solid fa-minus';
                _fa.style.color = 'red';
                UpdateSum();
                UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid);
                UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true);
                UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true);
                UpdateVisualModels(VisualData.MTF, Models.MTF, uid);
                UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid);
                UpdateVisualModels(VisualData.Hand, Models.Hand, uid);
            }
        }
    }
    function UpdateSum(){
        const _sum = document.getElementById('vis.sum');
        try{if(_sum.innerHTML != `${VisualData.sum}`) _sum.innerHTML = VisualData.sum;}catch{}
    }
}
function UpdateSelectorButton(){
    if(SelectedRole == 0) UpdateSB(VisualData.ClassD);
    else if(SelectedRole == 1) UpdateSB(VisualData.Scientist);
    else if(SelectedRole == 2) UpdateSB(VisualData.Guard);
    else if(SelectedRole == 3) UpdateSB(VisualData.MTF);
    else if(SelectedRole == 4) UpdateSB(VisualData.Chaos);
    else if(SelectedRole == 5) UpdateSB(VisualData.Hand);
    function UpdateSB(_vd){
        UpdateButton(document.getElementById('visual.nimb').querySelector('.m27').querySelector('span'), _vd.nimb);
        UpdateButton(document.getElementById('visual.light').querySelector('.m27').querySelector('span'), _vd.light.buy);
        UpdateButton(document.getElementById('visual.doctor').querySelector('.m27').querySelector('span'), _vd.doctor);
        UpdateButton(document.getElementById('visual.flasher').querySelector('.m27').querySelector('span'), _vd.flasher);
        document.getElementById('visual.color').value = rgbToHex(_vd.light.color.r, _vd.light.color.g, _vd.light.color.b);
        function UpdateButton(_fa, _data){
            if(_data){
                _fa.className = 'fa-solid fa-eraser';
                _fa.style.color = 'yellow';
            }else{
                _fa.className = 'fa-solid fa-eye';
                _fa.style.color = '#b0f542';
            }
        }
    }
}

function UpdateData(){
    let _cachedExp = 0;
    const _sum = document.getElementById('vis.sum');
    const _exp = document.getElementById('vis.exp');
    const _expTippy = tippy(_exp, {content: 'Не приобретен', animation: 'perspective', allowHTML: true});
    setInterval(() => {
        if(!LoadedData) return;
        try{if(_sum.innerHTML != `${VisualData.sum}`) _sum.innerHTML = VisualData.sum;}catch{}
        if(_cachedExp != VisualData.expires){
            try{
                const _dates = GetStringFromDate(VisualData.expires);
                try{_expTippy.setContent(_dates[1])}catch{}
                _exp.innerHTML = _dates[0];
                _cachedExp = VisualData.expires;
            }catch{}
        }
    }, 1000);
}
function GetStringFromDate(date) {
    const time = new Date(parseInt(date));
    const day = time.getDate();
    const month = time.getMonth() + 1;
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const now_day = new Date(Date.now()).getDate();
    const now_month = new Date(Date.now()).getMonth() + 1;
    const now_year = new Date(Date.now()).getFullYear();
    let str;
    if(now_day == day && month == now_month && year == now_year) str = `Сегодня, в ${dateTimePad(hour, 2)}:${dateTimePad(minute, 2)}`;
    else if(now_day + 1 == day && month == now_month && year == now_year) str = `Завтра, в ${dateTimePad(hour, 2)}:${dateTimePad(minute, 2)}`;
    else str = dateTimePad(day, 2) + "." + dateTimePad(month, 2) + "." + dateTimePad(year, 2);
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
    };
    const aria = time.toLocaleString("ru", options);
    return [str, aria];
}
function dateTimePad(value, digits){
    let number = value
    while (number.toString().length < digits) {
        number = "0" + number
    }
    return number;
}

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight)
}
function LoadTexture(url, cb = {}) {// /img/visual/models
    url = 'https://cdn.scpsl.shop/scpsl/img/models'+url;//https://cdn.scpsl.shop/scpsl/img/models
    return new Promise(resolve => {
        loader.load(url, (gltf) => resolve(gltf),
        function(xhr) {
            try{cb(Math.round(xhr.loaded / xhr.total * 100));}catch{}
        },
        function(error) {
            console.error(error);
            resolve();
        });
    });
}

CreateButtons();
function CreateButtons() {
    const e1 = document.createElement('div');
    e1.className = 'm15';
    container.appendChild(e1);
    const ad = {
        ClassD:{
            color: '#ff9900',
            name: 'Д-класс',
            default: true,
            camera:{
                pos:{x: -9.549533267279543, y: 2.3567125844771795, z: 2.6786963345517893},
                rot:{x: -0.9518292297822445, y: -1.1410926649738609, z: -0.906143536424804},
            }
        },
        Scientist:{
            color: '#e2e26d',
            name: 'Ученый',
            default: false,
            camera:{
                pos:{x: 103.982, y: 991.137, z: 54.642},
                rot:{x: 0.7, y: -3.8, z: -0.45},
            }
        },
        Guard:{
            color: '#afafa1',
            name: 'Охранник',
            default: false,
            camera:{
                pos:{x: -315.6009132846303, y: -997.2442627815398, z: -2233.968516685784},
                rot:{x: -1.138247891928829, y: 1.0154482754720415, z: 1.0076823614029384},
            }
        },
        MTF:{
            color: '#0074ff',
            name: 'МОГ',
            default: false,
            camera:{
                pos:{x: 168.982, y: 996.137, z: 59.642},
                rot:{x: -1.35, y: -7.35, z: -1.35},
            }
        },
        Chaos:{
            color: '#1cac1c',
            name: 'Хаос',
            default: false,
            camera:{
                pos:{x: 15.982, y: 990.137, z: 58.642},
                rot:{x: 0.65, y: -4.25, z: -0.6},
            }
        },
        Hand:{
            color: '#00ff00',
            name: 'Длань Змея',
            default: false,
            camera:{
                pos:{x: -9.549533267279543, y: 1002.3567125844771795, z: 2.6786963345517893},
                rot:{x: -0.9518292297822445, y: -1.1410926649738609, z: -0.906143536424804},
            }
        },
    }
    let _listBtns = [];
    CreateButton(ad.ClassD, 0);
    CreateButton(ad.Scientist, 1);
    CreateButton(ad.Guard, 2);
    CreateButton(ad.MTF, 3);
    CreateButton(ad.Chaos, 4);
    CreateButton(ad.Hand, 5);
    function CreateButton(data, uid) {
        const e2 = document.createElement('div');
        e2.className = 'm16';
        e1.appendChild(e2);
        const e3 = document.createElement('div');
        e3.className = 'm17';
        if(data.default) e3.className += ' m17-sel';
        e3.style.backgroundColor = data.color;
        e2.appendChild(e3);
        tippy(e3, {content: data.name});
        _listBtns.push(e3);
        e3.addEventListener('click', ()=>{
            try{for (let i = 0; i < _listBtns.length; i++) _listBtns[i].className = 'm17';}catch{}
            e3.className = 'm17 m17-sel';
            camera.position.set(data.camera.pos.x, data.camera.pos.y, data.camera.pos.z);
            camera.rotation.set(data.camera.rot.x, data.camera.rot.y, data.camera.rot.z, 'XYZ');
            SelectedRole = uid;
            UpdateSelectorButton();
        });
    }
}
window.addEventListener('load', () => {
    tippy(document.getElementById('visual.nimb').querySelector('.m18'), {content: 'Создает нимб над вами', animation: 'perspective'});
    tippy(document.getElementById('visual.light').querySelector('.m18'),
    {content: 'Станьте светом в этом темном комплексе<br>Цвет также можно настроить', animation: 'perspective', allowHTML: true});
    tippy(document.getElementById('visual.doctor').querySelector('.m18'), {content: 'Ваш личный доктор<br>Подаст лекарства в нужный момент<br>'+
    'Инвентарь: 2 аптечки & 3 обезболивающего<br>& 2 адреналина<br>*Имеется секретная способность', animation: 'perspective', allowHTML: true});
    tippy(document.getElementById('visual.flasher').querySelector('.m18'), {content: 'Тот самый МТФ-ник с флешкой на построении<br>'+
    'Может кинуть флешку во врага<br>Инвентарь: 5 флешек<br>*Имеется секретная способность', animation: 'perspective', allowHTML: true});
    
    tippy(document.getElementById('visual.light').querySelector('.fa-plus'),
    {content: '*Будет сильный пролаг во время включения<br>[На сайте, а не на сервере]', animation: 'perspective', allowHTML: true});
});

window.addEventListener('load', () => {
    const _color = document.getElementById('visual.color');
    try{tippy(_color, {content: 'Нажмите, чтобы изменить цвет свечения', animation: 'perspective'});}catch{}
    _color.onclick = () => false;
    const picker = new CP(_color);
    picker.on('change', function(r, g, b) {
        const _hex = this.color(r, g, b);
        if(SelectedRole == 0) UpdateColor(VisualData.ClassD, Models.ClassD);
        else if(SelectedRole == 1) UpdateColor(VisualData.Scientist, Models.Scientist);
        else if(SelectedRole == 2) UpdateColor(VisualData.Guard, Models.Guard);
        else if(SelectedRole == 3) UpdateColor(VisualData.MTF, Models.MTF);
        else if(SelectedRole == 4) UpdateColor(VisualData.Chaos, Models.Chaos);
        else if(SelectedRole == 5) UpdateColor(VisualData.Hand, Models.Hand);
        function UpdateColor(_vis, _md){
            if(_md.light == null) return;
            _md.light.color.setRGB(r / 255, g / 255, b / 255);
            _vis.light.color.r = r;
            _vis.light.color.g = g;
            _vis.light.color.b = b;
            _color.value = _hex;
        }
    });
});
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let _reqSended = false;
window.addEventListener('load', () => {
    document.getElementsByClassName('visual.buy')[0].addEventListener('click', async() => {
        if(_reqSended) return logger.warn('Запрос на покупку визуала уже отправлен');
        if(VisualData.sum == 0 && LatestData.sum == 0) return alert('Нельзя изменить, продлить и приобрести визуал за 0 рублей');
        if(!confirm('Вы уверены, что хотите ' + GetMsg())) return;
        _reqSended = true;
        const res = await fetch('/donate/buy/visual', {
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(VisualData)
        });
        const json = await res.json();
        _reqSended = false;
        if(json.error) return logger.warn(json.message);
        logger.log('Визуал успешно ' + json.type);
        VisualData = {...json.data};
        LatestData = JSON.parse(JSON.stringify(VisualData));
        try{UpdateElementsByData();}catch{}
    });

    function GetMsg() {
        if(!LatestData.active) return `приобрести визуал?\nС вашего баланса будет списано ${VisualData.sum}₽`;

        if(LatestData.root.doctor != VisualData.root.doctor ||
            LatestData.root.flasher != VisualData.root.flasher ||
            LatestData.root.light != VisualData.root.light ||
            LatestData.root.nimb != VisualData.root.nimb){
                let ssum = VisualData.sum - LatestData.sum;
                if(ssum < 0) return 'убрать один из элементов визуала';
                const cf = (VisualData.expires - Date.now()) / (1000 * 60 * 60 * 24 * 30);
                ssum = Math.ceil(ssum * cf);
                return `докупить визуал\nС вашего баланса будет списано ${ssum}₽`;
            }
        
        if(AnotherSub(LatestData.Chaos, VisualData.Chaos) ||
            AnotherSub(LatestData.Chaos, VisualData.Chaos) ||
            AnotherSub(LatestData.ClassD, VisualData.ClassD) ||
            AnotherSub(LatestData.Guard, VisualData.Guard) ||
            AnotherSub(LatestData.Hand, VisualData.Hand) ||
            AnotherSub(LatestData.MTF, VisualData.MTF) ||
            AnotherSub(LatestData.Scientist, VisualData.Scientist)) return 'изменить визуал';
        
        return `продлить визуал\nС вашего баланса будет списано ${VisualData.sum}₽`;
        
        function AnotherSub(latest, now) {
            if(latest.doctor != now.doctor ||
                latest.flasher != now.flasher ||
                latest.nimb != now.nimb ||
                latest.light.buy != now.light.buy ||
                latest.light.color.r != now.light.color.r ||
                latest.light.color.g != now.light.color.g ||
                latest.light.color.b != now.light.color.b)
                return true;
        }
    }
});

window.addEventListener('load', () => {
    const _button = document.getElementsByClassName('visual.buy')[0];

    setInterval(() => {
        if(!LatestData.active) return UpdateButton('Приобрести');

        if(LatestData.root.doctor != VisualData.root.doctor ||
            LatestData.root.flasher != VisualData.root.flasher ||
            LatestData.root.light != VisualData.root.light ||
            LatestData.root.nimb != VisualData.root.nimb){
                let ssum = VisualData.sum - LatestData.sum;
                if(ssum < 0) return UpdateButton('Убрать (0₽)');
                const cf = (VisualData.expires - Date.now()) / (1000 * 60 * 60 * 24 * 30);
                ssum = Math.ceil(ssum * cf);
                return UpdateButton('Докупить (' + ssum + '₽)');
            }
        
        if(AnotherSub(LatestData.Chaos, VisualData.Chaos) ||
            AnotherSub(LatestData.Chaos, VisualData.Chaos) ||
            AnotherSub(LatestData.ClassD, VisualData.ClassD) ||
            AnotherSub(LatestData.Guard, VisualData.Guard) ||
            AnotherSub(LatestData.Hand, VisualData.Hand) ||
            AnotherSub(LatestData.MTF, VisualData.MTF) ||
            AnotherSub(LatestData.Scientist, VisualData.Scientist)) return UpdateButton('Изменить');
        
        UpdateButton('Продлить');
        
        function AnotherSub(latest, now) {
            if(latest.doctor != now.doctor ||
                latest.flasher != now.flasher ||
                latest.nimb != now.nimb ||
                latest.light.buy != now.light.buy ||
                latest.light.color.r != now.light.color.r ||
                latest.light.color.g != now.light.color.g ||
                latest.light.color.b != now.light.color.b)
                return true;
        }
    }, 500);

    function UpdateButton(text) {
        if(_button.innerHTML == text) return;
        _button.innerHTML = text;
    }
});

async function UpdateElementsByData() {
    while(!rendered){
        await sleep(1000);
    }

    try{ UpdateSelectorButton(); } catch(e) { logger.error(e); }

    try{ UpdateRootButtons(); } catch(e) { logger.error(e); }

    for (let uid = 1; uid < 5; uid++) {
        try{ UpdateVisualModels(VisualData.ClassD, Models.ClassD, uid); } catch(e) { logger.error(e); }
        try{ UpdateVisualModels(VisualData.Scientist, Models.Scientist, uid, true); } catch(e) { logger.error(e); }
        try{ UpdateVisualModels(VisualData.Guard, Models.Guard, uid, true); } catch(e) { logger.error(e); }
        try{ UpdateVisualModels(VisualData.MTF, Models.MTF, uid); } catch(e) { logger.error(e); }
        try{ UpdateVisualModels(VisualData.Chaos, Models.Chaos, uid); } catch(e) { logger.error(e); }
        try{ UpdateVisualModels(VisualData.Hand, Models.Hand, uid); } catch(e) { logger.error(e); }
    }

    function UpdateVisualModels(_vd, _md, uid, parset = false){
        switch (uid) {
            case 1:
                if(VisualData.root.nimb && _vd.nimb) _md.nimb.scale.set(0.15, 0.15, 0.15);
                else _md.nimb.scale.set(0, 0, 0);
                break;
            case 2:
                if(VisualData.root.light && _vd.light.buy){
                    _md.light.visible = true;
                    _md.light.color.setRGB(_vd.light.color.r / 255, _vd.light.color.g / 255, _vd.light.color.b / 255);
                }
                else _md.light.visible = false;
                break;
            case 3:
                if(VisualData.root.doctor && _vd.doctor){
                    const scl = parset ? 0.7 : 1;
                    _md.doctor.scale.set(scl, scl, scl);
                }
                else _md.doctor.scale.set(0, 0, 0);
                break;
            case 4:
                if(VisualData.root.flasher && _vd.flasher){
                    const scl = parset ? 0.4 : 0.7;
                    _md.flasher.scale.set(scl, scl, scl);
                }
                else _md.flasher.scale.set(0, 0, 0);
                break;
        }
    }

    function UpdateRootButtons() {
        if(VisualData.root.nimb){
            const el = document.getElementById('visual.nimb').querySelector('.m22 span');
            el.className = 'fa-solid fa-minus';
            el.style.color = 'red';
        }else{
            const el = document.getElementById('visual.nimb').querySelector('.m22 span');
            el.className = 'fa-solid fa-plus';
            el.style.color = 'lime';
        }
    
        if(VisualData.root.light){
            const el = document.getElementById('visual.light').querySelector('.m22 span');
            el.className = 'fa-solid fa-minus';
            el.style.color = 'red';
        }else{
            const el = document.getElementById('visual.light').querySelector('.m22 span');
            el.className = 'fa-solid fa-plus';
            el.style.color = 'lime';
        }
    
        if(VisualData.root.doctor){
            const el = document.getElementById('visual.doctor').querySelector('.m22 span');
            el.className = 'fa-solid fa-minus';
            el.style.color = 'red';
        }else{
            const el = document.getElementById('visual.doctor').querySelector('.m22 span');
            el.className = 'fa-solid fa-plus';
            el.style.color = 'lime';
        }
    
        if(VisualData.root.flasher){
            const el = document.getElementById('visual.flasher').querySelector('.m22 span');
            el.className = 'fa-solid fa-minus';
            el.style.color = 'red';
        }else{
            const el = document.getElementById('visual.flasher').querySelector('.m22 span');
            el.className = 'fa-solid fa-plus';
            el.style.color = 'lime';
        }
    }
}