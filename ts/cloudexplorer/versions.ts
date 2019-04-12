import { API } from '..';

import { CloudExplorerV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Cloud Explorer API.
 */
export interface CloudExplorerAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Cloud Explorer API.
     */
    readonly v1: Promise<API<CloudExplorerV1>>;
}
