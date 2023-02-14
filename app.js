require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials")


// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/artist-search', (req, res) => {

  let {search} = req.query
  console.log("Search:"+ search)
    spotifyApi.searchArtists(search)
  .then(function(data) {
    console.log(`Search artists by ${search}`);
    let allArtists = data.body.artists.items;

    res.render('artist-search-results', { allArtists });


  }, function(err) {
    console.error("erro");
  })
  })

  app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    let id= req.params.artistId
    spotifyApi.getArtistAlbums(id).then(
      function(data) {
        console.log('Artist albums', data.body);
        let allAlbuns = data.body.items
        res.render('albuns', { allAlbuns });

      },
      function(err) {
        console.error(err);
      }
    );

  });



app.get('/tracks/:id', (req, res, next) => {
  // .getArtistAlbums() code goes here
  let id= req.params.id
   // Get tracks in an album
spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
.then(function(data) {
  console.log(data.body.items);
  let allSongs = data.body.items;
  res.render('tracks', { allSongs });

}, function(err) {
  console.log('Something went wrong!', err);
});


});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
