const env = process.env.NODE_ENV || 'development'

const baseConfig = {
	env,
	port: 3000
}

let envConfig = { dbUrl:'' }

 const loadEnv = async () => {

	switch (env) {
		case 'development':
			envConfig = (await import('./dev')).config
			break
		case 'producion':
			envConfig = (await import('./prod')).config
			break
		default:
			envConfig = (await import('./dev')).config
	}

	return {...baseConfig, ...envConfig}

}

export default loadEnv