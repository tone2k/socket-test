const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = 3001;

// Dummy data for suggested prompts
const suggestedPrompts = {
  '/': {
    greeting: "Welcome to ACME! How can I assist you today?",
    prompts: [
      "What are your best-selling bikes?",
      "Can you help me find a bike for commuting?",
      "What's the difference between road and mountain bikes?"
    ]
  }
};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('hello', (data) => {
    console.log('Received hello event:', data);
    try {
      const { conversationId, page } = data;
      const prompts = suggestedPrompts[page] || suggestedPrompts['/'];

      socket.emit('greeting', {
        conversationId: conversationId || uuidv4(),
        greeting: prompts.greeting,
        suggestedPrompts: prompts.prompts
      });
      console.log('Sent greeting response');
    } catch (error) {
      console.error('Error processing hello event:', error);
      socket.emit('error', { message: 'Error processing hello event' });
    }
  });

  socket.on('question', (data, callback) => {
    console.log('Received question event:', data);
    try {
      const { messages, cartData, product } = data;
      
      // Simulate processing time
      setTimeout(() => {
        const dummyResponse = {
          messages: [
            "Thank you for your question! Here's a dummy response from the AI assistant.",
            "I've processed your message and considered any relevant cart data and product information.",
            "Is there anything else I can help you with?"
          ]
        };
        
        callback(dummyResponse);
        console.log('Sent question response');
      }, 1000);
    } catch (error) {
      console.error('Error processing question event:', error);
      callback({ error: 'Error processing question' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});