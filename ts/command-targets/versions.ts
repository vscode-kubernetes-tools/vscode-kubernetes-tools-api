import { API } from '..';

import { CommandTargetsV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Command Targets API.
 */
export interface CommandTargetsAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Command Targets API.
     */
    readonly v1: Promise<API<CommandTargetsV1>>;
}
