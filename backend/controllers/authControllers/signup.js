import bcrypt from 'bcrypt'
import User from '.../models/User.js'

async function createUser(req, res) {
    try {
        const {username, email, password} = req.body
        if(username.length > 50 || username === '' ) return res.status(400).json({mes: 'invalid body'});
        if(email.length > 50 || username === '' ) return res.status(400).json({mes: 'invalid body'});
        if(password.length > 50 || username === '' ) return res.status(400).json({mes: 'invalid body'});
        const cryptPassWd = await bcrypt.hashSync(password, 12);
        await User.create({ username, email, password: cryptPassWd});
        return res.status(201).json({mes: 'usuario criado com sucesso!'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({mes: 'Server Error'});
    }  
}

export default { createUser }