import { API } from '..';

import { ConfigurationV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Configuration API.
 */
export interface ConfigurationAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Configuration API.
     */
    readonly v1: Promise<API<ConfigurationV1>>;
}
