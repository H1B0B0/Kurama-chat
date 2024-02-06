import { Router } from 'express';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import ChatController from './controllers/ChatController';
import StatusController from './controllers/StatusController';

import ensureAuthenticated from './middlewares/ensureAuthenticated';

const routes = Router();

const userController = new UserController();
const sessionController = new SessionController();
const chatController = new ChatController();
const statusController = new StatusController();

routes.post('/sessions', sessionController.store);

routes.get('/users', ensureAuthenticated, userController.index);
routes.post('/users', userController.store);
routes.put('/users/:id', userController.update);
routes.delete('/users/:id', userController.delete);

routes.get('/chat', ensureAuthenticated, chatController.index);
routes.post('/chat', ensureAuthenticated, chatController.store);

routes.put('/status', ensureAuthenticated, statusController.update);

export default routes;
