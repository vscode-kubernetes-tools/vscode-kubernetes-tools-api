import { API } from '..';

import { ClusterExplorerV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Explorer Tree API.
 */
export interface ClusterExplorerAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Explorer Tree API.
     */
    readonly v1: Promise<API<ClusterExplorerV1>>;
}
