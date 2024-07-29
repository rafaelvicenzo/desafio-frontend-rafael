'use strict'

document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'https://homologacao3.azapfy.com.br/api/ps/metahumans';
    const itemsPerPage = 12;
    let currentPage = 1;
    let totalPages = 1;
    let data = [];

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

            main.appendChild(card);
        });
    }

    function createPagination() {
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage(currentPage);
                createPagination();
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
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