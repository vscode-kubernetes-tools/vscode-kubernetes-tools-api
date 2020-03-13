import * as vscode from 'vscode';

/**
 * Provides methods for working with the Kubernetes extension's Cluster Explorer
 * tree view.
 */
export interface ClusterExplorerV2 {
    /**
     * Resolves a target passed to a command handler as part of a right-click on a node in the
     * Kubernetes extension's Cluster Explorer, converting it to a well-defined object.
     * @param target The object passed by Visual Studio Code as the command target.
     * @returns An object providing information about the type and properties of
     * the node that was right-clicked to invoke the command, or undefined if the command
     * target is not a Cluster Explorer node.
     * @example
        function onFooCommand(commandTarget?: any) {
        const node = clusterExplorer.resolveCommandTarget(commandTarget);
        if (!node) {
            // the command wasn't issued by right-clicking in the Cluster Explorer -
            // it's up to you to interpret it
            return;
        }
        if (node.nodeType === 'context') {
            console.log("You clicked cluster " + node.name);
        } else if (node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Deployment') {
            console.log("You clicked deployment/" + node.name);
        } else if (node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Pod') {
            console.log("You clicked pod/" + node.name);
        }
        }
     */
    resolveCommandTarget(target?: any): ClusterExplorerV2.ClusterExplorerNode | undefined;
    /**
     * Registers an object to add nodes to the Cluster Explorer.  The object will be
     * consulted every time the Kubernetes extension expands or refreshes the explorer.
     * @param nodeContributor An object which can add nodes to the Cluster Explorer.
     */
    registerNodeContributor(nodeContributor: ClusterExplorerV2.NodeContributor): void;
    /**
     * Exposes built-in node types for reuse as custom NodeContributors.
     */
    readonly nodeSources: ClusterExplorerV2.NodeSources;
    /**
     * Registers an object to customize the appearance of nodes in the Cluster Explorer.  The object will be
     * consulted every time the Kubernetes extension displays a tree node.
     * @param nodeUICustomizer An object which can customize the appearance of nodes in the Cluster Explorer.
     */
    registerNodeUICustomizer(nodeUICustomizer: ClusterExplorerV2.NodeUICustomizer): void;
    /**
     * Refreshes the Cluster Explorer.
     */
    refresh(): void;
}

export namespace ClusterExplorerV2 {
    /**
     * Provides logic for adding new nodes to the Cluster Explorer tree.
     */
    export interface NodeContributor {
        /**
         * Called by the Kubernetes extension to find out if this NodeContributor
         * may wish to add children to a particulcar parent node. This method should
         * be fast and synchronous, as it is called for all nodes; typically you
         * should just look at the parent type and properties to check if this is
         * one of the points at which you hook into the tree.
         * @param parent The node for which the object is being asked if is wants
         * to contribute children, or undefined when the object is being asked if
         * it wants to contribute to the top level (that is, the cluster list level).
         * @returns true if the object may want to contribute children. The Kubernetes
         * extension will call getChildren to determine if there are actually any
         * children present. false if the object will not want to contribute children:
         * in this case, getChildren will not be called.
         */
        contributesChildren(parent: ClusterExplorerV2.ClusterExplorerNode | undefined): boolean;
        /**
         * Called by the Kubernetes extension to get the children that you want to add to
         * a parent node. This is called only if the object has previously returned true
         * from contributesChildren for this parent, and when the user has expands
         * the parent node.
         * @param parent The node for which the object is being asked to provide children,
         * or undefined if the object is being asked to contribute to the top level (that is,
         * the cluster list level).
         * @returns An array of nodes to be added under the parent. Nodes are added after any
         * children created by the base extension or by previously registered NodeContributors.
         * It is okay to return an empty array.
         */
        getChildren(parent: ClusterExplorerV2.ClusterExplorerNode | undefined): Promise<Node[]>;
    }

    /**
     * Provides logic for customizing the appearance of nodes in the Cluster Explorer tree.
     */
    export interface NodeUICustomizer {
        /**
         * Called by the Kubernetes extension when rendering a node for display.
         * @param node The node whose appearance may be customized.
         * @param treeItem The TreeItem which will represent the node. You may set properties
         * on this TreeItem to alter how it is displayed.
         * @returns void if you do not wish to customize this node, or if you can complete
         * all customization synchronously; or a Thenable which completes once you have
         * completed asynchronous customization.
         */
        customize(node: ClusterExplorerNode, treeItem: vscode.TreeItem): void | Thenable<void>;
    }

