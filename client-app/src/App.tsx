import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    values: []
  };

  componentDidMount(){
    axios.get("https://localhost:5001/api/values")
    .then((response) => {
      console.log(response);
      
      this.setState({
        values: response.data
      });
    })
    
  }

  render(){
   return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <ul>
   {this.state.values.map((value: any) => <li>{value.name}</li>)}
        </ul>
      </header>
    </div>
  );
  }
 
}

export default App;
