import React from 'react';

const Navigation = ({ onRouteChange, route, onCreateParty }) => {
	//Top navigation bar changes accordingly
	if(route === "home"){
		return (
			<nav style={{display: "flex", justifyContent: "flex-end"}}>
				<p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
			</nav>
		);
	} else {
		return(
			<nav style={{display: "flex", justifyContent: "flex-end"}}>
				<p onClick={onCreateParty} className='f3 link dim black underline pa3 pointer'>Create a party</p>
			</nav>
		);
	}
}

export default Navigation;