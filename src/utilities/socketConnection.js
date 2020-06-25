import io from 'socket.io-client';

let socket = io.connect('http://192.168.0.15:3000');
//console.log(socket);

export default socket;