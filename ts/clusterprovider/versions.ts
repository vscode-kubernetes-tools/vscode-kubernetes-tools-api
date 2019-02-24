import { APIKey, API } from '..';

import { ClusterProviderV1 } from './v1';

/**
 * A key identifying v1 of the Kubernetes extension's Cluster Provider API.
 */
export const CLUSTER_PROVIDER_V1: APIKey<ClusterProviderV1> = { component: "clusterprovider", version: "v1" };

/**
 * Provides access to the Kubernetes extension's Cluster Provider API.
 */
export interface ClusterProviderAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Cluster Provider API.
     */
    readonly v1: Promise<API<ClusterProviderV1>>;
}
