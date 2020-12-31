import * as vscode from 'vscode';
import { Extension, APIBroker, API, ComponentKey, Version } from '.';
import { MS_KUBERNETES_EXTENSION_ID } from './constants';
import { ClusterProviderV1 } from './clusterprovider/v1';
import { KubectlV1 } from './kubectl/v1';
import { ClusterExplorerV1 } from './cluster-explorer/v1';
import { HelmV1 } from './helm/v1';
import { CloudExplorerV1 } from './cloudexplorer/v1';
import { ConfigurationV1 } from './configuration/v1';
import { ClusterExplorerV1_1 } from './cluster-explorer/v1_1';
import { LocalTunnelDebuggerV1 } from './localtunneldebugger/v1';

class Lazy<T> {
    private value: T | undefined = undefined;
    constructor(private readonly fn: () => T) {}
    get(): T {
        if (this.value === undefined) {
            this.value = this.fn();
        }
        return this.value;
    }
}

export class ExtensionHelper implements Extension {
    private readonly apiBroker = new Lazy<Promise<APIBroker | undefined>>(() => getBroker());
    async getCore(component: string, version: string): Promise<API<any>> {
        const apiBroker = await this.apiBroker.get();
        if (!apiBroker) {
            return { available: false, reason: "extension-not-available" };
        }
        if (!apiBroker.get) {
            return { available: false, reason: "version-unknown" };
        }
        return apiBroker.get(component, version);
    }
    async get<T>(component: ComponentKey<T>, version: Version<T>): Promise<API<T>> {
        const api = await this.getCore(component, version);
        return api as API<T>;
    }
    readonly clusterProvider = readonlify({
        v1: this.get<ClusterProviderV1>("clusterprovider", "v1"),
    });
    readonly kubectl = readonlify({
        v1: this.get<KubectlV1>("kubectl", "v1"),
    });
    readonly clusterExplorer = readonlify({
        v1: this.get<ClusterExplorerV1>("clusterexplorer", "v1"),
        v1_1: this.get<ClusterExplorerV1_1>("clusterexplorer", "v1_1"),
    });
    readonly helm = readonlify({
        v1: this.get<HelmV1>("helm", "v1"),
    });
    readonly cloudExplorer = readonlify({
        v1: this.get<CloudExplorerV1>("cloudexplorer", "v1"),
    });
    readonly configuration = readonlify({
        v1: this.get<ConfigurationV1>("configuration", "v1"),
    });
    readonly localTunnelDebugger = readonlify({
        v1: this.get<LocalTunnelDebuggerV1>("localtunneldebugger", "v1"),
    });
}

function readonlify<T>(t: T): Readonly<T> {
    return t;
}

async function getBroker(): Promise<APIBroker | undefined> {
    const extension = vscode.extensions.getExtension<APIBroker>(MS_KUBERNETES_EXTENSION_ID);
    if (!extension) {
        return undefined;
    }
    const apiBroker = await extension.activate();
    return apiBroker;
}
