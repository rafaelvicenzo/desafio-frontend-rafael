'use strict'

document.addEventListener('DOMContentLoaded', function () {

    const apiURL = 'https://homologacao3.azapfy.com.br/api/ps/metahumans';

    async function fetchMetahumanData() {
        try {
            const response = await fetch(apiURL);
            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('Nenhum dado encontrado na API');
            }

            const metahuman = data[0];
        
            const imgElement = document.querySelector('.image');
            console.log(imgElement)
            const nameElement = document.querySelector('.name');
            const intelligenceElement = document.querySelector('.intelligence');
            const strengthElement = document.querySelector('.strength');
            const speedElement = document.querySelector('.speed');
            const durabilityElement = document.querySelector('.durability');
            const powerElement = document.querySelector('.power');
            const combatElement = document.querySelector('.combat');

            if (!imgElement || !intelligenceElement || !strengthElement || !speedElement || !durabilityElement || !powerElement || !combatElement) {
                throw new Error('Um ou mais elementos do DOM não foram encontrados');
            }

            imgElement.src = metahuman.images.sm; 
            nameElement.textContent = `${metahuman.name}`;
            intelligenceElement.textContent = `Int: ${metahuman.powerstats.intelligence}`;
            strengthElement.textContent = `Str: ${metahuman.powerstats.strength}`;
            speedElement.textContent = `Spd: ${metahuman.powerstats.speed}`;
            durabilityElement.textContent = `Dur: ${metahuman.powerstats.durability}`;
            powerElement.textContent = `Pow: ${metahuman.powerstats.power}`;
            combatElement.textContent = `Comb: ${metahuman.powerstats.combat}`;
        } catch (error) {
            console.error('Erro ao buscar dados da API:', error);
        }
    }

    fetchMetahumanData();
});