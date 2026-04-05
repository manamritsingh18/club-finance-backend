const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../../middleware/validate');
const auth = require('../../middleware/auth');
const rbac = require('../../middleware/rbac');
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('./records.controller');

router.use(auth);

// Viewer and above can view records
router.get('/', rbac('viewer'), getAllRecords);
router.get('/:id', rbac('viewer'), getRecordById);

// Only admin can create, update, delete
router.post(
  '/',
  rbac('admin'),
  [
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense.'),
    body('category').notEmpty().withMessage('Category is required.'),
    body('record_date').isDate().withMessage('Valid date is required.'),
  ],
  validate,
  createRecord
);

router.put(
  '/:id',
  rbac('admin'),
  [
    body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be positive.'),
    body('type').optional().isIn(['income', 'expense']).withMessage('Invalid type.'),
  ],
  validate,
  updateRecord
);

router.delete('/:id', rbac('admin'), deleteRecord);

module.exports = router;