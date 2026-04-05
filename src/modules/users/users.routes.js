const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const rbac = require('../../middleware/rbac');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('./users.controller');

// All user routes require authentication
router.use(auth);

// Only admin can manage users
router.get('/', rbac('admin'), getAllUsers);
router.get('/:id', rbac('admin'), getUserById);

router.put(
  '/:id',
  rbac('admin'),
  [
    body('role')
      .optional()
      .isIn(['viewer', 'analyst', 'admin'])
      .withMessage('Invalid role.'),
    body('status')
      .optional()
      .isIn(['active', 'inactive'])
      .withMessage('Invalid status.'),
  ],
  validate,
  updateUser
);

router.delete('/:id', rbac('admin'), deleteUser);

module.exports = router;