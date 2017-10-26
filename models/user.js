const mongoose = require('mongoose');
const validator = require('validator');

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
		trim: true,
		unique: true
	},
	address: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		validate: {
			// validator: (value) => {
			// 	return validator.isEmail(value);
			// } or below line
			validator: validator.isEmail,
            isAsync: false,
			message: '{value} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
            type: String,
            required: true
		}
	}]
});

module.exports = {User};