import React, { Component } from 'react';
import './App.css';
import Socket from './app.socker';
import Service from './api.service';

class App extends Component {

  constructor(props) {
    super();
    this.msgs = {};
    this.currentuser = '';
    this.name = '';
    this.counter = {};
    this.isContactVisible = false;
    this.state = {
      data: 'This is redux App',
      name: '', serverData: [],
      msg: '', messages: [],
      users: [],
      currentUser: this.currentuser,
      counter: this.counter,
      showContacts: false
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.showContacts = this.showContacts.bind(this);
  }

  componentDidMount() {
    this.handleSocket();
  }

  handleSocket() {

    // eslint-disable-next-line
    this.name = prompt('Please enter your name');
    this.setState({ name: this.name });
    this.saveUser(this.name);
    Socket.saveName((err, name) => {
      this.getUsers();
      console.log('Got Event')
    }, this.name);
    Socket.getMessage((data) => {
      this.currentuser = data.name;
      this.counter[`${this.currentuser}`]++;
      this.msgs[`${this.currentuser}`].push({ name: data.name, msg: data.msg });
      this.setState({ counter: this.counter });
      console.log('Data:: ' + data);
    })
    Socket.newUserAdded(
      () => {
        this.getUsers();
      }
    )
  }

  handleOnChange(event) {
    if (event && event.target) {
      const value = event.target.value;
      this.setState({ msg: value });
    }
    //this.getUsers(this.name);
  }

  sendMessage() {
    this.msgs[`${this.currentuser}`].push({ name: this.name, msg: this.state.msg });
    this.setState({ messages: this.msgs[`${this.currentuser}`] || [] });
    Socket.setMessage({ name: this.name, msg: this.state.msg, toUser: this.currentuser });
    this.setState({ msg: '' });
  }

  selectUser(data) {
    this.currentuser = data.name;
    this.setState({ currentUser: this.currentuser });
    this.setState({ messages: this.msgs[`${this.currentuser}`] });
    if (this.msgs[`${this.currentuser}`].length === 0) {
      this.msgs[`${this.currentuser}`].push({ name: this.name, msg: 'lets chatt' });
      Socket.selectuser({ selectedName: data.name, user: this.name });
    }
    this.counter[`${this.currentuser}`] = 0;
    this.setState({ messages: this.msgs[`${this.currentuser}`] || '' });
    this.showContacts();
  }

  getUsers(name) {
    Service.getUsers(name)
      .then(
      (data) => {
        console.log(`Data::  ${data}`);
        data = data.filter((data) => this.name !== null && data.name !== this.name);
        data.forEach(element => {
          if (element.name !== null && !this.msgs.hasOwnProperty(element.name)) {
            Object.defineProperty(this.msgs, element.name || '', {
              value: [],
              counter: 0,
            })
            Object.defineProperty(this.counter, element.name || '', {
              value: 0,
              writable: true,
            })
          }
        });
        this.setState({ users: data, msgs: this.msgs });
        if (this.currentuser) {
          this.currentuser = data[0].name;
          this.setState({ currentUser: this.currentuser });
        }
      }
      )
      .catch(
      (error) => {
        console.log(`error::  ${error}`);
      }
      );
  }

  saveUser(name) {
    Service.saveUser(name)
      .then(
      (data) => {
        console.log(`Data::  ${data}`);
      }
      )
      .catch(
      (error) => {
        console.log(`error::  ${error}`);
      }
      );
  }

  showContacts() {
    this.isContactVisible = !this.isContactVisible;
    this.setState({ isContactVisible: this.isContactVisible })
  }
  render() {
    
    return (
      <div className="App container">
        <div class="row px-0 py-3 bg-faded my-1 app-nav">
          <div className="col-8">
            <span className="nav-btn--mobile" onClick={() => {
              this.showContacts();
            }}> ☰ </span><b>Chat Anywhere</b></div>
          <div className="col-4 text-right"><b>Hello {this.state.name}</b></div>
        </div>
        <div className="row">
       
          <div className={"bg-faded col-md-4 " + (this.state.isContactVisible ? ' show-contact' : ' hide-contact')}>
            {
              this.state.users.map((data, index) => {
                return <li onClick={() => {
                  this.selectUser(data)
                }} className={"row contact-wrapper text-primary" + (data.name === this.state.currentUser ? ' contact-wrapper-select' : '')} key={data.name + index.toString()}> <img src={require("./contact.png")} class="cantact-image col-3" /><div className="col-7"><h5><small><b>{data.name}</b></small></h5> <h6><small><b>online</b></small></h6></div>{data.name === this.state.currentUser || this.state.counter[`${data.name}`] === 0 ? '' : <div className="col-2 msg-counter"><span className="msg-counter-badge"><b>{this.state.counter[`${data.name}`]}</b></span></div>}</li>
              })
            }
          </div>
          <div className="col-md-8 justify-content-end">
            <div className="row">
              {
                this.state.messages.map((data) => {
                  return <div className="msgs-wrapper  col-md-12"><div className=" col-md-12 bg-primary text-white app-msg">

                    <span className={"col-md-12text-white font-weight-bold " + (data.name !== this.name ? 'text-left' : 'text-right')}> {data.name}: {data.msg}
                    </span>
                  </div> </div>
                })
              }
            </div>

            <div className="row typing-container mx-1">
              <input name="msg" className="form-control col-7" value={this.state.msg} onChange={this.handleOnChange} />
              <button className="col-3 btn-primary" onClick={() => { this.sendMessage() }}> Send </button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;

/* <div className="col-md-12">
                  <span className= {"app-msg col-md-12 font-weight-bold " + (data.name!=='Rohan' ? 'text-left' : 'text-right')}> {data.name}
                  </span>
                  <span className= {"app-msg col-md-12 bg-warning text-white font-weight-bold " + (data.name!=='Rohan' ? 'text-left' : 'text-right')}> {data.name} {data.msg}
                  </span>
                  </div> */

                  // <span className={"app-msg col-md-12 bg-warning text-white font-weight-bold " + (data.name !== 'Rohan' ? 'text-left' : 'text-right')}> {data.name} {data.msg}