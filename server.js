const path = require('path');

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const fetch = require('node-fetch');

var { nanoid } = require('nanoid');
const http = require('http');
const host = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const express = require('express');

const socketio = require('socket.io');

const formatMessage = require('./utils/messages');

const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	make_ready,
	allready,
	giveProblems,
} = require('./utils/users');

const app = express();

const server = http.createServer(app);

const io = socketio(server);

//django unchained

app.use(express.static(path.join(__dirname, 'publicis')));
io.on('connection', (socket) => {
	console.log('new ws connection');

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);
		if (user) {
			io.to(user.room).emit(
				'message',
				formatMessage('BOSS', `${user.username} has left the chat`)
			);
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});

	socket.on('ready', ({ username, room }) => {
		const user = make_ready(socket.id, username, room, 1);
		const users = getRoomUsers(room);
		if (allready(room)) {
const problems = [];
// giveProblems();
			io.to(user.room).emit('start_loader', problems);
			async function getFinal() {
				let solved = new Set();
				console.log(users);
				let handle_name1 = users[0].username;
				// async function getSetGo() {
				let modified_url = `https://codeforces.com/api/user.status?handle=${handle_name1}`;
				const jsondata = await fetch(modified_url);
				const jsdata = await jsondata.json();
				for (let i = 0; i < jsdata.result.length; i++) {
					if (jsdata.result[i].verdict == 'OK') {
						let str =
							jsdata.result[i].problem.contestId +
							'-' +
							jsdata.result[i].problem.index;
						solved.add(str);
					}
				}
				let handle_name2 = users[0].username;
				// async function getSetGo() {
				modified_url = `https://codeforces.com/api/user.status?handle=${handle_name2}`;
				const jsondata2 = await fetch(modified_url);
				const jsdata2 = await jsondata2.json();
				for (let i = 0; i < jsdata2.result.length; i++) {
					if (jsdata2.result[i].verdict == 'OK') {
						let str =
							jsdata2.result[i].problem.contestId +
							'-' +
							jsdata2.result[i].problem.index;
						solved.add(str);
					}
				}
				let handle_name3 = users[0].username;
				// async function getSetGo() {
			modified_url = `https://codeforces.com/api/user.status?handle=${handle_name3}`;
				const jsondata3 = await fetch(modified_url);
				const jsdata3 = await jsondata3.json();
				for (let i = 0; i < jsdata3.result.length; i++) {
					if (jsdata3.result[i].verdict == 'OK') {
						let str =
							jsdata3.result[i].problem.contestId +
							'-' +
							jsdata3.result[i].problem.index;
						solved.add(str);
					} 
				}
				// }
				// getSetGo();
				// console.log(solved);

				let modified_url2 = `https://codeforces.com/api/problemset.problems`;
				const jsondata4 = await fetch(modified_url2);
				jsdata4 = await jsondata4.json();

				for (let i = 0; i < jsdata4.result.problems.length; i++) {
					let str =
						jsdata4.result.problems[i].contestId +
						'-' +
						jsdata4.result.problems[i].index;
					if (
						jsdata4.result.problems[i].rating > 900 &&
						jsdata4.result.problems[i].rating <= 1200 &&
						solved.has(str) === false
					) {
						//to be continued

						problems.push(str);
						break;
					}
				}
				for (let i = 0; i < jsdata4.result.problems.length; i++) {
					let str =
						jsdata4.result.problems[i].contestId +
						'-' +
						jsdata4.result.problems[i].index;
					if (
						jsdata4.result.problems[i].rating > 1200 &&
						jsdata4.result.problems[i].rating <= 1700 &&
						solved.has(str) === false
					) {
						//to be continued
						problems.push(str);
						break;
					}
				}

				for (let i = 0; i < jsdata4.result.problems.length; i++) {
					let str =
						jsdata4.result.problems[i].contestId +
						'-' +
						jsdata4.result.problems[i].index;
					if (
						jsdata4.result.problems[i].rating > 1700 &&
						jsdata4.result.problems[i].rating <= 2000 &&
						solved.has(str) === false
					) {
						//to be continued
						problems.push(str);
						break;
					}
				}
				console.log(problems);
				// problem_set=problems;
				io.to(user.room).emit('start_contest', problems);
			}
			getFinal();
			// console.log(problems);
			// start_contest();
		}	
	});

	socket.on('checkId', (room) => {
		let users = getRoomUsers(room);
		console.log(users);
		if (users.length == 0) {
			io.to(socket.id).emit('roomIdChecked', 0);
		} else if (users != undefined) {
			io.to(socket.id).emit('roomIdChecked', 1);
		}
	});
	socket.on('give_id', () => {
		let ID = nanoid(4);
		console.log(ID);
		io.to(socket.id).emit('rec_id', ID);
	});
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		socket.emit(
			'message',
			formatMessage('BOSS', 'Welcome to CodeBlast, ready to blast your code?')
		);

		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage('BOSS', `${user.username} has joined the room`)
			);

		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	socket.on('bringResults', ({ room, problems }) => {
		async function getFinal() {
			console.log('hello');
			io.to(room).emit('start_loader');
			let solved = new Set();
			let username = getRoomUsers(room);
			for (let j = 0; j < username.length; j++) {
				let handle_name = username[j].username;
				console.log(username);
				let modified_url = `https://codeforces.com/api/user.status?handle=${handle_name}`;
				const jsondata = await fetch(modified_url);
				const jsdata = await jsondata.json();
				for (let i = 0; i < jsdata.result.length; i++) {
					if (jsdata.result[i].verdict == 'OK') {
						let str =
							jsdata.result[i].problem.contestId +
							'-' +
							jsdata.result[i].problem.index;
						solved.add(str);
					}
				}
				let result_jo = [];
				for (let i = 0; i < problems.length; i++) {
					if (solved.has(problems[i])) {
						result_jo[i] = 1;
					} else {
						result_jo[i] = 0;
					}
				}
				socket.emit('le_result', result_jo, username, j);
			}
		}
		getFinal();
	});

	socket.on('chatMessage', (msg) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});
});
console.log(process.env.FIREBASE_API_KEY);
server.listen(PORT, host, function () {
	console.log('Server started.......');
});
