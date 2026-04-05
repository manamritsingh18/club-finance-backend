const usersService = require('./users.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await usersService.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deactivated successfully.', user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };