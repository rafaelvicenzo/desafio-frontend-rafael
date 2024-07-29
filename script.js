'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://homologacao3.azapfy.com.br/api/ps/metahumans';
    const itemsPerPage = 12;
    let currentPage = 1;
    let totalPages = 1;
    let data = [];
    let filteredData = [];
    let selectedHeroes = [];

    async function fetchMetahumanData() {
        try {
            const response = await fetch(apiURL);
            data = await response.json();
            filteredData = data;

            if (!data || data.length === 0) {
                throw new Error('No data found in API');
            }

            totalPages = Math.ceil(filteredData.length / itemsPerPage);
            displayPage(currentPage);
            createPagination();
        } catch (error) {
            console.error('Error fetching data from API:', error);
            alert("The API is down. Try again later.");
        }
    }

    function displayPage(page) {
        const main = document.querySelector('main');
        main.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredData.slice(start, end);

        pageItems.forEach(metahuman => {
            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <img class="image" src="${metahuman.images.sm}" alt="Metahuman Image">
                <h2 class="name">${metahuman.name}</h2>
                <div class="middle">
                    <div class="colLeft">
                        <p class="intelligence">Int: ${metahuman.powerstats.intelligence}</p>
                        <p class="strength">Str: ${metahuman.powerstats.strength}</p>
                        <p class="speed">Spd: ${metahuman.powerstats.speed}</p>
                    </div>
                    <div class="colRight">
                        <p class="durability">Dur: ${metahuman.powerstats.durability}</p>
                        <p class="power">Pow: ${metahuman.powerstats.power}</p>
                        <p class="combat">Comb: ${metahuman.powerstats.combat}</p>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => selectHero(card, metahuman.name, metahuman.powerstats, metahuman.images.sm));

            main.appendChild(card);
        });
    }

    function selectHero(card, heroName, heroStats, heroImage) {
        const hero1 = document.querySelector('.hero1');
        const hero2 = document.querySelector('.hero2');

        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });

        card.classList.add('selected');

        selectedHeroes.push({ name: heroName, stats: heroStats, image: heroImage });

        if (hero1.textContent === 'Select One Hero') {
            hero1.textContent = heroName;
        } else if (hero2.textContent === 'Select One Hero') {
            hero2.textContent = heroName;
        }

        if (selectedHeroes.length === 2) {
            displayWinner();
        }
    }

    function displayWinner() {
        const hero1 = selectedHeroes[0];
        const hero2 = selectedHeroes[1];

        const hero1Stats = hero1.stats;
        const hero2Stats = hero2.stats;

        const hero1Total = hero1Stats.intelligence + hero1Stats.strength + hero1Stats.speed +
            hero1Stats.durability + hero1Stats.power + hero1Stats.combat;
        const hero2Total = hero2Stats.intelligence + hero2Stats.strength + hero2Stats.speed +
            hero2Stats.durability + hero2Stats.power + hero2Stats.combat;

        let winnerMessage = '';

        if (hero1Total > hero2Total) {
            winnerMessage = `${hero1.name} 🏆 WINNER! 🏆`;
        } else if (hero2Total > hero1Total) {
            winnerMessage = `${hero2.name} 🏆 WINNER! 🏆`;
        } else {
            winnerMessage = `It's a draw!`;
        }

        document.getElementById('winner').textContent = winnerMessage;
        document.getElementById('result').textContent = `${hero1.name}: ${hero1Total} vs ${hero2.name}: ${hero2Total}`;

        document.getElementById('hero1Image').src = hero1.image;
        document.getElementById('hero1Name').textContent = hero1.name;

        document.getElementById('hero2Image').src = hero2.image;
        document.getElementById('hero2Name').textContent = hero2.name;

        const hero1StatsContainer = document.getElementById('hero1Stats');
        hero1StatsContainer.innerHTML = '';
        const hero2StatsContainer = document.getElementById('hero2Stats');
        hero2StatsContainer.innerHTML = '';

        const stats = [
            { name: '', value1: hero1Stats.intelligence, value2: hero2Stats.intelligence },
            { name: '', value1: hero1Stats.strength, value2: hero2Stats.strength },
            { name: '', value1: hero1Stats.speed, value2: hero2Stats.speed },
            { name: '', value1: hero1Stats.durability, value2: hero2Stats.durability },
            { name: '', value1: hero1Stats.power, value2: hero2Stats.power },
            { name: '', value1: hero1Stats.combat, value2: hero2Stats.combat }
        ];

        stats.forEach(stat => {
            const statElement1 = document.createElement('p');
            statElement1.textContent = `${stat.value1} ${stat.name}`;
            hero1StatsContainer.appendChild(statElement1);

            const statElement2 = document.createElement('p');
            statElement2.textContent = `${stat.value2} ${stat.name}`;
            hero2StatsContainer.appendChild(statElement2);
        });

        document.getElementById('winnerModal').style.display = 'block';

        selectedHeroes = [];
    }

    document.querySelector('.close-button').addEventListener('click', function () {
        document.getElementById('winnerModal').style.display = 'none';
    });

    function createPagination() {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Before';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage(currentPage);
                createPagination();
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayPage(currentPage);
                createPagination();
            }
        });

        pagination.appendChild(prevButton);
        pagination.appendChild(nextButton);
    }

    function filterHeroes() {
        const searchInput = document.querySelector('.search').value.toLowerCase();
        filteredData = data.filter(metahuman => metahuman.name.toLowerCase().includes(searchInput));
        totalPages = Math.ceil(filteredData.length / itemsPerPage);
        currentPage = 1; 
        displayPage(currentPage);
        createPagination();
    }

    document.querySelector('.search').addEventListener('input', filterHeroes);

    fetchMetahumanData();
});
