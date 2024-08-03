'use strict';

const root = document.documentElement;
const main = document.querySelector('main');
const darkModeBtn = document.querySelector('.dark-mode-button');
const moonIcon = document.querySelector(`.dark-mode-icon`);
const regionFilterBtn = document.querySelector(`.region-selector`);
const regionOptions = document.querySelector(`.region-options`);
const regionFilterIcon = document.querySelector(`.icon-arrow`);
const search = document.querySelector(`.search-input`);
const searchBtn = document.querySelector(`.search-btn`);
const regionsContainer = document.querySelector('.region-options-container');
const filterParagraph = document.querySelector('.filter');
const mainPage = document.querySelector('.main-page');
const sectionCountry = document.querySelector('.details-section');
const backBtn = document.querySelector(`.back-btn`);
const neighbourContainerEl = document.querySelector('.neighbour-countries-container');
const errorContainer = document.querySelector(`.error`);
const errorText = document.querySelector(`.error-text`);

////////////////////////////////////////////////////////////////////
// FETCH COUNTRIES FUNCTION , FILTERING AND SEARCH
searchBtn.addEventListener('click', e => e.preventDefault());

const countryData = async function (type = 'all', typeInput = '', moreInfoPage = false) {
  try {
    errorContainer.classList.add('hidden-opacity');
    const countriesFetch = await fetch(`https://restcountries.com/v3.1/${type}${typeInput}`);
    const countriesData = await countriesFetch.json();
    if (moreInfoPage) displayCountryInfo(countriesData[0]);
    else {
      main.innerHTML = '';
      countriesData?.map(country => displayCountry(country));
    }
  } catch (error) {
    errorContainer.classList.remove('hidden-opacity');
    errorText.innerHTML = search.value;
  }
};
// DISPLAY All COUNTRIES
countryData();

main.addEventListener('click', e => {
  if (e.target.closest('.country-card')) {
    const countryName = e.target.closest('.country-card').dataset.card;
    countryData('name/', `${countryName}?fullText=true`, true);
  }
});

////////////////////////////////////////////////////////////
// DISPLAY COUNTRIES
const displayCountry = function (country) {
  if (country.name.common === `Israel`) return;
  const formatPopulationToLocale = country.population.toLocaleString();
  const countryCardHTML = `<div class="country-card" data-card="${country.name.common}">
  <img src="${country.flags.png}" class="country-image" alt="${country.name.common} flag.";
"/>
  <div class="country-info-container">
  <p class="country-name">${country.name.common}</p>
  <p class="country-info population">Population: <span class="cards-info">${formatPopulationToLocale}</span></p>
  <p class="country-info region">Region: <span class="cards-info">${country.region}</span></p>
  <p class="country-info capital">Capital: <span class="cards-info">${country.capital}</span></p>
  </div>
  </div>`;
  main.insertAdjacentHTML(`beforeend`, countryCardHTML);
};

///////////////////////////////////////////////////////
// FILTER BY REGION
regionsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains(`region-options-btn`)) {
    const regionElement = e.target;
    const region = regionElement.dataset.region;
    region.toLowerCase() === 'all' ? countryData() : countryData('region/', region);
    filterParagraph.textContent = regionElement.textContent;
  }
});

/////////////////////////////////////////////////////////////
//  SEARCH BAR
search.addEventListener('input', e => {
  e.preventDefault();
  search.value ? countryData('name', `/${search.value}`) : countryData('all');
});

/////////////////////////////////////////////////////////////////
// Country details Information
const displayCountryInfo = country => {
  const allLanguages = Object.values(country.languages);
  const allCurrencies = Object.values(country.currencies).map(
    currency => Object.values(currency)[0]
  );
  const nativeName = Object.values(country.name.nativeName)[0].common;

  mainPage.classList.add('hidden');
  sectionCountry.classList.remove('hidden');
  backBtn.classList.remove('hidden');
  backBtn.addEventListener('click', () => {
    backBtn.classList.add('hidden');
    sectionCountry.classList.add('hidden');
    mainPage.classList.remove('hidden');
  });

  const flagImageEl = document.querySelector('.big-country-image');

  flagImageEl.setAttribute(`src`, country.flags.png);
  flagImageEl.alt = `${country.name.common} flag.`;
  document.querySelector('h2[data-info-name]').innerHTML = country.name.common;
  document.querySelector('span[data-info-name-native]').innerHTML = nativeName;
  document.querySelector('span[data-info-population]').innerHTML =
    country.population.toLocaleString();
  document.querySelector('span[data-info-region]').innerHTML = country.region;
  document.querySelector('span[data-info-sub-region]').innerHTML = country.subregion;
  document.querySelector('span[data-info-capital]').innerHTML = country.capital;
  document.querySelector('span[data-info-tld]').innerHTML = country.tld[0];
  document.querySelector('span[data-info-cur]').innerHTML = allCurrencies;
  document.querySelector('span[data-info-lng]').innerHTML = allLanguages;
  neighbourContainerEl.innerHTML = '';
  if (country.borders === undefined) neighbourContainerEl.innerHTML = `No neighbour countries.`;
  country.borders?.map((border, index) => {
    const bordersElement = `<button class="borders-btn" data-border="${country.borders[index]}">${border}</button>`;
    neighbourContainerEl.insertAdjacentHTML('afterbegin', bordersElement);
  });
};

///////////////////////////////////////////////////////////////
//  DARK MODE
darkModeBtn.addEventListener('click', function () {
  const themeMode = root.getAttribute('theme');
  themeMode === 'light' ? root.setAttribute('theme', 'dark') : root.setAttribute('theme', 'light');

  moonIcon.setAttribute(`fill`, `hsl(0, 0%, 100%)`);
});

///////////////////////////////////////////////////////
// SHOW REGION OPTIONS
regionFilterBtn.addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('region-options-container')) return;
  regionFilterIcon.classList.toggle('rotate');
  regionsContainer.classList.toggle('drop-down-effect');
});

////////////////////////////////////////////////////////
// GO TO NEGHIBOUR COUNTRY
neighbourContainerEl.addEventListener('click', e => {
  if (e.target.classList.contains('borders-btn')) {
    const borderCode = e.target.dataset.border;
    countryData('alpha/', borderCode, true);
  }
});
