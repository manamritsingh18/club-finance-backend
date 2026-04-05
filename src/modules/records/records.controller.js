const recordsService = require('./records.service');

const createRecord = async (req, res) => {
  try {
    const record = await recordsService.createRecord(req.body, req.user.id);
    res.status(201).json({ message: 'Record created successfully.', record });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const data = await recordsService.getAllRecords(req.query);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await recordsService.getRecordById(req.params.id);
    res.status(200).json({ record });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await recordsService.updateRecord(req.params.id, req.body, req.user.id);
    res.status(200).json({ message: 'Record updated successfully.', record });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await recordsService.deleteRecord(req.params.id, req.user.id);
    res.status(200).json({ message: 'Record deleted successfully.', record });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };