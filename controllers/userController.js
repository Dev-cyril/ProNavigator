const {
  QueryByEmail,
  QueryById,
  QueryAllUsers,
  CreateNewUser,
  RemoveById, UpdateUserById
} = require('../services/User');
const {RemoveProjectById} = require('../services/Projects')

// create a new user
const CreateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await QueryByEmail(email);
    if (existingUser && existingUser.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new user
    const newUser = await CreateNewUser(firstName, lastName, email, password);

    res.status(200).json({
      message: 'User created successfully',
      user: {_id: newUser._id, email: newUser.email}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// To sign in a user by email and password
const GetUserByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await QueryByEmail(email);

    if (user && user.password === password) {
      return res.status(200).json({
        message: 'User logged in successfully',
        user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }
      });
    }

    res.status(400).json({ message: 'Invalid email or password' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// get user info by id
const GetUserById = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await QueryById(_id).populate({
        path: 'projects',
        populate: {
          path: 'schedule',
          model: 'Schedule', 
        },
      })
      .exec();;
    if (user) {
      return res.status(200).json({
        message: 'User found',
        user: user
      });
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error finding user' });
  }
};

// update user info
const UpdateUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await QueryById(_id);
    if (user) {
      if (!req.body) {
        return res.status(400).json({ message: 'Key value pair cannot be null' });
      }

      const updateObject = { ...req.body };

      const updatedUser = await UpdateUserById(_id, updateObject);

      if (updatedUser) {
        return res.status(200).json(updatedUser);
      }

      return res.status(400).json({ message: 'Error updating user' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating user' });
  }
};

//delete user
const DeleteUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await QueryById(_id);

    if (user) {
      const projectToDelete = user.projects;
      if(projectToDelete.length > 0){
        for (const project of projectToDelete) {
          await RemoveProjectById(project._id);
        } 
      }
      const deletedUser = await RemoveById(_id);
      res.status(200).json({ message: 'User deleted', deletedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};


module.exports = {
  CreateUser,
  GetUserById,
  GetUserByEmail,
  UpdateUser,
  DeleteUser
};
