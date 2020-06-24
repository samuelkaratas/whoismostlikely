import React from 'react';

const Options = ({ showOptions, leaderboard, users, onClickName }) => {
	//I don't even know
	let leaderboard2 = [];
	for(let i = 0; i < leaderboard.length; i++){
		leaderboard2.push(<div key={leaderboard[i].selectedname} className="outline white w-80 pa3 ma3 center">
		    {leaderboard[i].selectedname + ' --> ' + leaderboard[i].count}
		</div>)
	}
	console.log('users', users)
	let users2 = [];
	for(let i = 0; i < users.length; i++){
		users2.push(users[i].name)
	}
	console.log('users2', users2)
	//console.log('user0', users[0][1].id)
	let users3 = [];
	for(let i = 0; i < users.length; i++){
		users3.push(
		<div key={users[i].id} onClick={() => onClickName(users2[i])} className="outline shadow-5 white w-25 pa3 ma3 dim pointer">
		    {users2[i]}
		</div>)
	}

	if(showOptions){
		return(
			<div className="flex flex-wrap justify-around">
			  {users3}
			</div>
		);
	} else{
		return(
			<div className="flex flex-column">
				{leaderboard2}
			</div>
		);
	}
}

export default Options;