const io = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');

  // Test 'hello' event
  socket.emit('hello', { conversationId: 'test-id', page: '/' }, (response) => {
    console.log('Received greeting:', response);
  });

  // Test 'question' event
  setTimeout(() => {
    socket.emit('question', {
      messages: [{ content: "What are your best-selling bikes?", role: "USER" }],
      cartData: "",
      product: null
    }, (response) => {
      console.log('Received question response:', response);
      socket.disconnect();
    });
  }, 1000);
});

socket.on('greeting', (data) => {
  console.log('Received greeting:', data);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
