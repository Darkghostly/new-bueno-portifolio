const cyberProjects = [
  {
    name: "AES-Cryptography",
    url: "https://github.com/Darkghostly/AES-criptografy",
    description: "Implementação prática de criptografia simétrica AES com foco em integridade e confidencialidade.",
    techs: ["JavaScript", "Cryptography", "Python"]
  },
  {
    name: "RSA Encryptor",
    url: "https://github.com/Darkghostly/Encriptador-RSA",
    description: "Geração de chaves e criptografia usando RSA — demonstra conhecimento em criptografia assimétrica.",
    techs: ["JavaScript", "RSA", "Python"]
  },
  {
    name: "Gerador de Senhas",
    url: "https://github.com/Darkghostly/gerador-de-senhas",
    description: "Gerador de senhas fortes e configuráveis — utilitário prático para hardening de contas.",
    techs: ["JavaScript", "Security", "UI"]
  },
  {
    name: "OSINT Tools",
    url: "https://github.com/Darkghostly/OSINT-Tools",
    description: "hub de ferramentas de investigação OSINT com coletores e playbooks de inteligência.",
    techs: ["OSINT", "Python", "Intelligence"]
  },
  {
    name: "Guardlog",
    url: "https://github.com/Darkghostly/GuardLog",
    description: "Sistema de monitoramento de logs em tempo real para detecção de atividades suspeitas.",
    techs: ["Python", "Logging", "Security"]
  }
];

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    if (!burger || !nav) return;
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        document.body.classList.remove('nav-open');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });
};

const handleFormSubmit = () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const status = document.createElement('p');
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.textContent = "Mensagem enviada com sucesso!";
                    status.style.color = 'green';
                    form.appendChild(status);
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        status.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        status.textContent = "Oops! Ocorreu um problema ao enviar seu formulário.";
                    }
                    status.style.color = 'red';
                    form.appendChild(status);
                }
            } catch (error) {
                status.textContent = "Oops! Ocorreu um problema de conexão.";
                status.style.color = 'red';
                form.appendChild(status);
            }

            setTimeout(() => {
                status.remove();
            }, 5000);
        });
    }
}

function ensureProjectCardExists() {
    if (document.getElementById('project-card')) return;

    const card = document.createElement('aside');
    card.id = 'project-card';
    card.className = 'hidden';
    card.innerHTML = `
        <button id="card-close" aria-label="Fechar" title="Fechar" style="position:absolute;right:10px;top:10px;background:transparent;border:none;color:#bbb;font-weight:700;cursor:pointer">✕</button>
        <h2 id="card-title"></h2>
        <p id="card-description"></p>
        <div id="card-techs" style="margin-top:8px"></div>
        <a id="card-link" href="#" target="_blank">Ver no GitHub</a>
    `;
    document.body.appendChild(card);

    const style = document.createElement('style');
    style.textContent = `
    /* Project card (injetado) - mova para style.css se preferir */
    #project-card {
        position: fixed;
        right: 20px;
        top: 120px;
        width: 340px;
        max-width: calc(100% - 40px);
        background: rgba(15,15,15,0.95);
        border: 1px solid #1f1f1f;
        padding: 1.3rem 1.4rem;
        border-radius: 12px;
        backdrop-filter: blur(6px);
        transform: translateX(120%);
        transition: transform 0.35s cubic-bezier(.2,.9,.2,1), opacity .35s;
        z-index: 2200;
        color: #e8eefc;
        box-shadow: 0 8px 30px rgba(0,0,0,0.6);
        font-family: var(--font-family, Inter, system-ui, sans-serif);
    }
    #project-card.visible { transform: translateX(0); }
    #project-card h2 { font-size: 1.25rem; margin-bottom: .4rem; color: #fff; }
    #project-card p { color: #b7bdc8; margin-bottom: 0.75rem; line-height:1.3; font-size: 0.95rem; }
    #card-techs span {
        display:inline-block;
        margin: 4px 6px 4px 0;
        padding: 6px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #9fd3ff;
        background: rgba(0,123,255,0.06);
        border: 1px solid rgba(26,63,139,0.18);
    }
    #card-link {
        display:block;
        margin-top: 12px;
        background: linear-gradient(180deg,#007BFF,#0062CC);
        padding: 10px 12px;
        text-align:center;
        color:#fff;
        font-weight:700;
        border-radius:8px;
        text-decoration:none;
    }
    #card-link:hover { opacity:0.95; transform: translateY(-2px); }
    @media (max-width:900px) {
        #project-card { right: 12px; left: 12px; width: auto; top: 80px; transform: translateY(-10%); }
        #project-card.visible { transform: translateY(0); }
    }
    `;
    document.head.appendChild(style);

    document.getElementById('card-close').addEventListener('click', closeProjectCard);
}

