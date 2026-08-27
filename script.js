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

                <button onclick="openRecipe('${recipe.idMeal}')">
                    Переглянути рецепт
                </button>

            </div>
        `;

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


searchBtn.addEventListener("click", () => {

    const query = searchInput.value.trim();

    if (query === "") {
        return;
    }

    resultsTitle.textContent = `Результати для: ${query}`;

    searchRecipes(query);
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


searchRecipes("chicken");