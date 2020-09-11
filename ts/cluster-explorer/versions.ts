import { API } from '..';

import { ClusterExplorerV1 } from './v1';
import { ClusterExplorerV1_1 } from './v1_1';
import { ClusterExplorerV1_2 } from './v1_2';

/**
 * Provides access to the Kubernetes extension's Explorer Tree API.
 */
export interface ClusterExplorerAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Explorer Tree API.
     */
    readonly v1: Promise<API<ClusterExplorerV1>>;

    /**
     * Provides access to v1_1 of the Kubernetes extension's Explorer Tree API.
     */
    readonly v1_1: Promise<API<ClusterExplorerV1_1>>;

    /**
     * Provides access to v1_2 of the Kubernetes extension's Explorer Tree API.
     */
    readonly v1_2: Promise<API<ClusterExplorerV1_2>>;
}
