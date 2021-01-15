import {Router} from 'express';
import userController from './Controllers/UserController';
import upload from './config/uploads';
import verifyToken from './config/verifyToken';

const router = Router();

router.get('/user', verifyToken,userController.index);
router.get('/user/:id', verifyToken, userController.getUser);
router.post('/user', [verifyToken ,upload.single('photo')], userController.insert);
router.put('/user/:id', [verifyToken, upload.single('photo')], userController.update);
router.delete('/user/:id', verifyToken, userController.destroy);
router.post('/user/login', userController.login);

export default router;