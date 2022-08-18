import { NextFunction, Request, Response } from 'express';
import { Group } from '../resources/group/group.model';
import HttpException from './exceptions';
import { Model } from 'mongoose'

export const routeHandler = (callback: Function) => async (req: Request, res: Response, next: NextFunction) => {

	try {
		await callback(req, res)
	}catch(error) {
		next(error)
	}

}

export const createOne = (model: Model<any>) => async (data: Record<string, unknown>) => {
	const doc = new model({
		...data
	})
	return await doc.save()
}

export const getMany = (model: Model<any>) => async (filter: Record<string, unknown>) => {

	const results = await model.find(filter).exec()

	return results
}

export const findAndUpdateOrCreate = (model: Model<any>, filter: Record<string, unknown>, newData: Record<string, any>) => async (data: Record<string, any> ) => {
	let doc = await model.findOneAndUpdate(filter, newData, { new: true })

	if(doc!== null) return doc

	// if instance does not exist create it
	doc = await createOne(model)(data)
	
	if(doc !== null) return doc
		
	throw new HttpException(500, 'Failed to create Instance')
}

export const deleteAndUpdate = (deleteModel: Model<any>, deleteFilter: Record<string, unknown>) => async (
	updateModel: Model<any>, 
	updateFilter: Record<string, unknown>,
	updateQuery: Record<string, unknown>
	) => {
	const deleted = await deleteModel.deleteOne(deleteFilter)

	if (deleted.acknowledged && deleted.deletedCount > 0) {

		await updateModel.updateOne(updateFilter, updateQuery)
		return `Deleted application Instace`
	} else {
		return `Failed to delete application Instance`
	}
}

export const updateInstancesForGroup = async (groupName: string, instanceCreatedAt: number, instanceUpdatedAt: number) => {

	const isNewInstance = instanceCreatedAt === instanceUpdatedAt

	const groupDoc = await Group.findOne({ group: groupName })

	if (groupDoc === null) throw new HttpException(500, 'Failed to register Instance on group')

	if (groupDoc.instances > 0 && isNewInstance) {

		await Group.updateOne({ group: groupName }, { lastUpdatedAt: instanceCreatedAt, $inc: { instances: 1 } })

	} else if (groupDoc.instances === 0 && isNewInstance) {

		await Group.updateOne({ group: groupName }, { createdAt: instanceCreatedAt, lastUpdatedAt: instanceCreatedAt, $inc: { instances: 1 } })

	} else {
		await Group.updateOne({ group: groupName }, { lastUpdatedAt: instanceUpdatedAt })
	}
}