import React from 'react';
import socket from '../../utilities/socketConnection';

class Signin extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			serverid: '',
			name: '',
			selectedFile: null,
    		imagePreviewUrl: null
		}
	}

	onNameChange = (event) => {
		this.setState({name: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({serverid: Number(event.target.value)})
	}

	submitSignIn = () =>{
		//get party returns the servers array
		//then it checks if the serverid that they put in is in the array 
		//if it is call the signin func in server
		//if it is not get out of here
		if(this.props.isAdmin){
			this.setState({serverid: this.props.sid});
		}
		setTimeout(() => {
			socket.emit('signin', {
				sid: this.state.serverid,
				name: this.state.name
			}, (data) => {
				if(data){
					//console.log(data);
					this.props.onRouteChange("home");
					this.props.onSidChange(data.sid, data.id, data.isapproved);
				}else{
					alert('Get out of here!')
				}
			}) 
		},100); 
	}

	fileChangedHandler = event => {
	    this.setState({
	      selectedFile: event.target.files[0]
	    })
	    let reader = new FileReader();
	    reader.onloadend = () => {
	      this.setState({
	        imagePreviewUrl: reader.result
	      });
	    }
	    reader.readAsDataURL(event.target.files[0]);
	}

	render() {
		let imagePreview;
	    if (this.state.imagePreviewUrl) {
	      imagePreview = (<div className="" ><img style={{
	       paddingVertical: 30,
	       width: 100,
	       height: 100,
	       objectFit: "cover",
	       borderRadius: 75
	     }} src={this.state.imagePreviewUrl} alt="icon" /></div>);
	    }
		return(
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow=5 center">
					<main className="pa4 black-80">
					  <div className="measure">
					    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
					    {this.props.isAdmin ? <legend className="f1 fw6 ph0 mh0">Create Party</legend> : <legend className="f1 fw6 ph0 mh0">Sign In</legend>}
					      <div className="mt3">
					        <label className="db fw6 lh-copy f6" htmlFor="photo">Photo</label>
					        <input 
					        	style={{display: 'none'}}
					        	onChange={this.fileChangedHandler}
					        	type="file"
					        	name="photo"  
					        	id="photo"
					        	ref={fileInput => this.fileInput = fileInput} />
					        {imagePreview}
					        <input 
					      		onClick={() => this.fileInput.click()}
					      		className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      		type="submit" 
					      		value="Pick File" />
					      </div>
					      <div className="mt3">
					        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
					        <input 
					        	onChange={this.onNameChange}
					        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        	type="text" 
					        	name="name"  
					        	id="name" />
					      </div>
					      {this.props.isAdmin ? 
					      <div className="mv3">
					        <label className="db fw6 lh-copy f4" htmlFor="serverid">Party Number: {this.props.sid}</label>
					        <label className="db fw6 lh-copy f4" htmlFor="serverid">Share with your friends.</label>
					      </div> : 
					      <div className="mv3">
					        <label className="db fw6 lh-copy f6" htmlFor="serverid">Party Number</label>
					        <input 
					        	onChange={this.onPasswordChange}
					        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
					        	type="text" 
					        	name="serverid"  
					        	id="serverid" />
					      </div>}
					    </fieldset>
					    <div className="">
					      <input 
					      	onClick={this.submitSignIn}
					      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
					      	type="submit" 
					      	value="Sign in"/>
					    </div>
					  </div>
					</main>
				</article>
		);
	}
}

export default Signin;