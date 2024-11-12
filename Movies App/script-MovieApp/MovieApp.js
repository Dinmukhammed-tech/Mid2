const apiKey = '30f2a27a3eb612ada99923b68edc6517';
const searchInput = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const moviesContainer = document.querySelector('.movies_container');

//we search by this function by getting text from searchInput
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchInput.placeholder = "Search for movies";
        searchInput.style.border = '1px solid white';
        searchMovies(query);
        clearPreviousSuggestions();
    } else {
        searchInput.style.border = '1px solid red';
        searchInput.placeholder = "Please input the data";
    }
});
//after choosing or clicking button the suggestions clearing by this function
function clearPreviousSuggestions() {
    const existingSuggestions = document.querySelector('.suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}
//this function getting value from search input and send to other function which view suggestion about this query
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        getAutoCompleteSuggestions(query);
    }
});

//this method get information from api so this function is async after searching query it convert to json format and send data to other function which show this movie data
async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        if (response.ok) {
            const data = await response.json();
            displayMovies(data.results); 
        } else {
            throw new Error("Failed to fetch movies");
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

//this function auto suggest about your inputed query and send data to function which display sugestions
async function getAutoCompleteSuggestions(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        if (response.ok) {
            const data = await response.json();
            displaySuggestions(data.results); 
        } else {
            throw new Error("Failed to fetch suggestions");
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}
//this function get data from getAutoCompleteSuggestions and made 5 suggestions by div which has title of the movie
function displaySuggestions(movies) {
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.classList.add('suggestions');

    
    movies.slice(0, 5).forEach(movie => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = movie.title;

        
        suggestionItem.addEventListener('click', () => {
            searchInput.value = movie.title;
            searchMovies(movie.title);
            suggestionsContainer.innerHTML = ''; 
        });

        suggestionsContainer.appendChild(suggestionItem);
    });

    
    clearPreviousSuggestions();
    document.querySelector('header nav form').appendChild(suggestionsContainer);
}

//this function display movies show their title and release date and button viewDetails from getting data from function searchMovies
function displayMovies(movies) {
    moviesContainer.innerHTML = ''; 
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '../assets-MovieApp/images/no_image.png';

        movieElement.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" class="movie-poster"/>
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date || 'N/A'}</p>
            <button onclick="viewDetails(${movie.id})">View Details</button>
        `;

        moviesContainer.appendChild(movieElement);
    });
}
//after clicking the button view details it wait and get data from api and convert to json and send data to method  displayMovieDetails
async function viewDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (response.ok) {
            const movie = await response.json();
            displayMovieDetails(movie);
        } else {
            throw new Error("Failed to fetch movie details");
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}
//make div which has on the left side poster and on right side has info about it and close button
function displayMovieDetails(movie) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('movie-details');

    const posterPath = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '../assets-MovieApp/images/no_image.png';

    detailsContainer.innerHTML = `
        <div class="movie-details-content">
            <img src="${posterPath}" alt="${movie.title}" class="movie-details-poster"/>
            <div class="movie-info">
                <h2>${movie.title}</h2>
                <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
                <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
                <p><strong>Runtime:</strong> ${movie.runtime || 'N/A'} minutes</p>
                <p><strong>Overview:</strong> ${movie.overview || 'No description available.'}</p>
                <button onclick="closeDetails()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(detailsContainer);
}

// this function remove and close div of movieDetails
function closeDetails() {
    const detailsContainer = document.querySelector('.movie-details');
    if (detailsContainer) {
        detailsContainer.remove();
    }
}





