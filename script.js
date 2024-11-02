// Função para carregar a galeria de imagens
    function loadGallery() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Limpa a galeria antes de carregar
        for (let i = 1; i <= 100; i++) { // Ajuste o número conforme necessário
            const img = document.createElement('img');
            img.src = imagens/imagem${i}.jpg; // Caminho para cada imagem
            img.alt = Imagem ${i};
            img.onclick = () => selectImage(img.src);
            gallery.appendChild(img);
        }
    }
</script>

    <!-- Página Ampliada para Escrever História -->
    <div id="storyPage" class="hidden">
        <h2>Escreva sua história</h2>
        <div id="story">
            <img id="selectedImage" src="" alt="Imagem Selecionada">
            <textarea id="storyText" placeholder="Escreva sua história aqui..."></textarea><br>
            <button class="submit-button" onclick="saveStory()">Concluir</button>
        </div>
        <button class="back-button" onclick="showPage('galleryPage')">Voltar</button>
    </div>

    <!-- Página de Atividades Armazenadas -->
    <div id="viewActivitiesPage" class="hidden">
        <h2>Atividades Produzidas</h2>
        <div id="activitiesList"></div>
    </div>

    <!-- Página Visualizar História -->
    <div id="viewStoryPage" class="hidden">
        <h2>História</h2>
        <img id="storyImage" src="" alt="Imagem da História"><br>
        <p id="storyName"></p>
        <p id="storyContent"></p>
        <button class="back-button" onclick="showActivities()">Voltar</button>
    </div>

    <script>
        // Função para mostrar a página correspondente
        function showPage(pageId) {
            const pages = ['mainPage', 'sobre', 'atividades', 'galleryPage', 'storyPage', 'viewActivitiesPage', 'viewStoryPage'];
            pages.forEach(page => document.getElementById(page).classList.add('hidden'));
            document.getElementById(pageId).classList.remove('hidden');
        }

        // Função para capturar o nome do usuário
        let userName = '';
        let selectedImage = '';

        function entrar() {
            const nomeInput = document.getElementById('nome');
            if (nomeInput.value.trim() !== "") {
                userName = nomeInput.value;
                showPage('galleryPage');
                loadGallery();
            } else {
                alert('Por favor, digite seu nome.');
            }
        }

        // Função para carregar a galeria de imagens
        function loadGallery() {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = ''; // Limpa a galeria antes de carregar
            for (let i = 1; i <= 100; i++) {
                const img = document.createElement('img');
                img.src = `imagens/imagem${i}.jpg`; // Ajuste o caminho conforme necessário
                img.alt = `Imagem ${i}`;
                img.onclick = () => selectImage(img.src);
                gallery.appendChild(img);
            }
        }

        // Função para selecionar uma imagem
        function selectImage(imageSrc) {
            selectedImage = imageSrc;
            document.getElementById('selectedImage').src = imageSrc;
            showPage('storyPage');
        }

        // Função para salvar a história
        function saveStory() {
            const storyText = document.getElementById('storyText').value;
            if (storyText.length > 0) {
                const activity = {
                    image: selectedImage,
                    name: userName,
                    story: storyText
                };

                let activities = JSON.parse(localStorage.getItem('activities')) || [];
                activities.push(activity);
                localStorage.setItem('activities', JSON.stringify(activities));

                alert('História salva com sucesso!');
                showPage('mainPage');
            } else {
                alert('Por favor, escreva sua história.');
            }
        }

        // Função para mostrar atividades realizadas
        function showActivities() {
            const activitiesList = document.getElementById('activitiesList');
            activitiesList.innerHTML = '';
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities.forEach(activity => {
                const div = document.createElement('div');
                div.className = 'activity-item';
                const img = document.createElement('img');
                img.src = activity.image;
                const name = document.createElement('p');
                name.textContent = activity.name;
                const viewButton = document.createElement('button');
                viewButton.textContent = 'Ver História';
                viewButton.className = 'view-story-button';
                viewButton.onclick = () => viewStory(activity);

                div.appendChild(img);
                div.appendChild(name);
                div.appendChild(viewButton);
                activitiesList.appendChild(div);
            });
            showPage('viewActivitiesPage');
        }

        // Função para ver a história completa
        function viewStory(activity) {
            document.getElementById('storyImage').src = activity.image;
            document.getElementById('storyName').textContent = activity.name;
            document.getElementById('storyContent').textContent = activity.story;
            showPage('viewStoryPage');
        }
async function saveActivity(imageId) {
    const name = document.getElementById("nome").value;
    const story = prompt("Escreva sua história para a imagem " + imageId + ":");
    if (story) {
        try {
            await db.collection("activities").add({
                name: name,
                imageId: imageId,
                story: story,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("Atividade salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar atividade:", error);
        }
    }
}

async function showActivities() {
    showPage("activitiesPage");
    const activityList = document.getElementById("activityList");
    activityList.innerHTML = "";

    try {
        const snapshot = await db.collection("activities").orderBy("timestamp", "desc").get();
        if (snapshot.empty) {
            activityList.innerHTML = "<p>Nenhuma atividade realizada.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const activity = doc.data();
            const item = document.createElement("div");
            item.classList.add("activity-item");
            item.innerHTML = `
                <p><strong>${activity.name}</strong> - Imagem ${activity.imageId}</p>
                <p>${activity.story}</p>
            `;
            activityList.appendChild(item);
        });
    } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        activityList.innerHTML = "<p>Erro ao carregar atividades.</p>";
    }
}
