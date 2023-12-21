const UserSchema = require('../models/UserSchema')

//search by email
const QueryByEmail = (email) => {
  return UserSchema.findOne({email: email})
}

// search by id
const QueryById = (id) => {
  return UserSchema.findOne({_id: id})
}

// return all users
const QueryAllUsers = () => {
  return UserSchema.findAll().exec()
}

// create a new user
const CreateNewUser = (firstName, lastName, email, password) => {
  return UserSchema.create(
    {firstName: firstName,
     lastName: lastName,
     email: email,
     password: password
    }
  )
}

//update a user
const UpdateUserById = (id, update) => {
  return UserSchema.findOneAndUpdate(
    {_id: id},
    {$set: update},
    { new: true })
}

//delete a user by id
const RemoveById = (userId) => {
  return UserSchema.findByIdAndDelete(userId)
}


module.exports = {
  QueryAllUsers, QueryByEmail, QueryById, CreateNewUser, RemoveById, UpdateUserById
}