
class SessionService{
    constructor(dao){
        this.dao = dao
}
    getUsers = () => this.dao.getUsers()
    getSession = (email, password) => this.dao.getSession({email, password});
    getUserId = (id) => this.dao.getId(id);
    getEmail = (email) => this.dao.getEmail(email);
    createUser = (user) => this.dao.create(user)
    updateUser = (id, user) => this.dao.update(id,user) 
    updateUserPassword = (id, newPassword)=> this.dao.updatePassword(id, newPassword)
    updateUserRole = (id, newRole)=> this.dao.updateRole(id, newRole)
    updateUserDoc = (id , docs ) => this.dao.updateDocs(id , docs)
    deleteUser =  (id) => this.dao.deleteUser(id)

}
module.exports = SessionService