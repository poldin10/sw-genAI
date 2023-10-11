const http = require('http');
const io = require('socket.io')(http);

io.on('connection', (socket : any) => {
  console.log('User connected');

  socket.on('lock-article', (data : any) => {
    // Handle locking logic, e.g., store the locked article and user info
    // Notify other connected clients that the article is locked
    socket.broadcast.emit('article-locked', data);
  });

  socket.on('unlock-article', (data : any) => {
    // Handle unlocking logic, e.g., remove the lock
    // Notify other connected clients that the article is unlocked
    socket.broadcast.emit('article-unlocked', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(3300, () => {
  console.log('WebSocket server listening on port 3000');
});