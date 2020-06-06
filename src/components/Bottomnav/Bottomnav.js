import React from 'react';

const Bottomnav = ({ showOptions, onShowNextQuestion, onShowResults, isAdmin, isApproved, onUpdate }) => {
	//When is approved changes in app.js is approved in here doesn't change
	//The admin will see show results or next question
	//But others will see refresh
	if(isAdmin || isApproved){
		if(showOptions){
			return(
				<nav className='flex justify-end'>
					<p onClick={onShowResults} className='f3 outline link dim white pa3 ma3 pointer'>Show Results</p>
				</nav>
			);
		}else{
			return(
				<nav className='flex justify-end'>
					<p onClick={onShowNextQuestion} className='f3 outline link dim white pa3 ma3 pointer'>Next Question</p>
				</nav>
			);
		}
	} else {
		return(
			<nav className='flex justify-end'>
				
			</nav>
		);
	}
}

export default Bottomnav;