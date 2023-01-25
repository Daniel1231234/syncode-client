import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const socketIoServerUrl = import.meta.env.MODE === 'development' ? 'http://localhost:3001/codeblock' : 'https://syncode-bhy4.onrender.com/codeblock'

export const socket = io(socketIoServerUrl);
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
