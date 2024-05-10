const publicKey = '68e8575df1742e20459944b1f58b361a';
let offset = 0;

async function fetchMarvelData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
    }
}

async function fetchAndDisplayCharacters() {
    const charactersContainer = document.getElementById('charactersContainer');
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    const url = `https://gateway.marvel.com/v1/public/characters?apikey=${publicKey}&limit=5&offset=${offset}${searchTerm ? `&nameStartsWith=${searchTerm}` : ''}`;
    const data = await fetchMarvelData(url);

    if (data && data.data && data.data.results) {
        displayCharacters(data.data.results);
        updateLoadMoreButton(data.data.total);
        updateBackButton(searchTerm);
    }
}

async function fetchAndDisplayComics(characterId) {
    const comicsContainer = document.getElementById('comicsContainer');

    const url = `https://gateway.marvel.com/v1/public/characters/${characterId}/comics?apikey=${publicKey}`;
    const data = await fetchMarvelData(url);

    if (data && data.data && data.data.results) {
        displayComics(data.data.results);
    }
}

function displayCharacters(characters) {
    const charactersContainer = document.getElementById('charactersContainer');

    characters.forEach(character => {
        const card = createCharacterCard(character);
        charactersContainer.appendChild(card);
        card.addEventListener('click', () => {
            switchDisplay();
            fetchAndDisplayComics(character.id);
        });
    });
    
    offset += 5;
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.classList.add('character-card', 'card');
    card.setAttribute('data-character-id', character.id);

    const image = document.createElement('img');
    image.src = `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`;
    card.appendChild(image);

    const name = document.createElement('h3');
    name.textContent = character.name;
    card.appendChild(name);

    const description = document.createElement('p');
    description.classList.add('character-info');
    description.textContent = character.description || 'No description available';
    card.appendChild(description);

    return card;
}

function displayComics(comics) {
    const comicsContainer = document.getElementById('comicsContainer');

    comics.forEach(comic => {
        const card = createComicCard(comic);
        comicsContainer.appendChild(card);
    });
}

function createComicCard(comic) {
    const card = document.createElement('div');
    card.classList.add('comic-card', 'card');

    const image = document.createElement('img');
    image.src = `${comic.thumbnail.path}/portrait_incredible.${comic.thumbnail.extension}`;
    card.appendChild(image);

    return card;
}

function updateLoadMoreButton(total) {
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (offset >= total) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

function updateBackButton(searchTerm) {
    const backButton = document.getElementById('backButton');
    if (searchTerm) {
        backButton.style.display = 'block';
    } else {
        backButton.style.display = 'none';
    }
}

function switchDisplay() {
    document.getElementById('charactersContainer').style.display = 'none';
    document.getElementById('loadMoreButton').style.display = 'none';
    document.getElementById('comicsContainer').style.display = 'block';
    document.getElementById('backButton').style.display = 'block';
}

document.getElementById('loadMoreButton').addEventListener('click', fetchAndDisplayCharacters);

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('charactersContainer').style.display = 'block';
    document.getElementById('comicsContainer').style.display = 'none';
    document.getElementById('backButton').style.display = 'none';
    offset = 0;
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    fetchAndDisplayCharacters();
});

document.getElementById('searchInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        offset = 0;
        fetchAndDisplayCharacters();
    }
});

fetchAndDisplayCharacters();
