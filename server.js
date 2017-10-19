
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');

const {mongoose} = require('./db/mongoose.js');
const {User} = require('./models/user.js');

const port = process.env.PORT || 3000;

var app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + "/assets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    var now = new Date();
    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        console.log("Error: ", err);
    });
    next();
});

hbs.registerHelper('getCurrentDate', () => {
    return new Date();
});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    if(!text) {
        text = "to the test"
    }
    return text.toUpperCase();
});

hbs.registerHelper('email_msg', (email) => {
	if(!email){
		return null;
	}
	return "An email has been sent to ";
});

app.get('/', (req, res) => {
    res.render('welcome.hbs');
});

app.get('/users', (req, res) => {
	User.find().then((users) => {
    	res.json(users);
	}), (err) => {
		res.send('No users found!!');
	};
});

app.get('/registeration', (req, res) => {
	res.render('index.hbs');
});

app.post('/registeration', (req, res) => {
	var user = new User({
		fname: req.body.fname,
		lname: req.body.lname,
		phone: req.body.phone,
		address: req.body.address,
		email: req.body.email,
		password: req.body.pass
	});
	user.save().then((doc)=> {
		res.render('welcome.hbs', {
			fname: req.body.fname,
			email: req.body.email
		});
	}, (err) => {
		res.status(400).send(err);
	});
});

app.listen(port, () => {
	console.log(`Connection successful on port ${port}`);
});