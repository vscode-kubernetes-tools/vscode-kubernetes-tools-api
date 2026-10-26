import { API } from '..';

import { KubectlV1 } from './v1';
import { KubectlV2 } from './v2';

/**
 * Provides access to the Kubernetes extension's Kubectl API.
 */
export interface KubectlAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Kubectl API.
     */
    readonly v1: Promise<API<KubectlV1>>;
    /** Provides shell-free argument-array execution and streaming. */
    readonly v2: Promise<API<KubectlV2>>;
}
