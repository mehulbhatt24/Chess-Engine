import {io} from 'socket.io-client';
const socket = io.connect('https://chess-engine-ol5o.vercel.app/');

export{socket}
