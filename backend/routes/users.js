const {check} = require('express-validator');

const express = require('express');
const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();


router.get('/', usersControllers.gerUsers);

router.post('/signup',
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('userName')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail() // Test@test.com => test@test.com
            .isEmail(),
        check('password').isLength({ min: 6 })
    ], usersControllers.signup);

router.post('/login', usersControllers.login);


module.exports = router;
