import { body, validationResult } from "express-validator";

const storesValidation = {};

storesValidation.validate = [
    body("ownerName")
        .notEmpty().withMessage("Owner name is required")
        .isString().withMessage("Owner name must be a string")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Owner name must be between 2 and 100 characters"),

    body("phoneNumber")
        .notEmpty().withMessage("Phone number is required")
        .matches(/^\+?[\d\s\-]{7,20}$/).withMessage("Invalid phone number format"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("username")
        .notEmpty().withMessage("Username is required")
        .isString().withMessage("Username must be a string")
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

    body("storeName")
        .notEmpty().withMessage("Store name is required")
        .isString().withMessage("Store name must be a string")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Store name must be between 2 and 100 characters"),

    body("location")
        .optional()
        .isString().withMessage("Location must be a string")
        .trim(),

    body("design")
        .optional(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default storesValidation;