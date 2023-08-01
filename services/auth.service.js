const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { config } = require('./../config/confi');

const UserService = require('./user.service');
const service = new UserService();

class AuthService {

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    done(null, user);
  }

  signToken() {
      const payload = {
        sub: user.id,
        role: user.role
      }
      const token = jwt.sign(payload, config.jwtSecret);
      return{
        user,
        token
      };
  }

  async sendMail(email){
    const transporter = nodemailer.createTransport({
      host: "all.gmail.com",
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
        user: 'alex.hernandez@gmail.com',
        pass: 'alex12345'
      }
    });
    await transporter.sendMail({
      from: 'alex.hernandez@gmail.com', // sender address
      to: `${user.email}`, // list of receivers
      subject: "Este es un nuevo correo", // Subject line
      text: "Hola Alex", // plain text body
      html: "<b>Hola santi</b>", // html body
    });
    return { message: 'mail sent' }
  }

}

module.exports = AuthService;
