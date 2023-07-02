
const DtoUser = (user) => {
  
  const newUserDto = {
    id:user.user._id,
    firstName :user.user.firstName,
    lastName :user.user.lastName,
    rol : user.user.rol,
    last_connection: user.last_connection,
    documents: user.documents,
    cart: user.cart
  }
  return newUserDto
} 

module.exports = {
  DtoUser 
}

