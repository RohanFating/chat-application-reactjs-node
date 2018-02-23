class ApiService {

  getUsers( name ) {
    return fetch('http://192.168.1.3:3000/users/getUsers').then(
      (data) => data.text()
    )
      .then(
      (data) => {
        console.log(`Data::  ${data}`);
        return Promise.resolve(JSON.parse(data));
      }
      )
      .catch(
      (error) => {
        console.log(`error::  ${error}`);

        return Promise.reject(error);
      }
      );
  }

  saveUser( name ) {
    var headers = new Headers();

    headers.append('Accept', 'application/json'); // This one is enough for GET requests
    headers.append('Content-Type', 'application/json'); // This one sends body

    return fetch('http://192.168.1.3:3000/users/saveUser', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        name: name,
      })
    }).then(
      (data) => data.text()
      )
      .then(
      (data) => {
        console.log(`Data::  ${data}`);
        return Promise.resolve(JSON.parse(data).data);
      }
      )
      .catch(
      (error) => {
        console.log(`error::  ${error}`);

        return Promise.reject(error);
      }
      );
  }
}

var Service = new ApiService();

export default Service;