let lastCameraState = null;
function openProjectCard(data, targetPosition, camera, controls = null) {
    ensureProjectCardExists();
    const card = document.getElementById('project-card');
    document.getElementById('card-title').textContent = data.name;
    document.getElementById('card-description').textContent = data.description || '';
    const techsDiv = document.getElementById('card-techs');
    techsDiv.innerHTML = '';
    (data.techs || []).forEach(t => {
        const s = document.createElement('span'); s.textContent = t; techsDiv.appendChild(s);
    });
    const link = document.getElementById('card-link');
    link.href = data.url || '#';

    const _savedTarget = new THREE.Vector3();
    _savedTarget.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1000));
    lastCameraState = {
        position: camera.position.clone(),
        target: _savedTarget
    };

    card.classList.add('visible');

    animateCameraToTarget(camera, targetPosition, 700);
}

function closeProjectCard() {
    const card = document.getElementById('project-card');
    if (!card) return;
    card.classList.remove('visible');

    if (lastCameraState && typeof cameraGlobal !== 'undefined') {
        animateCameraRestore(cameraGlobal, lastCameraState, 600);
        lastCameraState = null;
    }
}


let cameraGlobal = null; 
function animateCameraToTarget(camera, targetVec3, duration = 700) {
    cameraGlobal = camera;
    const startPos = camera.position.clone();
    const dir = new THREE.Vector3().subVectors(camera.position, targetVec3).normalize();
    const endPos = new THREE.Vector3().copy(targetVec3).addScaledVector(dir, 180); 
    const startTime = performance.now();

    function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const s = t * t * (3 - 2 * t);
        camera.position.lerpVectors(startPos, endPos, s);
        camera.lookAt(targetVec3);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function animateCameraRestore(camera, savedState, duration = 600) {
    if (!savedState || !savedState.position) return;
    const startPos = camera.position.clone();
    const endPos = savedState.position.clone();
    const endTarget = (savedState.target ? savedState.target.clone() : new THREE.Vector3(0,0,0));
    const startTime = performance.now();

    function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const s = t * t * (3 - 2 * t);
        camera.position.lerpVectors(startPos, endPos, s);
        
        camera.lookAt(endTarget);
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const initThreeJSAnimation = () => {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('scene-container');
    const tooltip = document.getElementById('tooltip');
    if (!container || !tooltip) return;

    const defaultColor = new THREE.Color(0xaaaaaa);
    const highlightColor = new THREE.Color(0x007BFF);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    camera.position.z = 380;

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.2);
    dirLight.position.set(1,1,1);
    scene.add(dirLight);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 12,
        map: createSquareTexture(),
        transparent: true,
        vertexColors: true,
        depthTest: true,
        sizeAttenuation: false
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];

   
    const usedProjects = cyberProjects.slice(0);

    usedProjects.forEach((project, i) => {
        const i_float = i + 0.5;
        const phi = Math.acos(1 - 2 * i_float / usedProjects.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i_float;
        // distribuir os pontos um pouco mais longe do centro
        const radius = 180;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        particlePositions.push(x, y, z);
        particleColors.push(defaultColor.r, defaultColor.g, defaultColor.b);

      
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);

    
        project._position = new THREE.Vector3(x, y, z);
    });

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particles);

    function createSquareTexture() {
        const canvas = document.createElement('canvas'); canvas.width = 16; canvas.height = 16;
        const context = canvas.getContext('2d'); context.fillStyle = '#ffffff'; context.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(canvas);
    }
    
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 12;

    const mouse = new THREE.Vector2();
    let intersected = null;
    let intersectedIndex = null;

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        tooltip.style.left = event.clientX + 12 + 'px';
        tooltip.style.top = event.clientY + 12 + 'px';
    }

    
    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(particles);
        if (hits.length > 0) {
            const index = hits[0].index;
            const data = usedProjects[index];
            if (!data) return;
            
            openProjectCard(data, data._position, camera);
        } else {
           
            closeProjectCard();
        }
    }

    
    function onTouchEnd(e) {
        
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(particles);
        if (hits.length > 0) {
            const index = hits[0].index;
            const data = usedProjects[index];
            if (!data) return;
            openProjectCard(data, data._position, camera);
        } else {
            closeProjectCard();
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('touchend', onTouchEnd);

    function onTouchMove(event) {
        if (event.touches.length > 0) {
            const rect = renderer.domElement.getBoundingClientRect();
            const touch = event.touches[0];
            mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        }
    }
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.0009;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(particles);
        const colors = particles.geometry.attributes.color;

        if (intersects.length > 0) {
            const index = intersects[0].index;
            if (intersectedIndex !== index) {
                if (intersectedIndex !== null) {
                    colors.setXYZ(intersectedIndex, defaultColor.r, defaultColor.g, defaultColor.b);
                }

                intersectedIndex = index;
                colors.setXYZ(intersectedIndex, highlightColor.r, highlightColor.g, highlightColor.b);

                tooltip.style.display = 'block';
                tooltip.textContent = usedProjects[intersectedIndex].name;
            }
        } else if (intersectedIndex !== null) {
            colors.setXYZ(intersectedIndex, defaultColor.r, defaultColor.g, defaultColor.b);
            intersectedIndex = null;
            tooltip.style.display = 'none';
        }
        
        colors.needsUpdate = true;

        renderer.render(scene, camera);
    }
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    ensureProjectCardExists();
    document.getElementById('card-link').addEventListener('click', () => {
    });

    animate();
};


document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    handleFormSubmit();
    initThreeJSAnimation();
});