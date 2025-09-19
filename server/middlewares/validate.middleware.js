const registerValidation = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(412).json({
      success: false,
      message: "Email et mot de passe sont requis",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(412).json({
      success: false,
      message: "Email invalide",
    });
  }

  if (password.length < 6) {
    return res.status(412).json({
      success: false,
      message: "Le mot de passe doit contenir au moins 6 caractères",
    });
  }

  next();
};

const loginValidation = registerValidation; 

module.exports = {
  registerValidation,
  loginValidation,
};
