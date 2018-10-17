const mongoose = require('mongoose');

let placeSchema = new mongoose.Schema({
    name: String, 
    description: String, 
    price: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
    ]
});


module.exports = mongoose.model('Place', placeSchema);