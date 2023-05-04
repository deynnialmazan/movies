'use strict';

import { select, print } from './utils.js';

const citiesUrl = './assets/script/cities.json';
const moviesUrl = './assets/script/movies.json';

const list = select('section');

function listMovies (array) {
  list.innerHTML = '';
  let movies = '';

  if (array.length > 0) {
      array.forEach(movie => {
        movies += `
        <div class="info-movie">
          <img src="${movie.img}" class="poster-movie">
          <p class="title-movie">&nbsp ${movie.title}</p>
        </div>`
      });
  } else {
      movies = `<li>Movie not found</li>`;
  }
  list.innerHTML = `${movies}`;
}

const options = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json; charset-UTF-8' },
  mode: 'cors'
}

async function getMovies() {
  try {
      const response = await fetch(moviesUrl, options); 

      if (!response.ok) {
          throw new Error(`${response.statusText} (${response.status})}`)
      }

      const data = await response.json();
      //print(data.results);
      listMovies(data.results);
  } catch(error) {
      print(error.message);
  }
}

getMovies();


async function getCities() {
  try {
      const response = await fetch(citiesUrl, options); 

      if (!response.ok) {
          throw new Error(`${response.statusText} (${response.status})}`)
      }

      const data = await response.json(); 
  } catch(error) {
      print(error.message);
  }
}

getCities();


const titleInput = select('.title-input');
const cityInput = select('.city-input');
const titleList = select('.match-movies-list');
const citiesList = select('.match-cities-list');
const textCityList = document.querySelectorAll('h4');

textCityList.forEach((option) => {
  option.addEventListener('click', () => {
    titleInput.value = `${movie.title}`;
  });
});

//Search movies
const searchMovies = async searchText => {
  const response = await fetch(moviesUrl, options); 
  const data = await response.json(); 
  const titles = data.results;

 //Get matches to current text input
 let moviesMatches = titles.filter(movie => {
  const regex = new RegExp(`^${searchText}`, 'gi');
  return movie.title.match(regex);
 });

 if(searchText.length === 0) {
  moviesMatches = [];
  titleList.innerHTML = '';
  titleList.style.visibility = 'hidden';
 }
 outputHtml(moviesMatches);

};

 //Show movies results in HTML
 const outputHtml = matches => {
  if(matches.length > 0) {
    titleList.style.visibility = 'visible';
    const html = matches.map(match => `
        <h4>${match.title} (${match.year})</h4>
    `).join('');

    titleList.innerHTML = html;
  } else if(titleInput.value === '') {
    matches = [];
    titleList.innerHTML = '';
    titleList.style.visibility = 'hidden';
  } else if(matches.length === 0) {
    titleList.style.visibility = 'visible';
    titleList.innerHTML = `<p>Movie not found</p>`;  
 }
}

titleInput.addEventListener('input', () => searchMovies(titleInput.value));

// Search city
const searchCity = async searchCity => {
  const response = await fetch(citiesUrl, options); 
  const results = await response.json(); 
  const cities = results.cities;

 //Get matches to current text input
 let citiesMatches = cities.filter(city => {
  const regex = new RegExp(`^${searchCity}`, 'gi');
  return city.name.match(regex);
 });

 if(searchCity.length === 0) {
  citiesMatches = [];
  citiesList.innerHTML = '';
  citiesList.style.visibility = 'hidden';
 }
 citiesHtml(citiesMatches);
};

 //Show city results in HTML
 const citiesHtml = cityMatches => {
  if(cityMatches.length > 0) {
    citiesList.style.visibility = 'visible';
    const html2 = cityMatches.map(match => `
        <h4>${match.name}</h4>
    `).join('');

    citiesList.innerHTML = html2;
  } else if(cityInput.value === '') {
    cityMatches = [];
    citiesList.innerHTML = '';
    citiesList.style.visibility = 'hidden';
  } else if(cityMatches.length === 0) {
    citiesList.style.visibility = 'visible';
    citiesList.innerHTML = `<p>City not found</p>`;  
 }
}

cityInput.addEventListener('input', () => searchCity(cityInput.value));


