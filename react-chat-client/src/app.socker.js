import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:4000');

class AppSocket {
    saveName(cb, name) {
      name ? socket.emit('getName', name) : '';
      }
      setMessage(messageData) {
        socket.emit('message', messageData);
      }

      getMessage(cb) {
        socket.on('newMessage', ( msg ) => cb( msg));
      }

      selectuser(nameData) {
        socket.emit('onSelect', nameData);
      }
      newUserAdded(cb) {
        // return new Promise( ( resolve, reject )=> {
          socket.on('newUserAdded', () => cb());
        // });
      }
}

const Socket = new AppSocket();
export default Socket;