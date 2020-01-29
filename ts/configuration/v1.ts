/**
 * Exposes the Kubernetes extension's Configuration settings
 */
export interface ConfigurationV1 {
    /**
     * Gets the path for the kubeconfig currently in use.
     * @returns a KubeconfigPath designating the environment the path relates to, and the path.
     */
    getKubeconfigPath(): ConfigurationV1.KubeconfigPath;
}

export namespace ConfigurationV1 {
    /**
     * Represents the path to the kubeconfig on the host machine.
     */
    export interface HostKubeconfigPath {
        /**
         * The environment the path relates to
         */
        readonly pathType: 'host';
        /**
         * The path to the kubeconfig
         */
        hostPath: string;
    }

    /**
     * Represents the path to the kubeconfig on WSL.
     */
    export interface WslKubeconfigPath {
        /**
         * The environment the path relates to
         */
        readonly pathType: 'wsl';
        /**
         * The path to the kubeconfig
         */
        wslPath: string;
    }

    export type KubeconfigPath = HostKubeconfigPath | WslKubeconfigPath;
}
