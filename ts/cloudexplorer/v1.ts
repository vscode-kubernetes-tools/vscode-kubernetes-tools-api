import * as vscode from 'vscode';

/**
 * Provides methods for working with the Kubernetes extension's Cloud Explorer
 * tree view.
 */
export interface CloudExplorerV1 {
    /**
     * Registers an object to add a cloud to Cloud Explorer.  The registered cloud will be
     * displayed at the top level of Cloud Explorer, and the provider will be called
     * to display cloud-specific resources under the cloud.
     * @param cloudProvider An object which can display cloud-specific information
     * in Cloud Explorer.
     */
    registerCloudProvider(cloudProvider: CloudExplorerV1.CloudProvider): void;
    /**
     * Resolves a target passed to a command handler as part of a right-click on a node in the
     * Kubernetes extension's Cloud Explorer, converting it to a well-defined object
     * from which you can extract your original resource object.
     * @param target The object passed by Visual Studio Code as the command target.
     * @returns An object providing information about the type and properties of
     * the node that was right-clicked to invoke the command, or undefined if the command
     * target is not a Cloud Explorer node.
     * @example
function onFooCommand(commandTarget?: any) {
  const node = cloudExplorer.resolveCommandTarget(commandTarget);
  if (!node) {
    // the command wasn't issued by right-clicking in the Cloud Explorer -
    // it's up to you to interpret it
    return;
  }
  if (node.nodeType === 'cloud') {
      console.log("You clicked cloud " + node.cloudName);
  } else if (node.nodeType === 'resource') {
      const cluster = node.cloudResource as ContosoCluster;
      console.log(`You clicked ${cluster.accountId}/${cluster.resourceKey}`);
  }
}
     */
    resolveCommandTarget(target?: any): CloudExplorerV1.CloudExplorerNode | undefined;
    /**
     * Refreshes the Cloud Explorer.
     */
    refresh(): void;
}

export namespace CloudExplorerV1 {
    /**
     * Provides logic for adding a cloud to the Cloud Explorer tree.
     */
    export interface CloudProvider {
        /**
         * The name of the cloud. This is displayed at the top level of Cloud Explorer.
         */
        readonly cloudName: string;
        /**
         * A TreeDataProvider containing the logic for populating the tree of cloud
         * resources under the top-level cloud entry.
         */
        readonly treeDataProvider: vscode.TreeDataProvider<any>;
        /**
         * Called by the Kubernetes extension when the user invokes the standard Merge into Kubeconfig
         * or Save Kubeconfig commands, to get the kubeconfig YAML to be merged or saved.
         * @param cluster The cluster whose kubeconfig the user wants to access. This will be an
         * object that was returned from treeDataProvider.getChildren and displayed with a context
         * that included the SHOW_KUBECONFIG_COMMANDS_CONTEXT context string.
         * @returns The kubeconfig YAML for accessing the cluster, or undefined to cancel the command.
         * (If an error occurs, your implementation should handle it and display any required
         * user feedback.)
         */
        getKubeconfigYaml(cluster: any): Promise<string | undefined>;
    }

    /**
     * A tree node representing a cloud in Cloud Explorer.
     */
    export interface CloudExplorerCloudNode {
        /**
         * Identifies the tree node as representing a cloud.
         */
        readonly nodeType: 'cloud';
        /**
         * The name of the cloud.
         */
        readonly cloudName: string;
    }

    /**
     * A tree node representing a cloud-specific resource in Cloud Explorer.
     */
    export interface CloudExplorerResourceNode {
        /**
         * Identifies the tree node as representing a cloud resource.
         */
        readonly nodeType: 'resource';
        /**
         * The name of the cloud containing the resource.
         */
        readonly cloudName: string;
        /**
         * The cloud resource data, as originally created by the cloud provider's TreeDataProvider.
         */
        readonly cloudResource: any;
    }

    /**
     * A node in the Kubernetes extension's Clouds tree.
     */
    export type CloudExplorerNode = CloudExplorerCloudNode | CloudExplorerResourceNode;

    /**
     * If you want the Kubernetes extension to provide the standard 'Merge into Kubeconfig'
     * and 'Save Kubeconfig' commands on a resource in your tree, include this string in
     * the tree item's contextValue.
     */
    export const SHOW_KUBECONFIG_COMMANDS_CONTEXT = "kubernetes.providesKubeconfig";
}
