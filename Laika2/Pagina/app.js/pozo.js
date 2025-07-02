let scene, camera, renderer, controls;

        function init() {
            // Crear la escena
            scene = new THREE.Scene();

            // Crear la cámara
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 100;

            // Crear el renderizador
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Control de cámara
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.maxDistance = 500;
            controls.minDistance = 10;

            // Crear los pozos gravitacionales
            createGravityWell(0, 0, 20, 10, 0xffff00);  // Sol
            createPlanetWells();  // Planetas

            // Luz ambiental
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            // Luz puntual
            const pointLight = new THREE.PointLight(0xffffff, 1, 100);
            pointLight.position.set(50, 50, 50);
            scene.add(pointLight);

            // Actualizar la escena cuando cambia el tamaño de la ventana
            window.addEventListener('resize', onWindowResize);

            // Renderizar la escena
            animate();
        }

        function createGravityWell(x, y, size, depth, color) {
            const geometry = new THREE.PlaneGeometry(size, size, 100, 100);

            // Modificar la geometría para crear un pozo
            for (let i = 0; i < geometry.attributes.position.count; i++) {
                const verticeX = geometry.attributes.position.getX(i);
                const verticeY = geometry.attributes.position.getY(i);
                const distanceToCenter = Math.sqrt(verticeX * verticeX + verticeY * verticeY);
                const z = -depth / (distanceToCenter + 1);
                geometry.attributes.position.setZ(i, z);
            }

            // Material de malla
            const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, 0);
            scene.add(mesh);
        }

        function createPlanetWells() {
            // Definir datos para los planetas: [distancia del sol, tamaño del pozo, profundidad, color]
            const planets = [
                [30, 5, 2, 0x0000ff],  // Mercurio
                [40, 6, 3, 0xff4500],  // Venus
                [50, 7, 4, 0x0000ff],  // Tierra
                [60, 6, 2, 0xff0000],  // Marte
                [80, 12, 6, 0xffd700],  // Júpiter
                [100, 10, 5, 0xffa500], // Saturno
                [120, 8, 4, 0x87ceeb],  // Urano
                [140, 7, 3, 0x00008b],  // Neptuno
            ];

            planets.forEach(planet => {
                const [distance, size, depth, color] = planet;
                createGravityWell(distance, 0, size, depth, color);
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        init();