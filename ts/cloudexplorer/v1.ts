import * as vscode from 'vscode';

export interface CloudExplorerV1 {
    registerCloudProvider(cloudProvider: CloudExplorerV1.CloudProvider): void;
    refresh(): void;
}

export namespace CloudExplorerV1 {
    export interface CloudProvider {
        readonly cloudName: string;
        readonly treeDataProvider: vscode.TreeDataProvider<any>;
    }
}
