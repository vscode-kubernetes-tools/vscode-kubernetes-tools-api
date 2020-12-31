import { API } from '..';

import { LocalTunnelDebuggerV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Local Tunnel Debugger API.
 */
export interface LocalTunnelDebuggerAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Local Tunnel Debugger API.
     */
    readonly v1: Promise<API<LocalTunnelDebuggerV1>>;
}
