import { Router } from 'express';
import { addUser,getUser, updateUser, deleteUser, userLogin } from '../controllers/userController.js';
import {verifyAdmin} from '../middlewares/verifyAdmin.js';
const userRouter = Router();

// Get all users
userRouter.get('/', (req, res) => {
    res.json({
        message: "Welcome to Users section.",});
});  

userRouter.post('/login', userLogin);

// Get user by ID
userRouter.get('/:id', getUser);

// Create new user
userRouter.post('/add-user',verifyAdmin, addUser);

// Update user
userRouter.put('/:id', updateUser);

// Delete user
userRouter.delete('/:id', deleteUser);

export default userRouter;