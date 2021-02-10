import { Event } from 'vscode';

/* eslint-disable camelcase */

/**
 * Exposes the Kubernetes extension's Configuration settings.
 */
export interface ConfigurationV1_1 {
    /**
     * Gets the path for the kubeconfig currently in use.
     * @returns a KubeconfigPath designating the environment the path relates to, and the path.
     */
    getKubeconfigPath(): ConfigurationV1_1.KubeconfigPath;

    /**
     * Raised when the Kubernetes extension detects that the user has switched
     * to a different kubeconfig file.
     *
     * This event is heuristic: if the user makes the change using tools other
     * than the Kubernetes extension, it may be raised late or not at all.
     */
    readonly onDidChangeKubeconfigPath: Event<ConfigurationV1_1.KubeconfigPath>;
    /**
     * Raised when the Kubernetes extension detects that the user has switched
     * to a different Kubernetes context.
     *
     * This event is heuristic: if the user makes the change using tools other
     * than the Kubernetes extension, it may be raised late or not at all.
     */
    readonly onDidChangeContext: Event<string | null>;
    /**
     * Raised when the Kubernetes extension detects that the user has switched
     * to a different Kubernetes namespace.
     *
     * This event is heuristic: if the user makes the change using tools other
     * than the Kubernetes extension, it may be raised late or not at all.
     */
    readonly onDidChangeNamespace: Event<string>;
}

export namespace ConfigurationV1_1 {

    /**
     * Represents the path to the kubeconfig on the host machine.
     */
    export interface HostKubeconfigPath {
        /**
         * The environment the path relates to.
         */
        readonly pathType: 'host';
        /**
         * The path to the kubeconfig.
         */
        readonly hostPath: string;
    }

    /**
     * Represents the path to the kubeconfig on WSL.
     */
    export interface WSLKubeconfigPath {
        /**
         * The environment the path relates to.
         */
        readonly pathType: 'wsl';
        /**
         * The path to the kubeconfig.
         */
        readonly wslPath: string;
    }

    export type KubeconfigPath = HostKubeconfigPath | WSLKubeconfigPath;
}
