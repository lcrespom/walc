System.register("vanilla", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function byId(id) {
        return document.getElementById(id) || sinkDiv;
    }
    exports_1("byId", byId);
    var sinkDiv;
    return {
        setters: [],
        execute: function () {
            sinkDiv = document.createElement('div');
        }
    };
});
System.register("editor", ["vanilla"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function loadMonaco(cb) {
        require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], cb);
    }
    function createEditor() {
        loadMonaco(function () {
            registerHoverHandler();
            let editorElem = vanilla_1.byId('walc-code-editor');
            editor = monaco.editor.create(editorElem, {
                value: '',
                language: 'javascript',
                lineNumbers: false,
                renderLineHighlight: 'none',
                minimap: { enabled: false }
            });
            editor.focus();
            handleEditorResize(editorElem);
            editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, doRunCode);
        });
    }
    exports_2("createEditor", createEditor);
    function handleEditorResize(elem) {
        let edh = elem.clientHeight;
        let edw = elem.clientWidth;
        setInterval(_ => {
            let newH = elem.clientHeight;
            let newW = elem.clientWidth;
            if (edh != newH || edw != newW) {
                edh = newH;
                edw = newW;
                editor.layout();
            }
        }, 1000);
    }
    // -------------------- Error handling --------------------
    function registerHoverHandler() {
        monaco.languages.registerHoverProvider('javascript', {
            provideHover: function (model, position) {
                // TODO: make it dynamic
                // 		call editor.getLineDecorations to get current error position
                if (!currentError ||
                    position.lineNumber != currentError.line ||
                    position.column > currentError.column)
                    return;
                return {
                    contents: [
                        '**Runtime Error**',
                        currentError.message
                    ]
                };
            }
        });
    }
    function getErrorLocation(e) {
        // Safari
        if (e.line)
            return { line: e.line, column: e.column };
        // Chrome: <anonymous>
        // Firefox: > eval
        let match = e.stack.match(/(<anonymous>|> eval):(\d+):(\d+)/);
        if (match && match.length == 4) {
            return {
                line: parseInt(match[2], 10),
                column: parseInt(match[3], 10)
            };
        }
        return null;
    }
    function showError(msg, line, col) {
        console.log(`Runtime error: "${msg}" at line ${line}, column ${col}`);
        editor.revealLineInCenter(line);
        decorations = editor.deltaDecorations(decorations, [{
                range: new monaco.Range(line, 1, line, col),
                options: {
                    isWholeLine: false,
                    className: 'walc-error-line'
                }
            }]);
    }
    // -------------------- Code execution --------------------
    function doRunCode() {
        let code = editor.getModel().getValue();
        try {
            currentError = null;
            decorations = editor.deltaDecorations(decorations, []);
            // tslint:disable-next-line:no-eval
            eval(code);
        }
        catch (e) {
            let location = getErrorLocation(e);
            if (location) {
                currentError = e;
                currentError.line = location.line;
                currentError.column = location.column;
                showError(e.message, location.line, location.column);
            }
        }
    }
    var vanilla_1, editor, decorations, currentError;
    return {
        setters: [
            function (vanilla_1_1) {
                vanilla_1 = vanilla_1_1;
            }
        ],
        execute: function () {
            decorations = [];
        }
    };
});
System.register("walc", ["editor"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function main() {
        editor_1.createEditor();
    }
    var editor_1;
    return {
        setters: [
            function (editor_1_1) {
                editor_1 = editor_1_1;
            }
        ],
        execute: function () {
            main();
        }
    };
});
//# sourceMappingURL=walc.js.map