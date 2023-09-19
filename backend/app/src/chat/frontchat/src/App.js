import './App.css';
// import socketIO from 'socket.io-client';

// const socket = socketIO.connect('http://localhost:4000');
import Chat from "./Views/Chat/Chat.tsx";

function App() {
  return (
    <div>
      <Chat />
    </div>
  );
}

export default App;
