export const generateSlug = (title: string, model: string) => {
	const str = title
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '')
	const str2 = model.toLowerCase()
	return `${str}_${str2}`
}
