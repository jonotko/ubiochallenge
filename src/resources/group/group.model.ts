import { Schema, model } from "mongoose";

interface IGroup {
	group: string,
	instances: number,
	createdAt: number,
	lastUpdatedAt: number
}

const groupSchema = new Schema<IGroup>({
	group: { type: String, required: true, unique: true },
	instances: { type: Number, required: true },
	createdAt: Number,
	lastUpdatedAt: Number
},{
	versionKey: false
})


export interface IInstance {
	_id?: string,
	createdAt: number,
	updatedAt: number,
	id: string,
	group: string,
	meta?: Map<string, any>
}

const instanceSchema = new Schema<IInstance>({
	createdAt: Number,
	updatedAt: Number,
	id: String,
	group: String,
	meta: Map
}, {
	timestamps: { currentTime: () => Date.now() },
	versionKey: false
})

export const Group = model<IGroup>('Group', groupSchema)

export const Instance = model<IInstance>('Instance', instanceSchema)



