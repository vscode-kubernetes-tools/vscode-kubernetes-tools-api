import { ExtensionHelper } from './helper';
import { ClusterProviderAPI } from './clusterprovider/versions';
import { ClusterProviderV1 } from './clusterprovider/v1';
import { KubectlAPI } from './kubectl/versions';
import { KubectlV1 } from './kubectl/v1';
import { ClusterExplorerAPI } from './cluster-explorer/versions';
import { ClusterExplorerV1 } from './cluster-explorer/v1';
import { ClusterExplorerV1_1 } from './cluster-explorer/v1_1';
import { HelmAPI } from './helm/versions';
import { HelmV1 } from './helm/v1';
import { CloudExplorerAPI } from './cloudexplorer/versions';
import { CloudExplorerV1 } from './cloudexplorer/v1';
import { ConfigurationAPI } from './configuration/versions';
import { ConfigurationV1 } from './configuration/v1';
import { ConfigurationV1_1 } from './configuration/v1_1';

export { ClusterProviderAPI } from './clusterprovider/versions';
export { ClusterProviderV1 } from './clusterprovider/v1';

export { KubectlAPI } from './kubectl/versions';
export { KubectlV1 } from './kubectl/v1';

export { ClusterExplorerAPI } from './cluster-explorer/versions';
export { ClusterExplorerV1 } from './cluster-explorer/v1';
export { ClusterExplorerV1_1 } from './cluster-explorer/v1_1';

export { HelmAPI } from './helm/versions';
export { HelmV1 } from './helm/v1';

export { CloudExplorerAPI } from './cloudexplorer/versions';
export { CloudExplorerV1 } from './cloudexplorer/v1';

export { ConfigurationAPI } from './configuration/versions';
export { ConfigurationV1 } from './configuration/v1';

/**
 * Provides convenient access to the Kubernetes extension's API.
 * @example
 * import * as k8s from 'vscode-kubernetes-tools-api';
 * const clusterProviderAPI = await k8s.extension.clusterProvider.v1;
 */
export const extension: Extension = new ExtensionHelper();

export { MS_KUBERNETES_EXTENSION_ID } from './constants';

/**
 * Provides convenient access to the Kubernetes extension's API.
 */
export interface Extension {
    /**
     * Accesses a specific API version within the Kubernetes extension in a weakly typed way.
     * This differs from 'get' in that the TypeScript compiler will not infer the type of
     * the returned API from the component and version. You do not normally need to call this
     * method directly; in most cases you should use 'get'or one of the pre-defined accessors
     * instead.
     * @param component The component whose API you want to access.
     * @param version The version of the component API you want to access.
     * @returns An object containing either the API, or an indication of why the
     * API is not available.
     */
    getCore(component: string, version: string): Promise<API<any>>;
    /**
     * Accesses a specific API version within the Kubernetes extension. You do not normally need
     * to call this method directly: in most cases you should use one of the pre-defined accessors
     * instead.
     * @param component The component whose API you want to access.
     * @param version The version of the component API you want to access.
     * @returns An object containing either the API, or an indication of why the
     * API is not available.
     */
    get<T>(component: ComponentKey<T>, version: Version<T>): Promise<API<T>>;
    /**
     * Provides access to the Kubernetes extension's Cluster Provider API.
     */
    readonly clusterProvider: ClusterProviderAPI;
    /**
     * Provides access to the Kubernetes extension's Kubectl API.
     */
    readonly kubectl: KubectlAPI;
    /**
     * Provides access to the Kubernetes extension's Cluster Explorer API.
     */
    readonly clusterExplorer: ClusterExplorerAPI;
    /**
     * Provides access to the Kubernetes extension's Helm API.
     */
    readonly helm: HelmAPI;
    /**
     * Provides access to the Kubernetes extension's Cloud Explorer API.
     */
    readonly cloudExplorer: CloudExplorerAPI;
    /**
     * Provides access to the Kubernetes extension's Configuration API.
     */
    readonly configuration: ConfigurationAPI;
}

/**
 * The result of unsuccessfully requesting an API from the Kubernetes extension.
 */
export interface APIUnavailable {
    /**
     * Contains the boolean value false, indicating that the requested API was unavailable.
     */
    readonly available: false;
    /**
     * The reason the API was unavailable.  This may be:
     * * 'version-unknown': The installed version of the extension does not know about the API
     *   you requested. This means the installed version is older than the API you are asking for.
     *   Typically you can prompt the user to upgrade the Kubernetes extension.
     * * 'version-removed': The installed version of the extension no longer supports the API
     *   you requested. This means you are asking for a version so old that it has been retired.
     *   You might prompt the user to upgrade *your* extension.
     * * 'extension-not-available': Visual Studio Code could not activate the Kubernetes extension,
     *   for example because it was not installed. Your extension should declare the Kubernetes
     *   extension as a dependency; you can also prompt the user to install the Kubernetes extension.
     */
    readonly reason: 'version-unknown'  // installed extension is so old it doesn't support your shiny new version
                    | 'version-removed'  // version is so old that the installed extension no longer supports it
                    | 'extension-not-available';  // extension does not appear to be installed
}

/**
 * The result of successfully requesting an API from the Kubernetes extension.
 */
export interface APIAvailable<T> {
    /**
     * Contains the boolean value true, indicating that the requested API was available.
     */
    readonly available: true;
    /**
     * The API interface from the Kubernetes extension.
     */
    readonly api: T;
}

/**
 * The result of requesting an API from the Kubernetes extension - either the API object,
 * or an indication of why the API is not available. Use the 'available' property to
 * distinguish the two cases.
 */
export type API<T> = APIAvailable<T> | APIUnavailable;

/**
 * The type of the Kubernetes extension's raw API. You will not normally use this
 * directly: it is generally more convenient to use the 'extension' wrapper object.
 * But if you activate the extension directly using the Visual Studio Code
 * extensions API, then the result of that will be an APIBroker instance.
 */
export interface APIBroker {
    /**
     * Gets an API object for a particular version of a particular component within
     * the Kubernetes extension.
     * @param component The component whose API you want to access.
     * @param version The version of the component API that you want to access.
     */
    get(component: string, version: string): API<any>;
}

/**
 * A TypeScript type associating Kubernetes extension API component IDs with
 * API interface types in this package.
 */
export type ComponentKey<T> =
    T extends ClusterProviderV1 ? "clusterprovider" :
    T extends KubectlV1 ? "kubectl" :
    T extends ClusterExplorerV1 | ClusterExplorerV1_1 ? "clusterexplorer" :
    T extends HelmV1 ? "helm" :
    T extends CloudExplorerV1 ? "cloudexplorer" :
    T extends ConfigurationV1 ? "configuration" :
    "invalid_api_interface";

/**
 * A TypeScript type associating Kubernetes extension API version IDs with
 * API interface types in this package.
 */
export type Version<T> =
    T extends ClusterProviderV1 ? "v1" :
    T extends KubectlV1 ? "v1" :
    T extends ClusterExplorerV1 | ClusterExplorerV1_1 ? "v1" | "v1_1" :
    T extends HelmV1 ? "v1" :
    T extends CloudExplorerV1 ? "v1" :
    T extends ConfigurationV1 | ConfigurationV1_1 ? "v1" |  "v1_1":
    "invalid_api_interface";
