import { byId } from './vanilla'

declare let require: any
declare let monaco: any

let editor: any

function loadMonaco(cb: () => void) {
	require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})
	require(['vs/editor/editor.main'], cb)
}

function createEditor() {
	loadMonaco(function() {
		let editorElem = byId('walc-code-editor')
		editor = monaco.editor.create(editorElem, {
			value: '',
			language: 'javascript',
			lineNumbers: false,
			renderLineHighlight: 'none',
			minimap: { enabled: false }
		})
		editor.focus()
		handleEditorResize(editorElem)
	})
}

function handleEditorResize(elem: HTMLElement) {
	let edh = elem.clientHeight
	setInterval(_ => {
		let newH = elem.clientHeight
		if (edh != newH) {
			edh = newH
			editor.layout()
		}
	}, 1000)
}

function doRunCode() {
	let code = editor.getModel().getValue()
	console.log('-----\nRun code:')
	console.log(code)
}

function main() {
	createEditor()
	let editorElem = byId('walc-code-editor')
	editorElem.addEventListener('keydown', e => {
		if (e.altKey && e.key == 'Enter')
			doRunCode()
	})
}


main()
