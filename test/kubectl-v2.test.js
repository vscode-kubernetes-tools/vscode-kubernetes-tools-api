const assert = require('assert');
const Module = require('module');

function loadLibrary(getExtension) {
    delete require.cache[require.resolve('../js/index')];
    delete require.cache[require.resolve('../js/helper')];
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
    }
}

describe('Kubectl V2 accessors', () => {
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
