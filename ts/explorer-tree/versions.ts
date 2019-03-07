import { API } from '..';

import { ExplorerTreeV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Explorer Tree API.
 */
export interface ExplorerTreeAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Explorer Tree API.
     */
    readonly v1: Promise<API<ExplorerTreeV1>>;
}
