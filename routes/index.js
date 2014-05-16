var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'
);

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var query = [
  "START n=node(*)",
  "RETURN n"
  ].join('\n');

  db.query(query, null, function (err, results) {
    if (err) throw err;
    var nodes = results.map(function (result) {
      return result['n'];
    });
    res.render('index', { title: 'Get', db:db, all_nodes: JSON.stringify(nodes) });
  });
});

router.post('/', function(req, res) {
  var name = req.body.name
  var node = db.createNode({name: name});     // instantaneous, but...
  node.save(function (err, node) {    // ...this is what actually persists.
     if (err) {
        console.error('Error saving new node to database:', err);
      } else {
        console.log('Node saved to database with id:', node.id);
      }
  });

  var query = [
    "START n=node(*)",
    "RETURN n"
    ].join('\n');

  db.query(query, null, function (err, results) {
    if (err) throw err;
    var nodes = results.map(function (result) {
      return result['n'];
    });
    res.render('index', { title: 'Post', db:db, all_nodes: JSON.stringify(nodes) });
  });
});

module.exports = router;
