import { body, validationResult } from "express-validator";

const storesValidation = {};

storesValidation.validate = [
    // Info personal
    body("ownerName")
        .notEmpty().withMessage("Owner name is required")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Owner name must be between 2 and 100 characters"),

    body("phoneNumber")
        .notEmpty().withMessage("Phone number is required")
        .matches(/^\+?[\d\s\-]{7,20}$/).withMessage("Invalid phone number format"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("nit")
        .optional()
        .isString().withMessage("NIT must be a string")
        .trim(),

    // Tipo de documento
    body("documentType")
        .notEmpty().withMessage("Document type is required")
        .isIn(["DUI", "Pasaporte", "Residencia"]).withMessage("Document type must be DUI, Pasaporte or Residencia"),

    // Numero de documento segun tipo
    body("duiNumber")
        .if(body("documentType").equals("DUI"))
        .notEmpty().withMessage("DUI number is required"),

    body("passportNumber")
        .if(body("documentType").equals("Pasaporte"))
        .notEmpty().withMessage("Passport number is required"),

    body("residenceNumber")
        .if(body("documentType").equals("Residencia"))
        .notEmpty().withMessage("Residence number is required"),

    // Datos bancarios
    body("accountHolderName")
        .notEmpty().withMessage("Account holder name is required")
        .trim(),

    body("accountNumber")
        .notEmpty().withMessage("Account number is required")
        .trim(),

    body("bankName")
        .notEmpty().withMessage("Bank name is required")
        .trim(),

    body("accountType")
        .notEmpty().withMessage("Account type is required")
        .isIn(["Ahorros", "Corriente"]).withMessage("Account type must be Ahorros or Corriente"),

    // Terminos
    body("acceptedTerms")
        .equals("true").withMessage("You must accept the terms and conditions"),

    body("acceptedPrivacyPolicy")
        .equals("true").withMessage("You must accept the privacy policy"),

    body("acceptedSellerPolicy")
        .equals("true").withMessage("You must accept the seller policy"),

    body("acceptedProhibitedProducts")
        .equals("true").withMessage("You must accept the prohibited products policy"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("ERRORES VALIDACION:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

storesValidation.validateSetup = [
    body("storeName")
        .notEmpty().withMessage("Store name is required")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Store name must be between 2 and 100 characters"),

    body("username")
        .notEmpty().withMessage("Username is required")
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

    body("token")
        .notEmpty().withMessage("Token is required"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default storesValidation;