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

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if(!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'})
    const link = `http//myfronted.com/recovery?token=${token}`;
    await service.update(user.id, {recoveryToken: token});
    const mail = {
      from: 'alex.hernandez@gmail.com', // sender address
      to: `${user.email}`, // list of receivers
      subject: "Email para recuperar contraseña", // Subject line
      text: "Hola Alex", // plain text body
      html: `<b>Ingresa a este link => ${link}</b>`, // html body
    }

    const rta = await this.sendMail(mail);
    return rta;
  }

  async sendMail(infoMail){
    const transporter = nodemailer.createTransport({
      host: "all.gmail.com",
      secure: true, // true for 465, false for other ports
      port: 465,
      auth: {
        user: 'alex.hernandez@gmail.com',
        pass: 'alex12345'
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' }
  }

}

module.exports = AuthService;
