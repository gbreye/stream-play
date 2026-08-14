import bcrypt from 'bcrypt'
import User from '../../models/User.js'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SCRET;

async function login(req, res) {
    try {
        const {email, password } = req.body
        if(!email || email.length > 50) {
            return res.status(400).json({mes: 'bad request!'});
        };
        if (/[{}]/.test(email)) {
            return res.status(400).json({mes: 'bad request!'});
        };
        if(!password || password.length > 50) {
            return res.status(400).json({mes: 'bad request!'});
        };
        if (/[{}]/.test(password)) {
            return res.status(400).json({mes: 'bad request!'});
        };
        const user = User.findOne(email);
        if(!user) return res.status(401).json({mes: 'unable to find user!'});
        const userPassword = user.password;
        const compare = await bcrypt.compare(password, userPassword);
        if(!compare) {
            console.log('Auth Failed!');
            return res.status(401).json({mes: 'unable to find user!'});
        };

        const token = jsonwebtoken.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h'}
        );

        res.cookie('token', token, {
            sameSite:'strict',
            httpOnly:'true',
            maxAge:'3600000'
        });
        return res.status(200).json({mes:'Login realizado com sucesso!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({mes: 'Internal Server Error', error});
    }
};

export default { login };