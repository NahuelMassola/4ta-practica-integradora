const HttpResponse = require("./codErrors");

const httpResponse = new HttpResponse

const  adminPermission  =  async  (req,  res,  next)  =>  {
    const {user}= req.user
    if (user.rol  !==  "administrador" && user.rol  !==  "premium") {
      return httpResponse.Unauthorized(res , "Usuario no Autorizado")
    }
    next() 
}   
const  premiumPermission  =  async  (req,  res,  next)  =>  {
  const {user}= req.user
  if  (!user  ||  user.rol  !==  'premium')  {
    return httpResponse.Unauthorized(res , "Usuario no Autorizado")
  }
next() 
}   

const  admin  =  async  (req,  res,  next)  =>  {
  const {user}= req.user
  if  (user.rol  !==  'administrador')  {
    return httpResponse.Unauthorized(res , "Usuario no Autorizado")
  }
next() 
}   

const  userPermission  =  async  (req,  res,  next)  =>  {
  const {user}= req.user
  if  (!user  ||  user.rol  !==  'user')  {
    return httpResponse.Unauthorized(res , "Usuario no Autorizado")
  }
  next() 
}   
module.exports = {
  adminPermission,
  userPermission,
  premiumPermission,
  admin
}