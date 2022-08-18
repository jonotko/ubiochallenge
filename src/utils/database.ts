import { connect } from "mongoose";
import loadEnv from '../config';

export const useDb = async () => {
	const config =  await loadEnv()
	return await connect(config.dbUrl)
}