import * as vscode from 'vscode';
import { Extension, APIBroker, API, ComponentKey, Version } from '.';
import { MS_KUBERNETES_EXTENSION_ID } from './constants';
import { ClusterProviderV1 } from './clusterprovider/v1';

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
        return apiBroker.get(component, version);
    }
    async get<T>(component: ComponentKey<T>, version: Version<T>): Promise<API<T>> {
        const api = await this.getCore(component, version);
        return api as API<T>;
    }
    readonly clusterProvider = readonlify({
        v1: this.get<ClusterProviderV1>("clusterprovider", "v1"),
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
