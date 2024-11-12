const apiKey = '9aa1c1f8380746ba9afe809bb9c26b75';
const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeConteiner = document.querySelector('.recipe_conteiner');
const favouritesBtn = document.querySelector('#favouritesBtn');

//search data from searchBox
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchBox.value;
    if (query) {
        fetchRecipes(query);
    }
});
// wait until getting from api about this query and send json format of data to other method 
async function fetchRecipes(query) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=20&apiKey=${apiKey}`);
        const data = await response.json();
        if (data && data.results) {
            displayRecipes(data.results); 
        } else {
            recipeConteiner.innerHTML = `<p>No recipes found for "${query}"</p>`;
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}
//this function display recipes by getting data and then make div which has picture, title,and two button first is for viewing details second is to storing to favourites
function displayRecipes(recipes) {
    recipeConteiner.innerHTML = '';
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    recipes.forEach(recipe => {
        const isFavourite = favourites.some(fav => fav.id === recipe.id);
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe-card');
        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <div class="recipe-card-functions">
                <button onclick="showRecipeDetails(${recipe.id})">View Details</button>
                <button onclick="toggleFavourite({ id: ${recipe.id}, title: '${recipe.title}', image: '${recipe.image}' })" 
                        data-id="${recipe.id}" class="favourite-btn ${isFavourite ? 'favourite' : ''}">
                    &#x2764;
                </button>
            </div>
        `;
        recipeConteiner.appendChild(recipeElement);
    });
}
//this work after clicking button view details and view image,title,ingredients,instructions and calculate rating
async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const data = await response.json();
        const rating = data.spoonacularScore || 0;
        const stars = Math.round(rating / 20);

        const detailsContent = document.querySelector('#details-content');
        detailsContent.innerHTML = 
            `<span class="close-btn" onclick="closeDetails()">&times;</span>
            <img src="${data.image}" alt="${data.title}">
            <h1>${data.title}</h1>
            <p><strong>Ingredients:</strong> ${data.extendedIngredients.map(ing => ing.original).join(', ')}</p>
            <p><strong>Instructions:</strong> ${data.instructions || 'Instructions not available'}</p>
            <p><strong>Rating:</strong> <span class="stars">${generateStars(stars)}</span></p>
            `
        document.querySelector('#details').style.display = 'flex';
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}
//generate stars for rating
function generateStars(stars) {
    let starHTML = '';
    for (let i = 1; i <= 5; i++) {
        starHTML += i <= stars ? '<span class="star filled">&#9733;</span>' : '<span class="star">&#9734;</span>';
    }
    return starHTML;
}
//close details of recipe by styling the div
function closeDetails() {
    document.querySelector('#details').style.display = 'none';
}
//by this function we can push to favourites or delete from favourites
function toggleFavourite(recipe) {
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    const isFavourite = favourites.some(fav => fav.id === recipe.id);

    if (!isFavourite) {
        favourites.push(recipe);
    } else {
        favourites = favourites.filter(fav => fav.id !== recipe.id);
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));

    
    const button = document.querySelector(`button[data-id="${recipe.id}"]`);
    if (button) {
        button.classList.toggle('favourite', !isFavourite);
    }
}
//call function which show favourites
favouritesBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    displayFavourites();
});
//display all storing  in localStorage favourites items
function displayFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    if (favourites.length === 0) {
        recipeConteiner.innerHTML = `<p style="font-size: 20px;  font-weight: bold; text-align: center; padding: 20px;">No favourite recipes saved yet.</p>`;
        return;
    }

    
    displayRecipes(favourites);
}
