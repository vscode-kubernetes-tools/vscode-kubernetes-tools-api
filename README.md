# API Library for Visual Studio Code Kubernetes Tools

A NPM package providing documentation and helpers for using the [Kubernetes extension for Visual
Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
in your own VS Code extensions.  You can use this to:

* Add nodes to the Cluster Explorer tree
* Add custom commands to the Cluster Explorer
* Customise the appearance of the Cluster Explorer
* Invoke `kubectl` features in a way that's consistent with the core extension
* Integrate additional clouds or other Kubernetes environments into the extension

The package includes TypeScript type declarations and JSDoc comments.  For usage information and
samples, see https://aka.ms/vscodekubeapi.

# Example usage

```javascript
// Using TypeScript for sample purposes but it all works in JavaScript too!

import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('k8stop.top', showResourceUsage);
    context.subscriptions.push(disposable);
}

async function showResourceUsage(target?: any): Promise<void> {
    // Standard pattern for accessing the APIs
    const explorer = await k8s.extension.clusterExplorer.v1_1;
    if (!explorer.available) {
        vscode.window.showErrorMessage(`Command not available: ${explorer.reason}`);
        return;
    }
    const kubectl = await k8s.extension.kubectl.v2;
    if (!kubectl.available) {
        vscode.window.showErrorMessage(`kubectl not available: ${kubectl.reason}`);
        return;
    }

    // Example of using the Cluster Explorer API to figure out what was clicked
    const node = explorer.api.resolveCommandTarget(target);
    if (node && node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Node') {

        // Example of using the kubectl API to invoke a command
        const topResult = await kubectl.api.invokeCommand(['top', 'node', '--', node.name]);

        if (topResult.status !== 'exited' || topResult.code !== 0) {
            vscode.window.showErrorMessage("Can't get resource usage");
            return;
        }
        const topCommandOutput = topResult.stdout;
        // show topCommandOutput as required;
    }
}
```

## Shell-free kubectl API (V2)

Request `k8s.extension.kubectl.v2` or `k8s.extension.get<k8s.KubectlV2>('kubectl', 'v2')`.
Older extension versions return `version-unknown`. Ask the user to update rather
than falling back to the shell-based V1 API for dynamic values. V1 is unchanged.

Pass each argument as one array entry, without shell quotes or escaping. Put
remote commands after kubectl's `--` separator. Do not join the array or split an
existing command string. Argument separation prevents shell interpretation, but
callers must still validate identifiers and avoid treating values as options.

`invokeCommand` preserves stdout and stderr, including whitespace, on successful
and nonzero exits. Check `status` first: `exited` includes the numeric `code` and
`signal`; `failed` includes a structured `reason`, message, and optional OS
`errorCode`; `cancelled` records cancellation. Signal termination has code `-1`.
Failure and cancellation results include any buffered output already received.
Each output stream defaults to a 20 MiB limit, configurable through
`maxBufferBytes`; exceeding it stops the process with `reason: 'output-limit'`.

For long-running commands, pass `onStdout` and `onStderr` callbacks in the
`observeCommand` options. They are installed before launch and deliver UTF-8 chunks,
not complete lines. Streaming does not retain output or apply the buffered output
limit. Await `result` for
structured completion; it does not include stdout or stderr. Call `dispose()` or
pass `cancellationToken` to stop a command. Cancellation propagates through
auto-version bootstrap commands and waits for owned process cleanup. Shared tool
downloads may still finish; they are not cancelled for other callers.

```typescript
const command = kubectl.api.observeCommand(['logs', 'pod-name', '--follow'], {
    onStdout: (chunk) => output.append(chunk),
    onStderr: (chunk) => output.append(chunk),
    cancellationToken,
});
const completion = await command.result;
```

V2 also provides `portForward(podName, namespace, localPort, remotePort, options)`.
Check for `status: 'ready'` and use the returned `session` to dispose forwarding
or await its `result`. Other statuses describe startup completion or cancellation.
Options preserve `showInUI` status-bar registration, `description`, and `onCancel`,
and add `cancellationToken` and a positive readiness `timeoutMs` (default 10000).
Both IPv4 and IPv6 loopback readiness messages are supported. UI registration is
removed when the session completes.

Both methods accept `stdin` and close the input stream when it has been sent.
They use the extension's selected kubectl, kubeconfig environment, and WSL mode.
WSL uses `wsl.exe --exec` without a shell. Native Windows `.cmd`/`.bat` wrappers
are rejected with `reason: 'invalid-executable'`; configure `kubectl.exe` instead.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
