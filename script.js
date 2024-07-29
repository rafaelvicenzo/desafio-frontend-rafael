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

            // Adiciona um evento de clique no card
            card.addEventListener('click', () => selectHero(metahuman.name, metahuman.powerstats));

            main.appendChild(card);
        });
    }

    function selectHero(heroName, heroStats) {
        const hero1 = document.querySelector('.hero1');
        const hero2 = document.querySelector('.hero2');

        // Adiciona o herói selecionado à lista
        selectedHeroes.push({ name: heroName, stats: heroStats });

        // Se hero1 estiver como 'Select One Hero', altera para o nome do herói
        if (hero1.textContent === 'Select One Hero') {
            hero1.textContent = heroName;
        } 
        // Se hero2 estiver como 'Select One Hero', altera para o nome do herói
        else if (hero2.textContent === 'Select One Hero') {
            hero2.textContent = heroName;
        }

        // Se ambos os heróis foram selecionados, calcula o vencedor
        if (selectedHeroes.length === 2) {
            displayWinner();
        }
    }

    function displayWinner() {
        const hero1Stats = selectedHeroes[0].stats;
        const hero2Stats = selectedHeroes[1].stats;

        const hero1Total = hero1Stats.intelligence + hero1Stats.strength + hero1Stats.speed +
                           hero1Stats.durability + hero1Stats.power + hero1Stats.combat;
        const hero2Total = hero2Stats.intelligence + hero2Stats.strength + hero2Stats.speed +
                           hero2Stats.durability + hero2Stats.power + hero2Stats.combat;

        let winnerMessage = '';
        
        if (hero1Total > hero2Total) {
            winnerMessage = `${selectedHeroes[0].name} 🏆 Is the winner! 🏆`;
        } else if (hero2Total > hero1Total) {
            winnerMessage = `${selectedHeroes[1].name} 🏆 Is the winner! 🏆`;
        } else {
            winnerMessage = `It's a draw!`;
        }

        // Exibe o modal
        document.getElementById('winner').textContent = winnerMessage;
        document.getElementById('result').textContent = `${selectedHeroes[0].name}: ${hero1Total} vs ${selectedHeroes[1].name}: ${hero2Total}`;
        document.getElementById('winnerModal').style.display = 'block';
        
        // Reseta a seleção de heróis
        selectedHeroes = [];
    }

    // Fecha o modal quando clicar no botão de fechar
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
