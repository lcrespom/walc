let sinkDiv = document.createElement('div')

export function byId(id: string) {
	return document.getElementById(id) || sinkDiv
}
