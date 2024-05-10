document.addEventListener('DOMContentLoaded', function () {
    const publicKey = '68e8575df1742e20459944b1f58b361a';
    const baseUrl = 'https://gateway.marvel.com/v1/public/comics';
    let offset = 0;
    const limit = 5;

    const backButton = document.getElementById('back-btn');
    const loadMoreButton = document.getElementById('load-more-btn');

    function showBackButton() {
        backButton.style.display = 'block';
    }

    function hideLoadMoreButton() {
        loadMoreButton.style.display = 'none';
    }

    function resetState() {
        backButton.style.display = 'none';
        loadMoreButton.style.display = 'block';
        document.getElementById('comic-details').innerHTML = '';
        document.getElementById('comic-container').style.display = 'grid';
    }

    function updateBackButtonPosition() {
        const footer = document.querySelector('.footer');
        const footerRect = footer.getBoundingClientRect();
        const footerTop = footerRect.top + window.scrollY;
        const windowHeight = window.innerHeight;

        if (footerTop < windowHeight) {
            backButton.style.bottom = `${windowHeight - footerTop + 20}px`;
        } else {
            backButton.style.bottom = '20px';
        }
    }

    window.addEventListener('scroll', updateBackButtonPosition);
    window.addEventListener('resize', updateBackButtonPosition);

    const loadComics = async () => {
        try {
            const response = await fetch(`${baseUrl}?apikey=${publicKey}&limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comics');
            }
            const data = await response.json();
            if (data && data.data && data.data.results) {
                displayComics(data.data.results);
                document.getElementById('load-more-btn').style.display = 'block';
            } else {
                throw new Error('Failed to parse comics data');
            }
        } catch (error) {
            console.error('Error fetching comics:', error);
        }
    };

    const displayComics = (comics) => {
        const comicContainer = document.getElementById('comic-container');
        comics.forEach(comic => {
            const card = document.createElement('div');
            card.classList.add('comic-card');
            card.innerHTML = `
                <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
            `;
            card.addEventListener('mouseenter', () => {
                card.style.backgroundColor = '#f0f0f0';
            });
            card.addEventListener('mouseleave', () => {
                card.style.backgroundColor = '#ffffff';
            });
            card.addEventListener('click', () => {
                showComicDetails(comic);
                document.getElementById('load-more-btn').style.display = 'none';
                document.getElementById('back-btn').style.display = 'block';
            });
            comicContainer.appendChild(card);
        });
    };

    const showComicDetails = async (comic) => {
        const comicContainer = document.getElementById('comic-container');
        comicContainer.style.display = 'none';

        const comicDetails = document.getElementById('comic-details');
        comicDetails.innerHTML = `
            <div style="display: inline-block;">
                <img src="${comic.thumbnail.path}.${comic.thumbnail.extension}" alt="${comic.title}">
            </div>
            <div style="display: inline-block; margin-left: 20px;">
                <h2>${comic.title}</h2>
                <p>Published: ${new Date(comic.dates.find(item => item.type === 'onsaleDate').date).getFullYear()}</p>
                <p>Cover Artist: ${comic.creators.items.find(item => item.role === 'penciller (cover)') ? comic.creators.items.find(item => item.role === 'penciller (cover)').name : 'N/A'}</p>
                <p>Penciller: ${comic.creators.items.find(item => item.role === 'penciller') ? comic.creators.items.find(item => item.role === 'penciller').name : 'N/A'}</p>
                <p>Description: ${comic.description ? comic.description : 'N/A'}</p>
            </div>
        `;

        const backButton = document.getElementById('back-btn');
        if (backButton) {
            backButton.style.display = 'none';
        }
        backButton.addEventListener('click', () => {
            comicDetails.innerHTML = '';
            comicContainer.style.display = 'grid';
            document.getElementById('load-more-btn').style.display = 'block';
            backButton.style.display = 'none';
        });
    };

    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.addEventListener('click', () => {
        offset += limit;
        loadComics();
    });

    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            searchComics(baseUrl, searchTerm);
        }
    });

    const searchComics = async (baseUrl, searchTerm) => {
        try {
            const response = await fetch(`${baseUrl}?apikey=${publicKey}&titleStartsWith=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comics');
            }
            const data = await response.json();
            if (data && data.data && data.data.results) {
                clearComicContainer();
                displayComics(data.data.results);
                showBackButton();
                hideLoadMoreButton();
            } else {
                throw new Error('Failed to parse comics data');
            }
        } catch (error) {
            console.error('Error fetching comics:', error);
        }
    };

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== '') {
                searchComics(baseUrl, searchTerm);
            }
        }
    });
    
    const clearComicContainer = () => {
        const comicContainer = document.getElementById('comic-container');
        comicContainer.innerHTML = '';
    };

    backButton.addEventListener('click', () => {
        resetState();
    });

    function resetState() {
        const comicContainer = document.getElementById('comic-container');
        const comicDetails = document.getElementById('comic-details');
    
        comicDetails.innerHTML = '';
        comicContainer.style.display = 'grid';
        loadMoreButton.style.display = 'block';
        backButton.style.display = 'none';
    

        offset = 0; 
        comicContainer.innerHTML = ''; 
        loadComics(); 
    }
    

    loadComics();
});
