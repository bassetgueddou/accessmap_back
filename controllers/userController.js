const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

const jwtSecret = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
    const { username, email, password, handicapType} = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'L\'utilisateur existe déjà' });
        }
        user = new User({
            username,
            email,
            password,
            handicapType 
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, jwtSecret, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, jwtSecret, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.getUser = async (req, res) => {
    try {
      
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("Utilisateur non trouvé avec cet email.");
      }
  
      
      const verificationCode = Math.floor(100000 + Math.random() * 900000); 
  
     
      user.verificationCode = verificationCode;
      await user.save();
  
    
      await sendEmail(email, "Réinitialisation de votre mot de passe", `Votre code de vérification est : ${verificationCode}`);
  
      res.send("Un code de vérification a été envoyé à votre adresse email.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  };
  exports.verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;
    
    try {
      const user = await User.findOne({
        email,
        verificationCode,
        verificationCodeExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).send("Code de vérification invalide ou expiré.");
      }
  
     
      res.send("Code de vérification valide. Veuillez procéder à la réinitialisation du mot de passe.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  };
  exports.resetPassword = async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
    
    try {
      const user = await User.findOne({
        email,
        verificationCode,
        verificationCodeExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).send("Code de vérification invalide ou expiré.");
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined; 
  
      await user.save();
  
      res.send("Mot de passe réinitialisé avec succès.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur serveur");
    }
  };
  