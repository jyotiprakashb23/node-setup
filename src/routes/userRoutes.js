import { Router } from 'express';
import { addUser,getUser, updateUser, deleteUser, userLogin, userSignup } from '../controllers/userController.js';
import {verifyAdmin} from '../middlewares/verifyAdmin.js';
const userRouter = Router();

userRouter.get('/', (req, res) => {
    res.json({
        message: "Welcome to Users section.",});
});  

userRouter.post('/register', userSignup)
userRouter.post('/login', userLogin);
userRouter.get('/:id', getUser);
userRouter.post('/add-user',verifyAdmin, addUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;