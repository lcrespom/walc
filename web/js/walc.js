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
System.register("walc", ["vanilla"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function loadMonaco(cb) {
        require.config({ paths: { 'vs': '/node_modules/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], cb);
    }
    function createEditor() {
        loadMonaco(function () {
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
        });
    }
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
    function showError(msg, line, col) {
        console.warn(`Runtime error: "${msg}" at line ${line}, column ${col}`);
        editor.revealLineInCenter(line);
        decorations = editor.deltaDecorations(decorations, [{
                range: new monaco.Range(line, 1, line, 1),
                options: {
                    isWholeLine: true,
                    className: 'walc-error-line'
                }
            }]);
    }
    function doRunCode() {
        let code = editor.getModel().getValue();
        try {
            // tslint:disable-next-line:no-eval
            eval(code);
            decorations = editor.deltaDecorations(decorations, []);
        }
        catch (e) {
            let match = e.stack.match(/<anonymous>:(\d+):(\d+)/);
            if (match && match.length == 3)
                showError(e.message, parseInt(match[1], 10), parseInt(match[2], 10));
        }
    }
    function main() {
        createEditor();
        let editorElem = vanilla_1.byId('walc-code-editor');
        editorElem.addEventListener('keydown', e => {
            if (e.altKey && e.key == 'Enter')
                doRunCode();
        });
    }
    var vanilla_1, editor, decorations;
    return {
        setters: [
            function (vanilla_1_1) {
                vanilla_1 = vanilla_1_1;
            }
        ],
        execute: function () {
            decorations = [];
            main();
        }
    };
});
//# sourceMappingURL=walc.js.map