const mongoose = require('mongoose'),
			passportLocalMongoose = require('passport-local-mongoose'); 

	let userSchema = new mongoose.Schema({
			email: {type: String, unique: true},
	    username: {type: String, unique: true}, 
	    password: String 
	});

	userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);