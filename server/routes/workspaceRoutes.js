import express from 'express';
import { addMember, getWorkspaces } from '../controllers/workspaceController.js';

const workspaceRouter = express.Router();

workspaceRouter.get('/', getWorkspaces)
workspaceRouter.post('/add-member', addMember)

export default workspaceRouter;