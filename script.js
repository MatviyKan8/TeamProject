const API_URL = "https://www.themealdb.com/api/json/v1/1/";

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const searchContainer = document.querySelector("#search-container");
const searchTitle = document.querySelector("#search-title");

const randomBtn = document.querySelector("#random-btn");
const whatCookBtn = document.querySelector("#what-cook-btn");

const modal = document.querySelector("#recipe-modal");
const closeModal = document.querySelector("#close-modal");

const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalInfo = document.querySelector("#modal-info");
const ingredientsList = document.querySelector("#ingredietns-list");
const instructions = document.querySelector("#instructions");

async function searchRecipes(query) {
    recipesContainer.innerHTML = "<p>Завантаження...</p>";
    try{
        const response = await fetch(
            `${API_URL}search.php?s=${query}`
        );
        const data = await response.json();

        if (!data.meals) {
            recipesContainer.innerHTML = 
                "<p>На жаль,рецептів не знайдено 😢</p>";
            return;
        }

        displayRecipes(data.meals);

    } catch (error) {
        recipesContainer.innerHTML = 
        "<p>Помилка завантаження рецептів.</p>";

        console.error(error);
    }
}

