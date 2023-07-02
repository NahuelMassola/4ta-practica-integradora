const DtoUsers = (users) => {
    let newUserDto = users.map(user =>({
        firsName: user.firsName,
        lastName: user.lastName,
        email: user.email,
        cart: user.cart,
        rol: user.rol,
        last_connection: user.last_connection,
        documents: user.documents
    }))
    return (newUserDto);
}

module.exports = DtoUsers