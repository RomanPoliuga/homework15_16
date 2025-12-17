import './styles.css';


import debounce from 'lodash.debounce';


import { error, info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import fetchCountries from './fetchCountries';


const refs = {
  input: document.querySelector('#search-box'),
  result: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onSearch, 500)
);


function onSearch(e) {
  const query = e.target.value.trim();

  if (!query) {
    refs.result.innerHTML = '';
    return;
  }

  fetchCountries(query)
    .then(renderCountries)
    .catch(() => {
      refs.result.innerHTML = '';
      error({
        text: 'Країну не знайдено',
      });
    });
}

function renderCountries(countries) {
  if (countries.length > 10) {
    refs.result.innerHTML = '';
    info({
      text: 'Зробіть запит більш специфічним',
    });
    return;
  }

  if (countries.length === 1) {
    renderCountry(countries[0]);
  } else {
    renderList(countries);
  }
}

function renderList(countries) {
  refs.result.innerHTML = `
    <ul>
      ${countries.map(c => `<li>${c.name}</li>`).join('')}
    </ul>
  `;
}

function renderCountry(country) {
  refs.result.innerHTML = `
    <h2>${country.name}</h2>
    <p><strong>Столиця:</strong> ${country.capital}</p>
    <p><strong>Населення:</strong> ${country.population}</p>
    <p><strong>Мови:</strong> ${country.languages
      .map(lang => lang.name)
      .join(', ')}</p>
    <img src="${country.flag}" alt="Flag of ${country.name}" width="200">
  `;
}
