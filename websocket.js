var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/../index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
      console.log(error.response.data);
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  console.log(__dirname);
  console.log('이런씨발');
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
})