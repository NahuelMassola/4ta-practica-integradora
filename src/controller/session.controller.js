const { COOKIE_USER, TYPE_DOCUMENTS}=  require("../config/config");
const { logger } = require("../config/config.winston");
const { DtoUser } = require("../dao/DTOs/dtoUsers");
const { sesionServices, productServices } = require("../service");
const { invalidEmail } = require("../utils/creatorMsg");
const CustomError = require("../utils/customError");
const { ERROR_USER } = require("../utils/variablesError");
const mailingService = require("../service/mailing.service");
const { generateToken, getUserByToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/hashPassword");
const HttpResponse = require("../utils/middleware/codErrors");
const DtoUsers = require("../dao/DTOs/dtoUserss");
const moment = require("moment/moment");

const HttpResp =  new HttpResponse


const sessionLogin = async (req,res)=>{
    res
    .cookie(COOKIE_USER, req.user.token, { maxAge: 300000, httpOnly: true })
    .send(req.user )
}


const loginRegister = async (req,res)=>{
    logger.info('cliente Registrado con exito')
    res.send(req.user) 
}  

const getUsers = async (req, res) => {
  try {
    const users = await sesionServices.getUsers();
    const dtoUsers = DtoUsers(users)

    if(!users) {
      return HttpResp.notFound("No hay usuarios registrados")
    }
    return HttpResp.OK(res , "Succes" , dtoUsers)
  } catch (error) {
    return HttpResp.Error(res, "ERROR INESPERADO")
  }
}

const getCurrent = (req, res)=>{
    newUser = DtoUser(req.user)
    res.send(newUser) 
}

const github = async(req, res) =>{
  try {
    
    const products= await productServices.getProduct();
    req.user.rol = "USER"
    const product = products.docs.map((product) => ({
        title:product.title,
        description:product.description,
        category:product.category,
        price:product.price,
        stock:product.stock,
    }
    )) 
    res.render("viewProduct", {
        products: product,
        totalPage: products.totalPages,
        page:products.page,
        prev: products.hasPrevPage,
        next: products.hasNextPage,
        firstName: req.user.firstName,
        rol: req.user.rol
    })
  } catch (error) {
      return HttpResp.Error(res,  "ERROR" , error)
  }
}


const forgotPassword = async (req, res, next)=>{
    try {
    const {email} = req.body
    const verifyUser = await sesionServices.getEmail({email:email}) 
    if (verifyUser === null) {
      return HttpResp.Error(res , "El email no encontrado")
    }
      const token = generateToken({id:verifyUser._id},"1h")
      mailingService.sendMail({
      to: verifyUser.email,
      subject: ` Hola ${verifyUser.firstName}`,
      html: `<a href="http://localhost:8080/forgotrecovery/?token=${token}" style="margin: 20px 0; color: #080808;">Restablecer Constraseña</a>`
    })
    res.json({
      status: "success",
      message:`Se Envio email a ${verifyUser.email} para restablecer su Contraseña`,
      
    })  
    
  } catch (error) {
    return next (CustomError.createError({code:ERROR_USER, msg: invalidEmail(), typeError:"ERROR_USER"})) 
  }  
  
}

const forgotrecovery = async (req, res, next)=>{
  try {
      const newPassword = req.body.password
      const token = req.params.token
        if (!newPassword || !token) {
          return HttpResp.BadRequest(res , "Invalid data");
    }
    const user = await getUserByToken(token);
    if (!user) {
      return HttpResp.Forbbiden(res , "Token Invalido")
    }
    const isValid = await comparePassword(newPassword, user.password);
    if (isValid) {
      return HttpResp.Forbbiden(res , "La contraseña no puede ser igual a la anterior")
    }
    const hashNewPassword = await hashPassword(newPassword);
    await sesionServices.updateUserPassword(user.id, hashNewPassword);
    return HttpResp.OK(res , "La contraseña se actualizo con exito")
    
  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }
  
}

const deleteUserInactive = async (res , req) => {
  try {
    const arrayDelete = [];
    const users = await sesionServices.getUsers();
    if(!users) {
      return res.json({ status: 'error ' , msg: 'Usuario no encontrado'})
    };
    users.forEach((user) => {
      const expirationTime = moment().subtract(5 , "days");
      const userDate = moment(user.last_connection , "DD/MM/YYYY  , hh:mm:ss");
      const diff = userDate.isBefore(expirationTime)
      if(diff) {
        mailingService.sendMail({
          to: user.email,
          subject: `Cuenta Eliminada`, 
          html : `<p> Hola: ${user.firstName} su cuenta fue elimanda por falta de Actividdad en los ultimos 5 dias </p>`,
        }),
        arrayDelete.push(user.id);
      }
    });

    if (arrayDelete.length === 0 ) {
      return res.json({
        status: "Error" , 
        message: "No hay usuarios inactivos para eliminar"
      });
    } else {
      arrayDelete.forEach( async (id) => {
        await sesionServices.deleteUser(id);
      });
    }
      return res.json({
        status:"Ok",
        message:`Se han eliminado ${arrayDelete.length} Usuarios inactivos`
      })
  } catch (error) {
    return res.json({
      status: "Error",
      message: "error inesperado"
    })
  }
}

const roleChange = async (req, res, next)=>{
    const {uid} = req.params
    const {rol}= req.body
    const user = await sesionServices.getUserId(uid)
    const documents = user.documents
    if (!user){
      return HttpResp.OK(res , "Usuario no Encontrado")
    }
    if (user.rol === rol){
      return HttpResp.OK(res , `El usuario ya tiene role ${rol}`)
  }
  const array = documents.filter((element) => 
    TYPE_DOCUMENTS.includes(element.name)
  );
  
  if ( array.length < 3 ){
    return HttpResp.Forbbiden(res, "Para ser usuario premium debe subir la documentacion necesaria")
  }
  await sesionServices.updateUserRole (user.id, rol);
    return HttpResp.OK(res , "El Role Cambiado con exito");
}


const updateDocuments = async (req , res) => {
  try {
    let { user } = req.user

    let userDocuments = [];
    user.documents.forEach((element) => {
      userDocuments.push(element.name);
    });

    await sesionServices.updateUserDoc(user.id, {
      documents: [
        ...user.documents,
        {
          name: req.body.typeDocument,
          reference: req.route,
        },
      ],
    });
    res.send({
      status: 'succes',
      msg: 'Archivo guardado con exito'
    })
  } catch (error) {
    res.send({
      status: 'Error',
      msg: 'error al guardar archivo'
    })
  }
}


module.exports={
    sessionLogin,
    loginRegister,
    getCurrent,
    github,
    forgotPassword,
    forgotrecovery,
    roleChange,
    updateDocuments,
    getUsers,
    deleteUserInactive
}