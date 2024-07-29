'use strict'

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://homologacao3.azapfy.com.br/api/ps/metahumans';
    const itemsPerPage = 12;
    let currentPage = 1;
    let totalPages = 1;
    let data = [];
    let selectedHeroes = [];

    async function fetchMetahumanData() {
        try {
            const response = await fetch(apiURL);
            data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('Nenhum dado encontrado na API');
            }

            totalPages = Math.ceil(data.length / itemsPerPage);
            displayPage(currentPage);
            createPagination();
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
            alert("A API está fora do ar. Tente novamente mais tarde.");
        }
    }

    function displayPage(page) {
        const main = document.querySelector('main');
        main.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = data.slice(start, end);

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

            card.addEventListener('click', () => selectHero(metahuman.name, metahuman.powerstats, metahuman.images.sm));

            main.appendChild(card);
        });
    }

    function selectHero(heroName, heroStats, heroImage) {
        const hero1 = document.querySelector('.hero1');
        const hero2 = document.querySelector('.hero2');

        selectedHeroes.push({ name: heroName, stats: heroStats, image: heroImage });

        if (hero1.textContent === 'Select One Hero') {
            hero1.textContent = heroName;
        } 
        else if (hero2.textContent === 'Select One Hero') {
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
    
        document.getElementById('hero1Image').src = hero1.image; // Corrigido aqui
        document.getElementById('hero1Name').textContent = hero1.name;
        document.getElementById('hero1Stats').textContent = `Int: ${hero1Stats.intelligence}, Str: ${hero1Stats.strength}, Spd: ${hero1Stats.speed}, Dur: ${hero1Stats.durability}, Pow: ${hero1Stats.power}, Comb: ${hero1Stats.combat}`;
    
        document.getElementById('hero2Image').src = hero2.image; // Corrigido aqui
        document.getElementById('hero2Name').textContent = hero2.name;
        document.getElementById('hero2Stats').textContent = `Int: ${hero2Stats.intelligence}, Str: ${hero2Stats.strength}, Spd: ${hero2Stats.speed}, Dur: ${hero2Stats.durability}, Pow: ${hero2Stats.power}, Comb: ${hero2Stats.combat}`;
    
        document.getElementById('winnerModal').style.display = 'block';
        
        selectedHeroes = [];
    }

    document.querySelector('.close-button').addEventListener('click', function() {
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

    fetchMetahumanData();
});
