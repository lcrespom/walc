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
        setInterval(_ => {
            let newH = elem.clientHeight;
            if (edh != newH) {
                edh = newH;
                editor.layout();
            }
        }, 1000);
    }
    function doRunCode() {
        let code = editor.getModel().getValue();
        try {
            // tslint:disable-next-line:no-eval
            eval(code);
        }
        catch (e) {
            let match = e.stack.match(/<anonymous>:(\d+):(\d+)/);
            if (match && match.length == 3)
                console.warn(`Runtime error: "${e.message}" at line ${match[1]}, column ${match[2]}`);
            // TODO: render it nicely and centered
            /* Check the following:
            https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-revealing-a-position
            https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-rendering-glyphs-in-the-margin
            */
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
    var vanilla_1, editor;
    return {
        setters: [
            function (vanilla_1_1) {
                vanilla_1 = vanilla_1_1;
            }
        ],
        execute: function () {
            main();
        }
    };
});
//# sourceMappingURL=walc.js.map