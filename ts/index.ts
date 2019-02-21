import { ExtensionHelper } from './helper';
import { ClusterProviderAPI } from './clusterprovider/versions';
import { ClusterProviderV1 } from './clusterprovider/v1';

export { ClusterProviderAPI } from './clusterprovider/versions';
export { ClusterProviderV1 } from './clusterprovider/v1';

export const extension: Extension = new ExtensionHelper();

export interface Extension {
    getCore(component: string, version: string): Promise<API<any>>;
    get<T>(component: ComponentKey<T>, version: Version<T>): Promise<API<T>>;
    readonly clusterProvider: ClusterProviderAPI;
}

export const MS_KUBERNETES_EXTENSION_ID = "ms-kubernetes-tools.vscode-kubernetes.tools";

export interface APIUnavailable {
    readonly available: false;
    readonly reason: 'version-unknown'  // installed extension is so old it doesn't support your shiny new version
                    | 'version-removed'  // version is so old that the installed extension no longer supports it
                    | 'extension-not-available';  // extension does not appear to be installed
}

export interface APIAvailable<T> {
    readonly available: true;
    readonly api: T;
}

export type API<T> = APIAvailable<T> | APIUnavailable;

export interface APIKey<T> {
    readonly component: ComponentKey<T>;
    readonly version: Version<T>;
}

export interface APIBroker {
    get(component: string, version: string): API<any>;
}

export type ComponentKey<T> =
    T extends ClusterProviderV1 ? "clusterprovider" :
    "invalid_api_interface";

export type Version<T> =
    T extends ClusterProviderV1 ? "v1" :
    "invalid_api_interface";
