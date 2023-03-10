// import logo from './logo.svg';
import './index.css';
import Die from './Die.js';
import React, { useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
	let arrDices = [
		<i class='fa-solid fa-dice-one'></i>,
		<i class='fa-solid fa-dice-two'></i>,
		<i class='fa-solid fa-dice-three'></i>,
		<i class='fa-solid fa-dice-four'></i>,
		<i class='fa-solid fa-dice-five'></i>,
		<i class='fa-solid fa-dice-six'></i>,
	];

	const [dice, setDice] = React.useState(allNewDice());
	const [tenzies, setTenzies] = React.useState(false);
	const [rolls, setRolls] = React.useState(0);

	//* Stopwatch
	const [time, setTime] = React.useState(0);
	const [start, setStart] = React.useState(false);

	useEffect(() => {
		let interval = null;

		if (start) {
			interval = setInterval(() => {
				setTime(prevTime => prevTime + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [start]);

	useEffect(() => {
		setStart(false);
	}, [tenzies]);

	React.useEffect(() => {
		const allHeld = dice.every(die => die.isHeld);
		const firstValue = dice[0].value.props.class;
		const allSameValue = dice.every(
			die => die.value.props.class === firstValue
		);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	function generateNewDie() {
		return {
			value: arrDices[Math.floor(Math.random() * arrDices.length)],
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
			setDice(oldDice =>
				oldDice.map(die => {
					return die.isHeld ? die : generateNewDie();
				})
			);
		} else {
			setTenzies(false);
			setDice(allNewDice());
			setRolls(prev => (prev = -1));
			setTime(0);
		}
		numOfRolls();
		setStart(true);
	}

	function holdDice(id) {
		setDice(oldDice =>
			oldDice.map(die => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	function numOfRolls() {
		return setRolls(prev => prev + 1);
	}

	const diceElements = dice.map(die => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	));

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className='title'>Tenzies</h1>
			<p className='instructions'>
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<div className='num-rolls'>
				Number of rolls: <span id='rolls-number'>{rolls}</span>
			</div>
			<div className='dice-container'>{diceElements}</div>
			<div className='stopWatch'>
				<h4>Time</h4>
				<h3>
					<span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
					<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>:
					<span>{('0' + Math.floor((time / 10) % 1000)).slice(-2)}</span>
				</h3>
				<div></div>
			</div>
			<button className='roll-dice' onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll'}
			</button>
		</main>
	);
}

export default App;
