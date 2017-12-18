import { byId } from './vanilla'


// -------------------- Editor setup --------------------

declare let require: any
declare let monaco: any
let editor: any
let decorations: any[] = []
let currentError: any

function loadMonaco(cb: () => void) {
	require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' }})
	require(['vs/editor/editor.main'], cb)
}

export function createEditor() {
	loadMonaco(function() {
		registerHoverHandler()
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
		registerActions()
	})
}

function registerActions() {
	editor.addAction({
		id: 'walc-run',
		label: 'Run code',
		keybindings: [ monaco.KeyMod.Alt | monaco.KeyCode.Enter ],
		contextMenuGroupId: 'navigation',
		contextMenuOrder: 1,
		run: doRunCode
	})
}

function handleEditorResize(elem: HTMLElement) {
	let edh = elem.clientHeight
	let edw = elem.clientWidth
	setInterval(_ => {
		let newH = elem.clientHeight
		let newW = elem.clientWidth
		if (edh != newH || edw != newW) {
			edh = newH
			edw = newW
			editor.layout()
		}
	}, 1000)
}


// -------------------- Error handling --------------------

function registerHoverHandler() {
	monaco.languages.registerHoverProvider('javascript', {
		provideHover: function(model: any, position: any) {
			// TODO: make it dynamic
			// 		call editor.getLineDecorations to get current error position
			if (!currentError ||
				position.lineNumber != currentError.line ||
				position.column > currentError.column) return
			return {
				contents: [
					'**Runtime Error**',
					currentError.message
				]
			}
		}
	})
}

function getErrorLocation(e: any) {
	// Safari
	if (e.line)
		return { line: e.line, column: e.column }
	// Chrome: <anonymous>
	// Firefox: > eval
	let match = e.stack.match(/(<anonymous>|> eval):(\d+):(\d+)/)
	if (match && match.length == 4) {
		return {
			line: parseInt(match[2], 10),
			column: parseInt(match[3], 10)
		}
	}
	return null
}

function showError(msg: string, line: number, col: number) {
	console.log(`Runtime error: "${msg}" at line ${line}, column ${col}`)
	editor.revealLineInCenter(line)
	decorations = editor.deltaDecorations(decorations, [{
		range: new monaco.Range(line, 1, line, col),
		options: {
			isWholeLine: false,
			className: 'walc-error-line'
		}
	}])
}


// -------------------- Code execution --------------------

function doRunCode() {
	let code = editor.getModel().getValue()
	try {
		currentError = null
		decorations = editor.deltaDecorations(decorations, [])
		// tslint:disable-next-line:no-eval
		eval(code)
	} catch (e) {
		let location = getErrorLocation(e)
		if (location) {
			currentError = e
			currentError.line = location.line
			currentError.column = location.column
			showError(e.message, location.line, location.column)
		}
	}
}
