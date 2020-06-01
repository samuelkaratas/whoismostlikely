import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Questionbox from './components/Questionbox/Questionbox';
import Options from './components/Options/Options';
import Bottomnav from './components/Bottomnav/Bottomnav';
import Signin from './components/Signin/Signin';

const initialState = {
  showOptions: true,
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
  questionString: ''
};

class App extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  getUsers = () => {
    //gets the users that are in that server
    fetch('http://localhost:3000/profile/' + this.state.sid, {
        method: 'get'
      }).then(response => response.json())
        .then(data => {
          const entries = Object.entries(data)
          console.log('entries', entries)
          this.setState({ users: entries})
        })
  }

  getQuestion = () => {
    //gets the question with the random selected id 
    fetch('http://localhost:3000/question/' + this.state.sid, {
          method: 'get'
        }).then(response => response.json())
          .then(data => {
            this.setState({ questionString: data.question })
          }).catch(console.log)
  }

  getQuestionNumber = () => {
    //picks a random question id in the server
    fetch('http://localhost:3000/questionNumber/' + this.state.sid, {
          method: 'get'
        }).then(response => response.json())
          .then(data => {
            console.log(data)
          })
  }

  changeIsApproved = (key) => {
    //Only Admin can access this
    //Changes the is approved of everybody that is in the server
    fetch('http://localhost:3000/update/' + this.state.sid, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          isApproved: key
        })
      }).then(response => response.json())
        .then(data => {
          console.log(this.state.isApproved)
        })
  }

  changeIsApprovedWithId = () => {
    //Everybody can access
    //Changes the is approved to false
    fetch('http://localhost:3000/getupdate/' + this.state.sid + '/' + this.state.id, {
        method: 'put'
      }).then(response => response.json())
        .then(data => {
          this.setState({ isApproved: data })
        })
  }

  getLeaderboard = () => {
    //Gets the leaderboard
    fetch('http://localhost:3000/leaderboard/' + this.state.sid, {
        method: 'get'
      }).then(response => response.json())
        .then(data => {
          this.setState({ leaderboard: data})
        })
  }

  onShowNextQuestion = async () => {
    //If admin presses it calls the changeIsApproved func which changes other players approved state
    //Then just the admin changes question number
    //Then get users and question according to the selected question number
      if(this.state.isAdmin){
        await this.changeIsApproved(true);
        await this.getQuestionNumber();
      }
      await this.getUsers();
      await this.getQuestion();
      let reverseShowOptions = !this.state.showOptions;
      let incrementedQuestionNumber = this.state.questionNumber + 1;
      this.setState({
        showOptions: reverseShowOptions,
        questionNumber: incrementedQuestionNumber,
      })
  }

  onShowResults = async () => {
    //If admin presses it calls the changeIsApproved func which changes other players approved state
    //Then gets the leaderboard
      if(this.state.isAdmin){
        await this.changeIsApproved(true);
      }
      await this.getLeaderboard();
      let reverseShowOptions = !this.state.showOptions;
      this.setState({
        showOptions: reverseShowOptions,
      })
  }

  onUpdate = () => {
    //When pressed refresh get the isApproved state from server 
    //If it is true show leaderboard or next question 
    //If false don't do anything
    //NEEDS CHANGING
    fetch('http://localhost:3000/getupdate/' + this.state.sid + '/' + this.state.id, {
        method: 'get'
      }).then(response => response.json())
        .then(data => {
          this.setState({ isApproved: data});
          if(this.state.isApproved){
            this.changeIsApprovedWithId();
            if(this.state.showOptions){
              console.log('if statement in update')
              this.onShowResults();
            }else{
              console.log('else statement in update')
              this.onShowNextQuestion()
            }
          }
        })
  }

  onRouteChange = (route) => {
    if(route === 'signout')
      this.setState(initialState);
    else if(route === 'home')
      this.setState({isSignedIn: true});

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
    fetch('http://localhost:3000/profile/' + this.state.sid + '/' + this.state.id, {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        selectedName: key
      })
    }).then(response => response.json())
      .then(data => {
           console.log(data)
      })
    console.log(key)
  }

  onCreateParty = () => {
    //When create party clicked get a random number and assign it to sid
    //Who ever pressed it is the admin (For testing)
    //Alert the user
    const a = Math.round(Math.random() * 100000);
    fetch('http://localhost:3000/createParty', {
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
    return (
      <div className="App">
        <div>
          <Navigation onRouteChange={this.onRouteChange} onCreateParty={this.onCreateParty} route={this.state.route} />
          {this.state.route === "home" ?
          <div>
            <Questionbox questionNumber={this.state.questionNumber} questionString={this.state.questionString} className='center'/>
            <Options showOptions={this.state.showOptions} leaderboard={this.state.leaderboard} users={this.state.users} onClickName={this.onClickName} className='center'/>
            <Bottomnav showOptions={this.state.showOptions} onShowNextQuestion={this.onShowNextQuestion} onShowResults={this.onShowResults} isAdmin={this.state.isAdmin} onUpdate={this.onUpdate} />
          </div> : <Signin onRouteChange={this.onRouteChange} onSidChange={this.onSidChange} getUsers={this.getUsers} onAdminChange={this.onAdminChange} />}
        </div>
      </div>
    );
  }

}

export default App;
