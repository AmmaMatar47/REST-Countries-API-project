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
const loaderHTML = `<div class="loader"></div>`;
const mainPage = document.querySelector('.main-page');
const sectionCountry = document.querySelector('.details-section');
const previewCountrySection = document.querySelector('.preview-section');
const errorContainer = document.querySelector(`.error`);
const errorText = document.querySelector(`.error-text`);
////////////////////////////////////////////////////////////////////
// FETCH COUNTRIES FUNCTION , FILTERING AND SEARCH
searchBtn.addEventListener('click', e => e.preventDefault());
const timeout = delay =>
  new Promise((resolve, reject) =>
    setTimeout(() => resolve(new Error('Request timeout try another time :)')), delay * 1000)
  );

const countryData = async function (type = 'all', typeInput = '', moreInfoPage = false) {
  try {
    previewCountrySection.innerHTML = '';
    main.innerHTML = '';
    if (type === '/alpha') previewCountrySection.insertAdjacentHTML('afterbegin', loaderHTML);
    else if (!main.querySelector('.loader')) main.insertAdjacentHTML('afterbegin', loaderHTML);

    errorContainer.classList.add('hidden-opacity');
    const response = await Promise.race([
      fetch(`https://restcountries.com/v3.1/${type}${typeInput}`),
      timeout(10),
    ]);
    if (response) {
      response;
    }
    const countriesData = await response.json();
    if (moreInfoPage) displayCountryInfo(countriesData[0]);
    else {
      main.innerHTML = '';
      countriesData?.map(country => displayCountry(country));
    }
  } catch (error) {
    console.error(error);
    main.querySelector('.loader')?.remove();
    errorContainer.classList.remove('hidden-opacity');
    errorText.innerHTML = search.value;
  }
};

////////////////////////////////////////////////////////////
// DISPLAY COUNTRIES
const displayCountry = function (country) {
  if (country.name.common === `Israel`) return;
  const formatPopulationToLocale = country.population.toLocaleString();
  const countryCardHTML = `<a href="#${('name ' + country.name.common).replaceAll(
    ' ',
    '_'
  )}" class="country-card" data-card="${country.name.common}">
  <img src="${country.flags.png}" class="country-image" alt="${country.name.common} flag.";
"/>
  <div class="country-info-container">
  <p class="country-name">${country.name.common}</p>
  <p class="country-info population">Population: <span class="cards-info">${formatPopulationToLocale}</span></p>
  <p class="country-info region">Region: <span class="cards-info">${country.region}</span></p>
  <p class="country-info capital">Capital: <span class="cards-info">${country.capital}</span></p>
  </div>
  </a>`;
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
  const allCurrencies = country.currencies
    ? Object.values(country.currencies).map(currency => Object.values(currency)[0])
    : 'No Currencies';
  const nativeName = Object.values(country.name.nativeName)[0].common;

  mainPage.classList.add('hidden');

  let bordersCountries = '';
  const previewCountryHTML = `<div class="padding-horizontally">
      <button class="back-btn " name="Back">
        <span class="left-arrow--icon">&larr;</span>
        <span class="back-paragraph">Back</span>
      </button>
    </div>

    <div class="details-section-container">
      <section class="details-section padding-horizontally">
        <img src="${country.flags.png}" class="big-country-image" alt="${
    country.flags.alt || country.name.common + ' flag.'
  }" />
        <article class="info-section">
          <div>
            <h2 data-info-name="name">${country.name.common}</h2>
          </div>
          <div class="details-text-box">
            <div>
              <div class="info-headers">
                <p class="sub-headers">Native Name:</p>
                <span data-info-name-native="native-name">${nativeName}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Population:</p>
                <span data-info-population="population">${country.population.toLocaleString()}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Region:</p>
                <span data-info-region="region">${country.region}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Sub Region:</p>
                <span data-info-sub-region="sub-region">${country.subregion}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Capital:</p>
                <span data-info-capital="capital">${country.capital}</span>
              </div>
            </div>

            <div>
              <div class="info-headers">
                <p class="sub-headers">Top Level Domain:</p>
                <span data-info-tld="top-level-domain">${country.tld[0]}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Currencies:</p>
                <span data-info-cur="currencies">${allCurrencies}</span>
              </div>
              <div class="info-headers">
                <p class="sub-headers">Languages:</p>
                <span data-info-lng="languages">${allLanguages}</span>
              </div>
            </div>
          </div>

          <div class="border-element-container">
            <h3>Border Countries:</h3>
            <div class="neighbour-countries-container">${
              country.borders === undefined
                ? `No neighbour countries.`
                : country.borders
                    .map((border, index, arr) => {
                      if (border === 'ISR') return;
                      const bordersElement = `<a href="#${border}" class="borders-btn" data-border="${country.borders[index]}">${border}</a>`;
                      bordersCountries += bordersElement;
                      if (index + 1 === arr.length) return bordersCountries;
                    })
                    .at(-1)
            }</div>
          </div>
        </article>
      </section>
    </div>`;

  previewCountrySection.innerHTML = '';
  previewCountrySection.insertAdjacentHTML('afterbegin', previewCountryHTML);

  const backBtn = document.querySelector(`.back-btn`);
  backBtn.addEventListener('click', () => history.back());
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
// CHANGE ON URL

window.addEventListener('popstate', () => {
  if (location?.hash) {
    location.hash.startsWith('#name')
      ? countryData('name/', location.hash.replace('#', '').replaceAll('_', ' ').slice(5, -1), true)
      : countryData('alpha/', location.hash.replace('#', ''), true);
  } else {
    // DISPLAY All COUNTRIES
    mainPage?.children && countryData();
    previewCountrySection.innerHTML = '';
    mainPage.classList.remove('hidden');
  }
});

// WHEN PAGE LOADS
if (location.hash.startsWith('#name'))
  countryData('name/', location.hash.replace('#', '').replaceAll('_', ' ').slice(5, -1), true);
else if (!location.hash) countryData();
else countryData('alpha/', location.hash.replace('#', ''), true);
