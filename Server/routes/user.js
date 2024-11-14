const express = require('express')
const router = express.Router();
const usersController =require('../controller/usersController');
const ROLES_LIST=require("../config/roles_list");
const verifyRoles =require('../middleware/verifyRoles');

router.route('/:email')
        .get(usersController.getUser)
        .delete(usersController.delUser)
        .put(usersController.updateUser);

router.route('/all')
        .get(verifyRoles(ROLES_LIST.Admin),usersController.getAllUser)

//cart


module.exports =router ;          