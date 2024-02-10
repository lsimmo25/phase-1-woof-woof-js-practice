document.addEventListener("DOMContentLoaded", () => {

    const dogBar = document.querySelector("#dog-bar");
    const filterDiv = document.querySelector("#filter-div");
    const dogSummary = document.querySelector("#dog-summary-container");
    const dogInfo = document.querySelector("#dog-info");
    let dogs = []; // Global array to store the list of dogs

    // Fetch requests
    function fetchDogs() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(data => {
                dogs = data; // Store the fetched dogs in the global array
                data.forEach(dog => displayDogBar(dog));
            })
            .catch(error => console.log(error));
    }

    function fetchDogInfo(dogId) {
        fetch(`http://localhost:3000/pups/${dogId}`)
            .then(response => response.json())
            .then(data => {
                displayDogInfo(data);
            })
            .catch(error => console.log(error));
    }

    function updateGoodDogStatus(dogId, isGoodDog) {
        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                isGoodDog: isGoodDog
            })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    function displayDogBar(dog) {
        const dogName = document.createElement("span");
        dogName.textContent = dog.name;
        dogName.dataset.dogId = dog.id;
        dogName.classList.add("dog-bar-span");

        dogName.addEventListener("click", () => fetchDogInfo(dog.id));
        dogBar.appendChild(dogName);
    }

    function displayDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}"/>
            <h2>${dog.name}</h2>
            <button id="good-dog">Good Dog!</button>
        `;

        const goodDoggoButton = document.querySelector("#good-dog");
        goodDoggoButton.addEventListener("click", () => toggleDogStatus(dog));
    }

    function toggleDogStatus(dog) {
        dog.isGoodDog = !dog.isGoodDog;
        const goodDoggoButton = document.querySelector("#good-dog");
        goodDoggoButton.textContent = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";

        updateGoodDogStatus(dog.id, dog.isGoodDog);
    }

    function toggleDogFilter() {
        const goodDoggoFilter = document.querySelector("#good-dog-filter");
        const dogBarSpans = document.querySelectorAll("#dog-bar span");

        if (goodDoggoFilter.textContent === "Filter good dogs: OFF") {
            goodDoggoFilter.textContent = "Filter good dogs: ON";
            dogBarSpans.forEach(span => {
                const dogId = span.dataset.dogId;
                const dog = dogs.find(dog => dog.id === parseInt(dogId)); // Parse dogId to integer for comparison
                if (dog && !dog.isGoodDog) {
                    span.classList.add("hidden");
                }
            });
        } else {
            goodDoggoFilter.textContent = "Filter good dogs: OFF";
            dogBarSpans.forEach(span => {
                span.classList.remove("hidden");
            });
        }
    }

    function init() {
        fetchDogs();

        const goodDoggoFilter = document.querySelector("#good-dog-filter");
        goodDoggoFilter.addEventListener("click", () => toggleDogFilter());
    }

    init();

});
