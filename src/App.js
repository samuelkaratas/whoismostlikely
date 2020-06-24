import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Questionbox from './components/Questionbox/Questionbox';
import Options from './components/Options/Options';
import Bottomnav from './components/Bottomnav/Bottomnav';
import Signin from './components/Signin/Signin';
import socket from './utilities/socketConnection';


const initialState = {
  showOptions: false,
  questionNumber: 1,
  isSignedIn: false,
  route: "signin",
  leaderboard: [],
  users: [],
  sid: 0,
  id: 0,
  selectedName: '',
  isAdmin: false,
  isApproved: false,
  questionString: '',
  numOfSelected: 0,
  gameMessage: ''
};

class App extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount = () => {
    socket.on('question', (data) => {
      console.log(data);
      this.setState({ questionString: data.question, users: data.users });
      let reverseShowOptions = !this.state.showOptions;
      let incrementedQuestionNumber = this.state.questionNumber + 1;
      this.setState({
        showOptions: reverseShowOptions,
        questionNumber: incrementedQuestionNumber,
        numOfSelected: 0
      })
    })

    socket.on('leaderboard', (data) => {
      console.log(data);
      this.setState({ leaderboard: data})
      let reverseShowOptions = !this.state.showOptions;
      this.setState({
        showOptions: reverseShowOptions,
      })
    })

    socket.on('score', (data) => {
      let newNumber = this.state.numOfSelected + 1;
      this.setState({ numOfSelected: newNumber });
      if(this.state.numOfSelected === this.state.users.length){
        this.onShowResults();
      }
    })

    socket.on('adminDisconnected', () => {
      if(!this.state.isAdmin){
        alert('Looks like admin signed out. Go to app store to download the app so that you can play with your friends anytime. See you there!!');
        this.onSignout();
      }
      this.setState(initialState);
    })

    socket.on('somebodyDisconnected', (data) => {
      let disUser;
      for (var i = this.state.users.length - 1; i >= 0; i--) {
        if(this.state.users[i].id === data){
          disUser = this.state.users.splice(i, 1);
        }
      }
      console.log(disUser[0].name + ' has left.');
      let usersArr = this.state.users;
      this.setState({ users: usersArr, gameMessage: disUser[0].name + ' has left.' });
      setTimeout(() => {
        this.setState({
          gameMessage: ''
        });
      }, 2000);
    })
  }

  onShowNextQuestion = async () => {
    //If admin presses it calls the changeIsApproved func which changes other players approved state
    //Then just the admin changes question number
    //Then get users and question according to the selected question number
    socket.emit('adminPressedShowNextQuestion', { sid: this.state.sid });
  }

  onShowResults = async () => {
    //If admin presses it calls the changeIsApproved func which changes other players approved state
    //Then gets the leaderboard
    socket.emit('adminPressedShowLeaderboard', { sid: this.state.sid });
  }

  onSignout = () => {
    if(this.state.isAdmin){
      socket.emit('deleteServer', { sid: this.state.sid });
      /*
        fetch('http://192.168.0.15:3000/deleteServer', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            sid: this.state.sid
          })
        }).then(response => response.json())
          .then(data => {
            console.log(data)
          })*/
        }else{
          socket.emit('signout', { id: this.state.id });
          this.setState(initialState);
          /*
          fetch('http://192.168.0.15:3000/signout', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.id
            })
          }).then(response => response.json())
            .then(data => {
              console.log(data)
            })*/
        }
    window.location.reload(false);
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      //Change signing out
      this.onSignout();
    }
    else if(route === 'home'){
      this.setState({isSignedIn: true});
    }

    this.setState({ route: route });  
  }


  onSidChange = (sid, id, isApproved) => {
    this.setState({ sid: sid, id: id, isApproved: isApproved });
  }

  onAdminChange = () => {
    this.setState({ isAdmin: true })
  }

  onClickName = (key) => {
    //When name is selected send the key to server
    //Server increments the score of the selected Name
    socket.emit('nameSelected', { id: this.state.id, key: key });
    if(this.state.numOfSelected === this.state.users.length){
      this.onShowResults();
    }
  }

  onCreateParty = () => {
    //When create party clicked get a random number and assign it to sid
    //Who ever pressed it is the admin (For testing)
    //Alert the user
    const a = Math.round(Math.random() * 100000);
    fetch('http://192.168.0.15:3000/createParty', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        sid: a
      })
    }).then(response => response.json())
      .then(arr => {
        this.onAdminChange();
        alert('Room Number is ' + a + ' copy and text your friends!')
      })
  }

  render() {
    const mystyle = {
      color: "white",
      padding: "10px",
      fontFamily: "Arial"
    };
    const messageStyle = {
      color: "white",
      backgroundColor: '#00e6e6',
      opacity: '0.5'
    }
    return (
      <div className="App">
        <div>
          <Navigation onRouteChange={this.onRouteChange} onCreateParty={this.onCreateParty} route={this.state.route} />
          {this.state.route === "home" ?
          <div>
            <Questionbox questionNumber={this.state.questionNumber} questionString={this.state.questionString} className='center'/>
            <Options showOptions={this.state.showOptions} leaderboard={this.state.leaderboard} users={this.state.users} onClickName={this.onClickName} className='center'/>
            <Bottomnav showOptions={this.state.showOptions} onShowNextQuestion={this.onShowNextQuestion} onShowResults={this.onShowResults} isAdmin={this.state.isAdmin} onUpdate={this.onUpdate} />
            {this.state.showOptions ? <p style={mystyle} >{this.state.numOfSelected}/{this.state.users.length} people answered!</p> : <p></p> }
            <h2 style={messageStyle} >{this.state.gameMessage}</h2>
          </div> : <Signin onRouteChange={this.onRouteChange} onSidChange={this.onSidChange} getUsers={this.getUsers} onAdminChange={this.onAdminChange} onUpdate={this.onUpdate} isAdmin={this.state.isAdmin} sid={this.state.sid} />}
        </div>
      </div>
    );
  }

}

export default App;
