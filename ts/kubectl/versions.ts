import { API } from '..';

import { KubectlV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Kubectl API.
 */
export interface KubectlAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Kubectl API.
     */
    readonly v1: Promise<API<KubectlV1>>;
}
