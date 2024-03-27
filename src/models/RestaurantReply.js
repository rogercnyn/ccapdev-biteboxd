// Importing necessary modules and utilities from the mongoose package
const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

// Defining a schema for restaurant replies using the Schema class from mongoose
const restaurantReplySchema = new Schema({
    // Field for referencing the ID of the restaurant the reply belongs to
    restaurantId: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},

    // Field indicating whether the reply has been edited or not
    isEdited: {type: Boolean, required: false},

    // Field for the main content of the reply
    body: {type: String, required: true},

    // Field for storing media related to the reply, as an array of strings
    media: { type: [String], required: false },

    // Field for storing the creation timestamp of the reply, defaults to the current time
    createdAt: { type: Date, default: Date.now },

     // Field for storing the deletion timestamp of the reply, defaults to null indicating not deleted
    deletedAt: { type: Date, default: null },
});

// Creating a model named 'RestaurantReply' based on the defined schema
const RestaurantReply = model('restaurantreply', restaurantReplySchema); 

// Exporting the RestaurantReply model to be used in other files
module.exports = RestaurantReply;