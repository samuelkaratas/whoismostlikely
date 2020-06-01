import React from 'react';
import './Questionbox.css'

const Questionbox = ({ questionNumber, questionString }) => {
	return(
		<div className='container'>
			<p className='f1 white pa3 shadow-5 border w-80 center' >{questionString.length === 0 ? "Waiting for host": questionString}</p>
		</div>
	);
}

export default Questionbox;