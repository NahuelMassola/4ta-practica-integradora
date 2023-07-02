const mongoose = require('mongoose');
const { stringify } = require('uuid');
const userCollection = ('users')

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
    
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type:Number,
      require:true,
    },
    thumbnail: {
      type: {
        imgage: {
          data: Buffer,
          contentType: String,
        }
      },
      //require: true
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts',
    },
    rol:{
      type: String,
      default: 'user'
    },
    documents: {
      type: [{
        name: String,
        reference: String
      }],
      default: []
    },
    last_connection: {
      type: Date ,
      default: new Date()
    }
  },{
    versionKey: false,
    timestamps:true
  }
  );
  
  const userModel = mongoose.model(userCollection, userSchema);
  module.exports = userModel;