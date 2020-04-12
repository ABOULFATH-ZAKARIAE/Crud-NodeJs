const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
const port = 8000;

const readJson = fs.readFileSync('./data/data.json');
let card = JSON.parse(readJson); 

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/'));
app.get('/', (req, res) => {
	let filterData = [];  



	res.render('index', { card });
});


// add card
app.get('/add', (_req, res) => {
	res.render('add');
});  

app.post('/add', (req, res) => {
	const { imsr, name, year, discription} = req.body;
 
	card.push({ ID: card.length+1, imsr: imsr, name:name,year:year,discription:discription });
	fs.writeFileSync('./data/Data.json', JSON.stringify(card, null, 4));
	res.redirect('/'); 
});


app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let cardId;

	for (let i = 0; i < card.length; i++) {
		if (Number(id) === card[i].ID) {
			cardId = i;
		}
	}

	res.render('edit', { card: card[cardId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const {imsr, name, year,discription } = req.body;

	let cardId;
	for (let i = 0; i < card.length; i++) {
		if (Number(id) === card[i].ID) {
			cardId = i;
		}
	}

	card[cardId].imsr = imsr;
	card[cardId].name = name;
	card[cardId].year = year;
	card[cardId].discription = discription;
	 

	fs.writeFileSync('./data/Data.json', JSON.stringify(card, null, 4));
	res.redirect('/');  
});

app.get('/delete/:id', (req, res) => {
	const { id } = req.params;
 
	const newData = [];
	for (let i = 0; i < card.length; i++) {
		if (Number(id) !== card[i].ID) {
			newData.push(card[i]);
		}
	}

	card = newData;
	fs.writeFileSync('./data/Data.json', JSON.stringify(card, null, 4));
	res.redirect('/');
});

app.listen(port, () => console.log(`our pro listening on port ${port}!`));