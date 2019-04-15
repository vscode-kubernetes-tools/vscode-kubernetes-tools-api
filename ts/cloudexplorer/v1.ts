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
     * If you want the Kubernetes extension to provide the standard 'Merge into Kubeconfig'
     * and 'Save Kubeconfig' commands on a resource in your tree, include this string in
     * the tree item's contextValue.
     */
    export const SHOW_KUBECONFIG_COMMANDS_CONTEXT = "kubernetes.providesKubeconfig";
}
