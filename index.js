const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
   hosts: [ 'http://localhost:9200']
});
const express = require( 'express' );
const app     = express();
const bodyParser = require('body-parser')
const path    = require( 'path' );
client.ping({
     requestTimeout: 300,
 }, function(error) {
     if (error) {
         console.error('elasticsearch cluster is down!');
     } else {
         console.log('Everything is ok');
     }
 });


app.use(bodyParser.json())
app.set( 'port', process.env.PORT || 3001 );
app.use( express.static( path.join( __dirname, 'public' )));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendFile('index.html', {
     root: path.join( __dirname, 'views' )
   });
})


app.get('/search', function (req, res){
  var body = {
    size: 200,
    from: 0,
    query: {
      bool: {
        should:
        [
          {match: {tags: req.query['q']}},
          {match: {startDate: req.query['q']}},
          {match: {endDate: req.query['q']}},
          {match: {DayOfWeek: req.query['q']}},
          {match: {name: req.query['q']}},
          {match: {address: req.query['q']}},
          {match: {occupancy: req.query['q']}},
          {match: {openingHours: req.query['q']}},
          {match: {description: req.query['q']}},
          {match: {keywords: req.query['q']}},
          {match: {kind: req.query['q']}},
          {match: {sp_notes: req.query['q']}},
          {match: {ApartmentType: req.query['q']}},
          {match: {ApartmentCategory: req.query['q']}}
        ]
      }
    }
  }
  // var res = req.query['q'].split(" ");
  // console.log(res);
  // var colleges = ["mit","stanford","usc","housing","calander","dining"];
  // var indexes = res.filter(value => colleges.includes(value));
  // console.log(indexes);
  // if(res.length > 1 && indexes.length >= 1){
  //   body = {
  //     size: 200,
  //     from: 0,
  //     query: {
  //       bool: {
  //         should:
  //         [
  //           {match: {tag: req.query['q']}},
  //           {match: {date: req.query['q']}},
  //           {match: {day: req.query['q']}},
  //           {match: {name: req.query['q']}},
  //           {match: {address: req.query['q']}},
  //           {match: {occupancy: req.query['q']}},
  //           {match: {hours: req.query['q']}},
  //           // {match: {inf: req.query['q']}},
  //         ]
  //       }
  //     }
  //   }
  // }
  client.search({index:'project3',  body:body, type:'all'})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.log(err)
    res.send([]);
  });

})






app .listen( app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
} );
