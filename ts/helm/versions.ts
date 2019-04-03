import { API } from '..';

import { HelmV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Helm API.
 */
export interface HelmAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Helm API.
     */
    readonly v1: Promise<API<HelmV1>>;
}
