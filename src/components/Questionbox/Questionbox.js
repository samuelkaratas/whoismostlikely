import React from 'react';
import './Questionbox.css'

const Questionbox = ({ questionNumber, questionString, sid }) => {
	return(
		<div className='container'>
			{questionString.length === 0 ?
				<div>
					<p className='f2 white pa3 shadow-5 border w-80 center' >{"Party Number: " + sid}</p>
					<p className='f2 white pa3 shadow-5 border w-80 center' >Tell your friends to sign in to whoismostlikely.com and enter the party number.</p>
				</div> :
				<p className='f2 white pa3 shadow-5 border w-80 center' >{questionString}</p> 
			}
		</div>
	);
}

export default Questionbox;