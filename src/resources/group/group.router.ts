import { Router } from 'express';
import { createGroup, deleteInstance, getInstances, listGroups, registerInstance } from './group.handler';

const router = Router()

// api/
router
	.route('/')
	.get(listGroups)

// api/:group
router
	.route('/:group')
	.get(getInstances)
	.post(createGroup)

// api/:group/:id
router
	.route('/:group/:id')
	.post(registerInstance)
	.delete(deleteInstance)

export default router