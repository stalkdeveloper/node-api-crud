const express = require("express");
const userController = require("../controllers/UserController.js");
const router = express.Router();

router.post('/', userController.create);
router.get('/', userController.index);
router.get('/:id', userController.findOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.delete('/', userController.deleteAll);

module.exports = router;
