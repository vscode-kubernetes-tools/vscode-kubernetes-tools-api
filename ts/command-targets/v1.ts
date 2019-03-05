/**
 * Supports identifying command targets from the Kubernetes extension, specifically
 * for commands on the right-click menus of tree nodes.
 */
export interface CommandTargetsV1 {
    /**
     * Resolves a target passed to a command handler as part of a right-click on a node in the
     * Kubernetes extension's tree view, converting it to a well-defined object.
     * @param target The object passed by Visual Studio Code as the command target.
     * @returns An object providing information about the type and properties of
     * the node that was right-clicked to invoke the command, or undefined if the target
     * was not defined by the Kubernetes extension's tree view.
     * @example
function onFooCommand(commandTarget?: any) {
  const target = commandTargets.resolve(commandTarget);
  if (!target) {
    // the command wasn't issued by right-clicking in the k8s extension tree -
    // it's up to you to interpret it
    return;
  }
  if (target.targetType === 'kubernetes-explorer-node') {
    // it's a node from the clusters tree
    const node = target.node;
    if (node.nodeType === 'context') {
      console.log("You clicked cluster " + node.name);
    } else if (node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Deployment') {
      console.log("You clicked deployment/" + node.name);
    } else if (node.nodeType === 'resource' && node.resourceKind.manifestKind === 'Pod') {
      console.log("You clicked pod/" + node.name);
    }
  }
}
     */
    resolve(target?: any): CommandTargetsV1.CommandTarget | undefined;
}

export namespace CommandTargetsV1 {

    /**
     * A command target which is a node in the Kubernetes extension's Clusters tree.
     */
    interface KubernetesExplorerNodeTarget {
        /**
         * Identifies the target as a node in the Kubernetes extension's Clusters tree.
         */
        readonly targetType: 'kubernetes-explorer-node';
        /**
         * Contains information about the type and properties of the target node.
         */
        readonly node: KubernetesExplorerNode;
    }

    /**
     * A command target which is a node in the Kubernetes extension's Helm Repos tree.
     */
    export interface HelmExplorerNodeTarget {
        /**
         * Identifies the target as a node in the Kubernetes extension's Helm Repos tree.
         */
        readonly targetType: 'helm-explorer-node';
    }

    /**
     * A tree node representing a Kubernetes resource, such as a pod or service.
     *
     * The viewItem context for such a node is `vsKubernetes.resource.${kind_abbreviation}`,
     * e.g. "vsKubernetes.resource.service" or "vsKubernetes.resource.namespace".  Use a regular
     * expression match in your 'when' clause for forward compatibility.
     */
    export interface KubernetesExplorerResourceNode {
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
     * The viewItem contexts for such nodes are custom per folder.
     */
    export interface KubernetesExplorerGroupingFolderNode {
        /**
         * Identifies the node as representing a grouping folder.
         */
        readonly nodeType: 'folder.grouping';
    }

    /**
     * A tree node representing the folder containing the resources of a particular type,
     * such as the Deployments folder.
     *
     * The viewItem context for such a node is "vsKubernetes.kind".  The context does not currently
     * allow distinguishing different resource folders.  Use a regular expression match in
     * your 'when' clause for forward compatibility.
     */
    export interface KubernetesExplorerResourceFolderNode {
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
     * A tree node representing a Kubernetes context - that is, a cluster plus the credentials
     * to access that cluster.
     *
     * The viewItem context for such a node is "vsKubernetes.cluster" for normal clusters,
     * or "vsKubernetes.minikubeCluster" for Minikube clusters.  If the cluster is not the
     * active cluster, then the context also has a ".inactive" suffix, e.g. "vsKubernetes.cluster.inactive".
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface KubernetesExplorerContextNode {
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
     * A tree node representing a data item in a configuration resource (ConfigMap or Secret).
     *
     * The viewItem context for such a node is "vsKubernetes.file".  The context does not currently
     * allow distinguishing different containers or data item types.
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface KubernetesExplorerConfigDataItemNode {
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
    export interface KubernetesExplorerErrorNode {
        /**
         * Identifies the node as representing an error.
         */
        readonly nodeType: 'error';
    }

    /**
     * A tree node representing a Helm release.
     *
     * The viewItem context for such a node is "vsKubernetes.helmRelease".
     * Use a regular expression match in your 'when' clause for forward compatibility.
     */
    export interface KubernetesExplorerHelmReleaseNode {
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
     * A node in the Kubernetes extension's Clusters tree.
     */
    export type KubernetesExplorerNode =
        KubernetesExplorerResourceNode |
        KubernetesExplorerGroupingFolderNode |
        KubernetesExplorerResourceFolderNode |
        KubernetesExplorerContextNode |
        KubernetesExplorerConfigDataItemNode |
        KubernetesExplorerErrorNode |
        KubernetesExplorerHelmReleaseNode;

    /**
     * A command target which is a node in the Kubernetes extension's tree view.
     */
    export type CommandTarget = KubernetesExplorerNodeTarget | HelmExplorerNodeTarget;

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
    }
}
