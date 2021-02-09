import { API } from '..';

import { ConfigurationV1 } from './v1';
import { ConfigurationV1_1 } from './v1_1';

/**
 * Provides access to the Kubernetes extension's Configuration API.
 */
export interface ConfigurationAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Configuration API.
     */
    readonly v1: Promise<API<ConfigurationV1>>;

    /**
     * Provides access to v1_1 of the Kubernetes extension's Configuration API.
     */
    readonly v1_1: Promise<API<ConfigurationV1_1>>;
}
