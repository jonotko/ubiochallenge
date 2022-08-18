import { Group, IInstance, Instance } from './group.model'
import { Request, Response } from 'express';
import {
	createOne,
	deleteAndUpdate,
	findAndUpdateOrCreate,
	getMany,
	routeHandler,
	updateInstancesForGroup
} from '../../utils/helpers';

export const createGroup = routeHandler(async (req: Request, res: Response) => {

	const groupName = req.params.group
	await createOne(Group)({
		group: groupName,
		instances: 0
	})

	res.status(200).json({ message: `group:${groupName}  created` })

})


export const registerInstance = routeHandler( async (req: Request, res: Response) => {

	const {id, group} = req.params

	const instanceFindAndUpdateOrCreate = findAndUpdateOrCreate(Instance, { id: id }, { ...req.body })

	const instance = await instanceFindAndUpdateOrCreate({
		id: id,
		group: group,
		meta: req.body.meta || {}
	})

	await updateInstancesForGroup(group, instance.createdAt, instance.updatedAt)

	const { _id, ...updatedDoc } = instance.toObject({ flattenMaps: true }) as IInstance

	res.json(updatedDoc)
})


export const getInstances = routeHandler(async (req: Request, res: Response) => {

	const instances = await getMany(Instance)({ group: req.params.group })

	res.json(instances)
})

export const listGroups = routeHandler( async (req: Request, res: Response) => {

	const groups = await getMany(Group)({ instances: { $gte: 1 } })

	res.json(groups)
})

export const deleteInstance = routeHandler( async (req: Request, res: Response) => {

	const { group, id } = req.params

	let result = await deleteAndUpdate(Instance, { group: group, id: id })(Group, { group: group }, { $inc: { instances: -1 } })

	let message = `${result} ${id}`

	res.json({ message })
})