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
    const kubectl = await k8s.extension.kubectl.v1;
    if (!kubectl.available) {
        vscode.window.showErrorMessage(`kubectl not available: ${kubectl.reason}`);
        return;
    }

    // Example of using the Cluster Explorer API to figure out what was clicked
    const node = explorer.api.resolveCommandTarget(target);
    if (node && node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Node') {

        // Example of using the kubectl API to invoke a command
        const topResult = await kubectl.api.invokeCommand(`top node ${node.name}`);

        if (!topResult || topResult.code !== 0) {
            vscode.window.showErrorMessage(`Can't get resource usage: ${topResult ? topResult.stderr : 'unable to run kubectl'}`);
            return;
        }
        const topCommandOutput = topResult.stdout;
        // show topCommandOutput as required;
    }
}
```

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
