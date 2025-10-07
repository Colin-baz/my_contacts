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

const contactValidation = (req, res, next) => {
  const { firstName, lastName, phone } = req.body;

  if (req.method === 'POST') {
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis (firstName, lastName, phone)",
      });
    }
  }

  if (phone !== undefined) {
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Le numéro de téléphone doit contenir entre 10 et 20 caractères",
      });
    }
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  contactValidation,
};
