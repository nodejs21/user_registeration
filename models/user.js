const mongoose = require('mongoose');

var User = mongoose.model('User', {
	fname: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	lname: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	phone: {
		type: Number,
		trim: true
	},
	address: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true
	},
	password: {
		type: String
	}
});

module.exports = {User};