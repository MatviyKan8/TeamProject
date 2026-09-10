const API_URL = "https://www.themealdb.com/api/json/v1/1/";

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const recipesContainer = document.querySelector("#recipes-container");
const resultsTitle = document.querySelector("#results-title");

const randomBtn = document.querySelector("#random-btn");
const whatCookBtn = document.querySelector("#what-cook-btn");

const modal = document.querySelector("#recipe-modal");
const closeModal = document.querySelector("#close-modal");

const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalInfo = document.querySelector("#modal-info");
const ingredientsList = document.querySelector("#ingredients-list");
const instructions = document.querySelector("#instructions");

const imageModal = document.querySelector("#image-modal");
const bigImage = document.querySelector("#big-image");
const closeImage = document.querySelector("#close-image");

const favoritesBtn = document.querySelector("#favorites-btn");
const favoriteBtn = document.querySelector("#favorite-btn");
const themeBtn = document.querySelector("#theme-btn");

const cookModal = document.querySelector("#cook-modal");
const closeCookModal = document.querySelector("#close-cook-modal");
const findCookBtn = document.querySelector("#find-cook-btn");
const ingredientsInput = document.querySelector("#ingredients-input");
const cookStatus = document.querySelector("#cook-status");

let currentRecipe = null;


async function searchRecipes(query) {

    recipesContainer.innerHTML = "<p>Завантаження...</p>";

    try {

        const response = await fetch(
            `${API_URL}search.php?s=${query}`
        );

        const data = await response.json();

        if (!data.meals) {
            recipesContainer.innerHTML =
                "<p>На жаль, рецептів не знайдено 😢</p>";
            return;
        }

        displayRecipes(data.meals);

    } catch (error) {

        recipesContainer.innerHTML =
            "<p>Помилка завантаження рецептів.</p>";

        console.error(error);
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("recipeFavorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem(
        "recipeFavorites",
        JSON.stringify(favorites)
    );
}

function updateFavoriteButton() {
    const favorites = getFavorites();

    if (!currentRecipe) return;

    const isFavorite = favorites.some(
        recipe => recipe.id === currentRecipe.idMeal
    );

    if (isFavorite) {
        favoriteBtn.textContent = "❤️ В обраному";
    } else {
        favoriteBtn.textContent = "🤍 Додати в обране";
    }
}

function displayRecipes(recipes) {

    recipesContainer.innerHTML = "";

    recipes.forEach(recipe => {

        const card = document.createElement("div");

        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">

            <div class="recipe-info">

                <h3>${recipe.strMeal}</h3>

                <p>${recipe.strCategory || "Страва"}</p>

                <button>
                    Переглянути рецепт
                </button>

            </div>
        `;

        card.addEventListener("click", () => {
            openRecipe(recipe.idMeal);
    });
    recipesContainer.appendChild(card);
});
}


async function openRecipe(id) {

    try {

        const response = await fetch(
            `${API_URL}lookup.php?i=${id}`
        );

        const data = await response.json();

        const recipe = data.meals[0];

        currentRecipe = recipe;
        updateFavoriteButton();

        modalImage.src = recipe.strMealThumb;
        modalTitle.textContent = recipe.strMeal;

        modalInfo.textContent =
            `${recipe.strCategory || "Страва"} • ${recipe.strArea || "Світова кухня"}`;

        instructions.textContent = recipe.strInstructions;

        ingredientsList.innerHTML = "";

        for (let i = 1; i <= 20; i++) {

            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {

                const li = document.createElement("li");

                li.textContent =
                    `${ingredient} — ${measure || ""}`;

                ingredientsList.appendChild(li);
            }
        }

        modal.classList.remove("hidden");

    } catch (error) {

        console.error(error);
    }
}

favoriteBtn.addEventListener("click", () => {
    if (!currentRecipe) return;

    let favorites = getFavorites();

    const index = favorites.findIndex(
        recipe => recipe.id === currentRecipe.idMeal
    );

    if (index !== -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({
            id: currentRecipe.idMeal,
            name: currentRecipe.strMeal,
            thumb: currentRecipe.strMealThumb
        });
    }

    saveFavorites(favorites);
    updateFavoriteButton();
});

modalImage.addEventListener("click", () =>{
    bigImage.src = modalImage.src;
    imageModal.classList.remove("hidden");
});

closeImage.addEventListener("click", () => {
    imageModal.classList.add("hidden");
});

imageModal.addEventListener("click", (event) => {

    if (event.target === imageModal) {
        imageModal.classList.add("hidden");
    }
});
async function getRandomRecipe() {

    try {

        const response = await fetch(
            `${API_URL}random.php`
        );

        const data = await response.json();

        openRecipe(data.meals[0].idMeal);

    } catch (error) {

        console.error(error);
    }
}

async function showFavorites() {
    const favorites = getFavorites();

    resultsTitle.textContent = "❤️ Обране";

    if (favorites.length === 0) {
        recipesContainer.innerHTML =
            "<p>Тут поки нічого немає 🤍</p>";
        return;
    }

    recipesContainer.innerHTML = "";

    favorites.forEach(recipe => {
        const card = document.createElement("div");

        card.classList.add("recipe-card");

        card.innerHTML = `
            <img src="${recipe.thumb}" alt="${recipe.name}">

            <div class="recipe-info">
                <h3>${recipe.name}</h3>

                <button>
                    Переглянути рецепт
                </button>
            </div>
        `;

        card.addEventListener("click", () => {
            openRecipe(recipe.id);
        });

        recipesContainer.appendChild(card);
    });
}

favoritesBtn.addEventListener("click", () => {
    showFavorites();
});

function updateThemeButton() {
    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

    updateThemeButton();
});



async function getByCategory(category) {

    recipesContainer.innerHTML = "<p>Завантаження...</p>";

    try {

        const response = await fetch(
            `${API_URL}filter.php?c=${category}`
        );

        const data = await response.json();

        resultsTitle.textContent = category;

        displayRecipes(data.meals);

    } catch (error) {

        console.error(error);
    }
}

async function findRecipesByIngredients(ingredients) {
    recipesContainer.innerHTML = "<p>🔍 Шукаємо рецепти...</p>";

    const recipeMap = {};

    try {
        for (const ingredient of ingredients) {

            const response = await fetch(
                `${API_URL}filter.php?i=${encodeURIComponent(ingredient)}`
            );

            const data = await response.json();

            if (!data.meals) continue;

            data.meals.forEach(recipe => {

                if (!recipeMap[recipe.idMeal]) {
                    recipeMap[recipe.idMeal] = {
                        ...recipe,
                        matches: 0
                    };
                }

                recipeMap[recipe.idMeal].matches++;
            });
        }

        const recipes = Object.values(recipeMap);

        recipes.sort((a, b) => b.matches - a.matches);

        if (recipes.length === 0) {
            recipesContainer.innerHTML =
                "<p>😢 Не знайшли рецептів з такими продуктами.</p>";
            return;
        }

        resultsTitle.textContent = "🤔 Що можна приготувати?";

        displayRecipes(recipes);

        cookModal.classList.add("hidden");

    } catch (error) {

        console.error(error);

        recipesContainer.innerHTML =
            "<p>❌ Помилка пошуку рецептів.</p>";
    }
}


searchBtn.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query === "") {
        return;
    }

    resultsTitle.textContent = `Результати для: ${query}`;

    searchRecipes(query);
});

findCookBtn.addEventListener("click", () => {

    const value = ingredientsInput.value.trim();

    if (value === "") {
        cookStatus.textContent =
            "Напиши хоча б один продукт.";
        return;
    }

    const ingredients = value
        .split(",")
        .map(item => item.trim().toLowerCase())
        .filter(item => item !== "");

    cookStatus.textContent = "";

    findRecipesByIngredients(ingredients);
});

ingredientsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        findCookBtn.click();
    }
});


searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }
});


randomBtn.addEventListener("click", () => {
    getRandomRecipe();
});


document.querySelectorAll("[data-category]").forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        getByCategory(category);
    });
});


closeModal.addEventListener("click", () => {

    modal.classList.add("hidden");
});


modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

whatCookBtn.addEventListener("click", () => {
    cookModal.classList.remove("hidden");
});

closeCookModal.addEventListener("click", () => {
    cookModal.classList.add("hidden");
});

cookModal.addEventListener("click", (event) => {
    if (event.target === cookModal) {
        cookModal.classList.add("hidden");
    }
});




searchRecipes("chicken");
