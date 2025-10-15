const projects = [
    {
        name: "Sistema de PDI",
        url: "https://github.com/Galaticos-API/API-2"
    },
    {
        name: "AES-criptografy",
        url: "https://github.com/Darkghostly/AES-criptografy"
    },
    {
        name: "Gerador de Senhas",
        url: "https://github.com/Darkghostly/gerador-de-senhas"
    },
    {
        name: "Sistema de atestados",
        url: "https://github.com/Galaticos-API/API-1"
    },
    {
        name: "Flores Crescendo",
        url: "https://github.com/Darkghostly/CSS-Blossoming-Flowers"
    },
    {
        name: "Site de Cafeteria",
        url: "https://github.com/Darkghostly/Cafeteria"
    },
    {
        name: "Encriptador RSA",
        url: "https://github.com/Darkghostly/Encriptador-RSA"
    },
    {
        name: "OSINT-framework",
        url: "https://github.com/Darkghostly/OSINT-Framework"
    },
    //{ name: "Sistema de E-commerce", url: "https://github.com/seu-usuario/ecommerce" },
    //{ name: "App de Clima", url: "https://github.com/seu-usuario/weather-app" },
    //{ name: "Plataforma de Blog", url: "https://github.com/seu-usuario/blog-platform" },
    //{ name: "Jogo da Memória", url: "https://github.com/seu-usuario/memory-game" },
    //{ name: "API de Finanças", url: "https://github.com/seu-usuario/finance-api" },
    //{ name: "Dashboard Analítico", url: "https://github.com/seu-usuario/analytics-dashboard" },
];

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
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

handleFormSubmit();

const initThreeJSAnimation = () => {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('scene-container');
    const tooltip = document.getElementById('tooltip');
    if (!container || !tooltip) return;

    const defaultColor = new THREE.Color(0xaaaaaa);
    const highlightColor = new THREE.Color(0x007BFF);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    camera.position.z = 250;

    const group = new THREE.Group();
    scene.add(group);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 5,
        map: createSquareTexture(),
        transparent: true,
        vertexColors: true 
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];

    projects.forEach((project, i) => {
        const i_float = i + 0.5;
        const phi = Math.acos(1 - 2 * i_float / projects.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i_float;
        const radius = 120;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        particlePositions.push(x, y, z);
        particleColors.push(defaultColor.r, defaultColor.g, defaultColor.b);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);
    });

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    
    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    group.add(particles);

    function createSquareTexture() {
        const canvas = document.createElement('canvas'); canvas.width = 16; canvas.height = 16;
        const context = canvas.getContext('2d'); context.fillStyle = 'white'; context.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(canvas);
    }
    
    const raycaster = new THREE.Raycaster();
    
    raycaster.params.Points.threshold = 5;

    const mouse = new THREE.Vector2();
    let intersected = null;

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        tooltip.style.left = event.clientX + 15 + 'px';
        tooltip.style.top = event.clientY + 15 + 'px';
    }

    function onClick(event) {
        if (intersected !== null) {
            const project = projects[intersected];
            window.open(project.url, '_blank');
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    function animate() {
        requestAnimationFrame(animate);
        group.rotation.y += 0.001;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(particles);
        const colors = particles.geometry.attributes.color;

        if (intersects.length > 0) {
            const index = intersects[0].index;
            if (intersected !== index) {
                if (intersected !== null) {
                    colors.setXYZ(intersected, defaultColor.r, defaultColor.g, defaultColor.b);
                }

                intersected = index;
                colors.setXYZ(intersected, highlightColor.r, highlightColor.g, highlightColor.b);

                tooltip.style.display = 'block';
                tooltip.textContent = projects[intersected].name;
            }
        } else if (intersected !== null) {
            colors.setXYZ(intersected, defaultColor.r, defaultColor.g, defaultColor.b);
            intersected = null;
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

    animate();
};

document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    handleFormSubmit();
    initThreeJSAnimation();
});