import { API } from '..';

import { ClusterProviderV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Cluster Provider API.
 */
export interface ClusterProviderAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Cluster Provider API.
     */
    readonly v1: Promise<API<ClusterProviderV1>>;
}
