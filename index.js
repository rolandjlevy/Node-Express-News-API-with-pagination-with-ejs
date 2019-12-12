const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 8080;

const env = require('dotenv').config();
const NEWS_API_KEY = process.env.NEWS_API_KEY;

let totalPages;
const maxPages = 50;
const pageSize = 10;
const baseUrl = 'https://newsapi.org/v2/top-headlines';

const path = require('path');
const root = path.join(__dirname, 'public');
app.use(express.static(root));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware for all requests
app.use((req, res, next) => {
   res.locals.query = req.query;
   res.locals.params = req.params;
   console.log('Log:', Date.now());
   next();
});

const goHome = (req, res) => {
 res.render('layout.ejs', { title: 'Home', content:'index.ejs' });
}

const goToNews = async (req, res) => {
  const { page = 1, country = 'gb' } = req.query;
  const url = `${baseUrl}?country=${country}&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`;
  const response = await fetch(url) 
  const result = await response.json();
  totalPages = result.totalResults < maxPages ? result.totalResults : maxPages;
  res.locals.news = {
    articles: result.articles,
    totalPages,
    pageSize
  }
  res.render('layout.ejs', { title: 'News', content:'news.ejs' });
}

const goHomePublic = (req, res) => {
  res.sendFile('home.html', {root}, (err) => {
    if (err) res.send(err);
  });
}

// all routes
app.get('/', goHome);
app.get('/news', goToNews);
app.get('/home-public', goHome);

app.listen(port, () => {
  console.log('Listening on port', port);
});