const assert = require('assert');
const Module = require('module');
const path = require('path');
const ts = require('typescript');

function loadLibrary(getExtension) {
    const modules = ['../js/index', '../js/helper'].map((name) => require.resolve(name));
    const cached = modules.map((name) => require.cache[name]);
    modules.forEach((name) => { delete require.cache[name]; });
    const originalLoad = Module._load;
    Module._load = function (name) {
        if (name === 'vscode') {
            return { extensions: { getExtension } };
        }
        return originalLoad.apply(this, arguments);
    };
    try {
        return require('../js/index');
    } finally {
        Module._load = originalLoad;
        modules.forEach((name, index) => {
            delete require.cache[name];
            if (cached[index]) { require.cache[name] = cached[index]; }
        });
    }
}

describe('Kubectl V2 accessors', () => {
    it('restores package module caches after loading a mocked extension', () => {
        const modules = ['../js/index', '../js/helper'].map((name) => require.resolve(name));
        const cached = modules.map((name) => require.cache[name]);
        loadLibrary(() => undefined);
        assert.deepStrictEqual(modules.map((name) => require.cache[name]), cached);
    });
    it('typechecks streaming and port-forward consumers against the emitted package declarations', () => {
        const filename = path.join(__dirname, 'v2-consumer.ts');
        const source = `
            import { extension } from '../js';
            async function consume(): Promise<void> {
                const kubectl = await extension.kubectl.v2;
                if (!kubectl.available) { return; }
                const command = kubectl.api.observeCommand(['logs', 'pod'], {
                    onStdout: (chunk: string) => { void chunk; },
                    onStderr: (chunk: string) => { void chunk; },
                });
                const completion = await command.result;
                if (completion.status === 'exited') { const code: number = completion.code; void code; }
                const forwarded = await kubectl.api.portForward('pod', 'default', 9001, 80, {
                    showInUI: { location: 'status-bar', description: 'Tool', onCancel: () => {} },
                });
                if (forwarded.status === 'ready') {
                    forwarded.session.dispose();
                    await forwarded.session.result;
                }
            }
            void consume;
        `;
        const options = { noEmit: true, strict: true, target: ts.ScriptTarget.ES2015, moduleResolution: ts.ModuleResolutionKind.NodeJs };
        const host = ts.createCompilerHost(options);
        const getSourceFile = host.getSourceFile.bind(host);
        host.getSourceFile = (file, languageVersion, onError) => file === filename ?
            ts.createSourceFile(file, source, languageVersion, true) : getSourceFile(file, languageVersion, onError);
        const program = ts.createProgram([filename], options, host);
        const diagnostics = ts.getPreEmitDiagnostics(program);
        assert.deepStrictEqual(diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')), []);
    });

    it('requests the V2 contract while retaining V1 access', async () => {
        const calls = [];
        const v1 = { invokeCommand: () => Promise.resolve(undefined) };
        const v2 = { invokeCommand: () => Promise.resolve({ status: 'exited', code: 0, signal: null, stdout: '', stderr: '' }) };
        const library = loadLibrary(() => ({
            activate: async () => ({
                get: (component, version) => {
                    calls.push([component, version]);
                    return { available: true, api: version === 'v2' ? v2 : v1 };
                }
            })
        }));
        assert.strictEqual((await library.extension.kubectl.v2).api, v2);
        assert.strictEqual((await library.extension.kubectl.v1).api, v1);
        assert.deepStrictEqual(await library.extension.get('kubectl', 'v2'), { available: true, api: v2 });
        assert.ok(calls.some(([component, version]) => component === 'kubectl' && version === 'v2'));
    });

    it('reports unsupported V2 without falling back to V1', async () => {
        const calls = [];
        const library = loadLibrary(() => ({
            activate: async () => ({
                get: (component, version) => {
                    calls.push([component, version]);
                    return version === 'v2' ? { available: false, reason: 'version-unknown' } : { available: true, api: {} };
                }
            })
        }));
        assert.deepStrictEqual(await library.extension.kubectl.v2, { available: false, reason: 'version-unknown' });
        assert.strictEqual(calls.filter(([component, version]) => component === 'kubectl' && version === 'v1').length, 1);
    });

    it('reports a missing extension', async () => {
        const library = loadLibrary(() => undefined);
        assert.deepStrictEqual(await library.extension.kubectl.v2, { available: false, reason: 'extension-not-available' });
    });
});
