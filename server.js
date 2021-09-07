const express = require('express');

var cors = require('cors');
const request = require('request');
var bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// ... other app.use middleware
app.use(express.static(path.join(__dirname, 'client', 'build')));

// ...
// Right before your app.listen(), add this:
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.post('/api/wp-json/ca/v1/addUsers', (req, res) => {
  request.post(
    {
      headers: { 'content-type': 'application/json' },
      url: 'https://theminoritypsychologynetwork.org/wp-json/ca/v1/addUsers',
      body: JSON.stringify(req.body),
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error.message });
      }

      res.json(JSON.parse(body));
    }
  );
});

const port = process.env.PORT || 8000;

app.listen(port);
