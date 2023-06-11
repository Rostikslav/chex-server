export const toJSON = (obj: any): any => {
	return JSON.parse(JSON.stringify(obj))
}