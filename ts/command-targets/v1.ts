export interface CommandTargetsV1 {
    resolve(target?: any): CommandTargetsV1.CommandTarget | undefined;
}

export namespace CommandTargetsV1 {

    interface KubernetesExplorerNodeTarget {
        readonly targetType: 'kubernetes-explorer-node';
        readonly node: KubernetesExplorerNode;
    }

    export interface HelmExplorerNodeTarget {
        readonly targetType: 'helm-explorer-node';
    }

    export interface KubernetesExplorerResourceNode {
        readonly nodeType: 'resource';
        readonly namespace: string | null;
        readonly resourceKind: ResourceKind;
        readonly name: string;
        readonly metadata?: any;
    }

    export interface KubernetesExplorerGroupingFolderNode {
        readonly nodeType: 'folder.grouping';
    }

    export interface KubernetesExplorerResourceFolderNode {
        readonly nodeType: 'folder.resource';
        readonly resourceKind: string;
    }

    export interface KubernetesExplorerContextNode {
        readonly nodeType: 'context';
        readonly name: string;
    }

    export interface KubernetesExplorerConfigDataItemNode {
        readonly nodeType: 'configitem';
        readonly name: string;
    }

    export interface KubernetesExplorerErrorNode {
        readonly nodeType: 'error';
    }

    export interface KubernetesExplorerHelmReleaseNode {
        readonly nodeType: 'helm.release';
        readonly name: string;
    }

    export type KubernetesExplorerNode =
        KubernetesExplorerResourceNode |
        KubernetesExplorerGroupingFolderNode |
        KubernetesExplorerResourceFolderNode |
        KubernetesExplorerContextNode |
        KubernetesExplorerConfigDataItemNode |
        KubernetesExplorerErrorNode |
        KubernetesExplorerHelmReleaseNode;

    export type CommandTarget = KubernetesExplorerNodeTarget | HelmExplorerNodeTarget;

    export interface ResourceKind {
        readonly manifestKind: string;
        readonly abbreviation: string;
    }
}