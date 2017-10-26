
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

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

app.get('/users/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(500).send("User id is invalid!");
	}
	User.findById(id).then((user) => {
		if(!user) {
			return res.send("No user found against: "+id);
		}
		return res.json(user);
	}).catch((e) => {
		res.status(400).send("some error from /users/:id\n"+e);
	});
});

app.get('/registeration', (req, res) => {
	res.render('index.hbs');
});

app.post('/registeration', (req, res) => {
    var picked = _.pick(req.body, ['fname', 'lname', 'phone', 'address', 'email', 'pass']);
    var body = _.mapKeys(picked, (value, key) => {
        if(key === "pass") {
            return key = "password";
        }
        return key;
    });
    // console.log("This is picked body:");
    // console.log(body);
	var user = new User(body);
    // console.log("This is user to be sent in db");
	// console.log(user);
	user.save().then((doc)=> {
		res.render('welcome.hbs', {
			fname: req.body.fname,
			email: req.body.email
		});
	}, (err) => {
		console.log("\n"+err);
		res.status(400).send("Error from POST method /registeration\n\n"+err);
	});
});

app.delete('/users/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(500).send("Invalid user id!");
	}
	User.findByIdAndRemove(id).then((user) => {
		if(!user) {
			return res.status(400).send("No such user found!");
		}
		res.send(user);
	}).catch((e) => {
		res.status(400).send("error from delete method, /users/id"+e);
	});
});

app.patch('/users/:id', (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(500).send("Invalid user id!");
	}
	var picked = _.pick(req.body, ['fname', 'lname', 'phone', 'address', 'email', 'pass']);
	var body = _.mapKeys(picked, (value, key) => {
		if(key === "pass") {
			return key = "password";
		}
		return key;
	});
	User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
		if(!user) {
            return res.status(400).send("No such user found!");
		}
		res.send({user});
	}).catch((e) => {
        res.status(400).send("error from patch method, /users/id"+e);
	});
});

app.listen(port, () => {
	console.log(`Connection successful on port ${port}`);
});