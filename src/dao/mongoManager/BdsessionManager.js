const userModel = require ('../models/user.model')

class BdsessionManager {
   
  getUsers = () => userModel.find()

  getSession = (email, password) => userModel.findOne({email, password});
  
  getId = (id) => userModel.findById(id);
  
  getEmail = (email) => userModel.findOne(email);
  
  create = (user)=>{
      const { firstName, lastName, email, age, password,rol, cart , } = user
      return userModel.create({firstName , lastName, email, age, password, rol,cart })
  }

  update = (id , user) => userModel.findByIdAndUpdate(id, user) 

  updatePassword = (id, newPassword) => userModel.findByIdAndUpdate(id ,{password:newPassword})

  updateRole = (id, newRole) => userModel.findByIdAndUpdate(id , {rol:newRole})

  updateDocs = (id , docs ) => userModel.findByIdAndUpdate(id , docs)

  deleteUser = (id) => userModel.findOneAndDelete(id)


}
module.exports = new BdsessionManager