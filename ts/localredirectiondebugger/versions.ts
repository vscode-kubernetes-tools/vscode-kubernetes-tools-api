import { API } from '..';

import { LocalRedirectionDebuggerV1 } from './v1';

/**
 * Provides access to the Kubernetes extension's Local Redirection Debugger API.
 */
export interface LocalRedirectionDebuggerAPI {
    /**
     * Provides access to v1 of the Kubernetes extension's Local Redirection Debugger API.
     */
    readonly v1: Promise<API<LocalRedirectionDebuggerV1>>;
}
