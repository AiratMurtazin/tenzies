// import logo from './logo.svg';
import './index.css';
import Die from './Die.js';
import React, { useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';

function App() {
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

	React.useEffect(() => {
		const allHeld = dice.every(die => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every(die => die.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [dice]);

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
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
		}
		numOfRolls();
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
					<span>{'0' + ((time / 60000) % 60).slice(-2)}</span>
					<span>{'0' + ((time / 1000) % 60).slice(-2)}</span>
					<span>{'0' + ((time / 10) % 1000).slice(-2)}</span>
				</h3>
				<div>
					<button onClick={() => setStart(true)}>Start</button>
					<button onClick={() => setStart(false)}>Stop</button>
					<button
						onClick={() => {
							setTime(0);
							setStart(false);
						}}
					>
						Reset
					</button>
				</div>
			</div>
			<button className='roll-dice' onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll'}
			</button>
		</main>
	);
}

export default App;