    /**
     * A node which your extension wants to add to Cluster Explorer.
     */
    export interface Node {
        /**
         * Called by the Kubernetes extension to gets the children of this node.
         * @returns An array of children to be displayed under this node.
         */
        getChildren(): Promise<Node[]>;
        /**
         * Called by the Kubernetes extension to get a TreeItem describing how to
         * render this node.
         * @returns A TreeItem describing how to display this node.
         */
        getTreeItem(): vscode.TreeItem;
    }

    /**
     * A tree node representing a Kubernetes resource, such as a pod or service.
     *
     * For attaching commands to a resource node, the viewItem
     * context is `vsKubernetes.resource.${kind_abbreviation}`,
     * e.g. "vsKubernetes.resource.service" or "vsKubernetes.resource.namespace".  Use a regular
     * expression match in your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerResourceNode {
        /**
         * Identifies the node as representing a resource.
         */
        readonly nodeType: 'resource';
        /**
         * The namespace containing the resource.
         */
        readonly namespace: string | null;
        /**
         * The kind of the resource, such as pod or service.
         */
        readonly resourceKind: ResourceKind;
        /**
         * The name of the resource.
         */
        readonly name: string;
        /**
         * The metadata of the resource.
         */
        readonly metadata?: any;
    }

    /**
     * A tree node that groups other tree nodes but does not correspond to a specific
     * resource kind. For example, the 'Workloads' folder which contains other
     * folder nodes (for deployments, jobs, pods, etc.).
     *
     * For attaching commands to a grouping folder node, the viewItem contexts
     * are custom per folder.
     */
    export interface ClusterExplorerGroupingFolderNode {
        /**
         * Identifies the node as representing a grouping folder.
         */
        readonly nodeType: 'folder.grouping';
    }

    /**
     * A tree node representing the folder containing the resources of a particular type,
     * such as the Deployments folder.
     *
     * For attaching commands to a resource folder node,
     * the viewItem context for is "vsKubernetes.kind".  The context does not currently
     * allow distinguishing different resource folders (though for adding children you can
     * look at the resourceKind member).  Use a regular expression match in
     * your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerResourceFolderNode {
        /**
         * Identifies the node as representing a resource folder.
         */
        readonly nodeType: 'folder.resource';
        /**
         * The kind of resources contained in the folder.
         */
        readonly resourceKind: ResourceKind;
    }

    /**
     * A tree node representing the active Kubernetes context - that is, the cluster
     * currently selected in kubeconfig, plus the credentials to access that cluster.
     *
     * For attaching commands to a context node, the viewItem
     * context is "vsKubernetes.cluster" for normal clusters,
     * or "vsKubernetes.minikubeCluster" for Minikube clusters.
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerContextNode {
        /**
         * Identifies the node as representing a context.
         */
        readonly nodeType: 'context';
        /**
         * The name of the context.  Typically the name of the cluster, but users can
         * rename contexts if they wish.
         */
        readonly name: string;
    }

    /**
     * A tree node representing an inactive Kubernetes context - that is, a cluster NOT
     * currently selected in kubeconfig, plus the credentials to access that cluster.
     *
     * For attaching commands to a context node, the viewItem
     * context is "vsKubernetes.cluster.inactive" for normal clusters,
     * or "vsKubernetes.minikubeCluster.inactive" for Minikube clusters.
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerInactiveContextNode {
        /**
         * Identifies the node as representing an inactive context.
         */
        readonly nodeType: 'context.inactive';
        /**
         * The name of the context.  Typically the name of the cluster, but users can
         * rename contexts if they wish.
         */
        readonly name: string;
    }

    /**
     * A tree node representing a data item in a configuration resource (ConfigMap or Secret).
     *
     * For attaching commands to a config data item node, the viewItem context
     * is "vsKubernetes.file".  The context does not currently
     * allow distinguishing different containers or data item types.
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerConfigDataItemNode {
        /**
         * Identifies the node as representing a configuration item.
         */
        readonly nodeType: 'configitem';
        /**
         * The name of the data item.
         */
        readonly name: string;
    }

    /**
     * The tree node displayed when an error occurred expanding a node.
     *
     * This node does not have a viewItem context value.
     */
    export interface ClusterExplorerErrorNode {
        /**
         * Identifies the node as representing an error.
         */
        readonly nodeType: 'error';
    }

    /**
     * A tree node representing a Helm release.
     *
     * For attaching commands to a Helm release node,
     * the viewItem context is "vsKubernetes.helmRelease".
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface ClusterExplorerHelmReleaseNode {
        /**
         * Identifies the node as representing a Helm release.
         */
        readonly nodeType: 'helm.release';
        /**
         * The name of the Helm release.
         */
        readonly name: string;
    }

    /**
     * A tree node contributed by an extension.
     *
     * For attaching commands to contributed nodes, the viewItem context is determined
     * by the contributing extension; see that extension's documentation.
     */
    export interface ClusterExplorerExtensionNode {
        /**
         * Identifies the node as being contributed by an extension.
         */
        readonly nodeType: 'extension';
    }

    /**
     * A node in the Kubernetes extension's Clusters tree.
     */
    export type ClusterExplorerNode =
        ClusterExplorerResourceNode |
        ClusterExplorerGroupingFolderNode |
        ClusterExplorerResourceFolderNode |
        ClusterExplorerContextNode |
        ClusterExplorerInactiveContextNode |
        ClusterExplorerConfigDataItemNode |
        ClusterExplorerErrorNode |
        ClusterExplorerHelmReleaseNode |
        ClusterExplorerExtensionNode;

    /**
     * A Kubernetes resource kind, such as deployments or replica sets.
     */
    export interface ResourceKind {
        /**
         * The string identifying the kind in manifests, e.g. 'Deployment' or 'ReplicaSet'.
         */
        readonly manifestKind: string;
        /**
         * The string identifying the kind on the kubectl command line, e.g. 'deployment'
         * or 'rs'.  For example, 'kubectl get deployment', 'kubectl delete rs/foo'.
         */
        readonly abbreviation: string;

        readonly apiName?: string;
    }

    /**
     * Represents a source of tree nodes.
     */
    export interface NodeSource {
        /**
         * Creates a NodeContributor which contributes the nodes from the source at a
         * given location.
         * @param parentFolder The name of the folder under which the nodes should be contributed,
         * or undefined if the nodes should be contributed directly under the context tree node.
         * @returns A NodeContributor which, when registered, adds the nodes from the source
         * under the specified folder.
         */
        at(parentFolder: string | undefined): NodeContributor;
        /**
         * Creates a new NodeSource which will return the same node(s) as this, but
         * only if a condition holds.
         * @param condition The condition under which the new NodeSource will return node(s).
         * @returns A NodeSource which will return the same node(s) as this, but
         * only if the specified condition holds.
         */
        if(condition: () => boolean | Thenable<boolean>): NodeSource;
        /**
         * Gets tree nodes from the source.
         * @returns The set of tree nodes obtained from the source.
         */
        nodes(): Promise<Node[]>;
    }

    /**
     * Exposes built-in node types for reuse as custom NodeContributors.
     */
    export interface NodeSources {
        /**
         * A NodeSet consisting of a single folder node which, when expanded, shows all resources of a
         * specific type.
         * @param displayName The singular display name of the resource type. Example: Stateful Set.
         * @param pluralDisplayName The plural display name of the resource type - used as the folder display name. Example: Stateful Sets.
         * @param manifestKind The string used to identify the resource type in Kubernetes manifests. Example: StatefulSet.
         * @param abbreviation The string used to identify the resource type on the kubectl command line. Example: sts.
         * @param apiName The string used to identify the API URI in Kubernetes. Example: statefulsets.
         * @returns A NodeSet which provides the requested folder node.
         */
        resourceFolder(displayName: string, pluralDisplayName: string, manifestKind: string, abbreviation: string, apiName?: string): NodeSource;
        /**
         * A NodeSet consisting of a single folder node which, when expanded, displays an arbitrary set of nodes.
         * @param displayName The display name of the folder.
         * @param contextValue The context value for the folder's TreeItem, if you need to associate commands with the folder.
         * @param children The nodes to display under the grouping folder.
         * @returns A NodeSet which provides the requested folder node.
         */
        groupingFolder(displayName: string, contextValue: string | undefined, ...children: NodeSource[]): NodeSource;
    }
}
