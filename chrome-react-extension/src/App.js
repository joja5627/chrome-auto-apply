import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    this.state = {
      message: ''
    };
    this.handleMessage.bind(this);
  }
  componentDidMount() {
    // Add listener when component mounts
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }
  handleMessage(msg) {
   // Handle received messages
   if (msg.target === 'app') {
    if (msg.type === 'setMessage') {
     this.setState({message: msg.body});
    }
   }
  }
  componentWillUnmount() {
   // Remove listener when this component unmounts
   chrome.runtime.onMessage.removeListener(this.handleMessage);
  }
  func() {
   chrome.runtime.sendMessage(chrome.runtime.id, {target: 'background', type: 'message', body: 'hello'})
  }
  render() {
    return(
          <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
        <div>{this.state.message}</div>
        </p>
      </div>
    )
  }

// chrome.runtime.onMessage.addListener((request, sender) => {
//   if (request.action == "getSource") {
//       this.setState({sourceCode: request.source});
//   }
// });

  // render() {
  //   return (
  
  //   );
  // }
}

export default App;
