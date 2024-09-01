import {io} from 'socket.io-client';
const socket = io.connect('https://chess-engine-p1yi.onrender.com/');

export{socket}
