import {Router} from 'express';
import { addProperty,getAllProperties } from '../controllers/propertyController.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
const propertyRouter = Router();

propertyRouter.get('/', (req, res) => {
    res.send('Welcome to the Property API');
});

propertyRouter.post('/addproperty', verifyAdmin ,addProperty);
propertyRouter.get('/allproperties', getAllProperties);

export default propertyRouter;