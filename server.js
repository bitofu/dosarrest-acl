var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var database = [{action: 'Allow', ip: '1.1.1.1', cidr: '32'}, {action: 'Deny', ip: '1.1.1.2', cidr: '16'}];

app.set('port', process.env.PORT || 4000);
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/api/acl', function(req, res) {
  res.send(database);
});

// create new acl item
app.post('/api/acl', function(req, res) {
  if (req.body.index != null) {
    database.splice(req.body.index+1, 0, req.body.item);
  } else {
    database.push(req.body.item)
  };
  res.send(database);
});

// edit acl item
app.put('/api/acl', function(req, res) {
  database.splice(req.body.index, 1, req.body.item);
  res.send(database);
});

// dnd acl item
app.put('/api/acl-dnd', function(req, res) {
  var movingItem = database.splice(req.body.lastDragged, 1);
  database.splice(req.body.index, 0, movingItem[0]);
  res.send(database);
});

app.delete('/api/acl/:acl_id', function(req, res) {
  database.splice(req.params.acl_id, 1);
  res.send(database);
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});