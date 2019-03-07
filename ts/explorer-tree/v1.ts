import * as vscode from 'vscode';

import { CommandTargetsV1 } from "../command-targets/v1";

export interface ExplorerTreeV1 {
    registerNodeContributor(nodeContributor: ExplorerTreeV1.NodeContributor): void;
}

export namespace ExplorerTreeV1 {
    export interface NodeContributor {
        contributesChildren(parent: CommandTargetsV1.KubernetesExplorerNode | undefined): boolean;
        getChildren(parent: CommandTargetsV1.KubernetesExplorerNode | undefined): Promise<Node[]>;
    }

    export interface Node {
        getChildren(): Promise<Node[]>;
        getTreeItem(): vscode.TreeItem;
    }
}
