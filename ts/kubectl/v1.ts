import * as vscode from 'vscode';

/**
 * Supports invoking kubectl using the Kubernetes extension's configuration
 * settings and user interface.
 */
export interface KubectlV1 {
    /**
     * Invokes the kubectl command line tool, using any path, version or
     * other configuration options defined by the Kubernetes extension.
     * @param command The kubectl command line including all arguments, e.g.
     * "get deploy/foo -o json".
     * @returns The output of kubectl, or undefined if the extension
     * could not invoke kubectl.
     */
    invokeCommand(command: string): Promise<KubectlV1.ShellResult | undefined>;

    /**
     * Forwards a local port to a port on a pod.
     * @param podName The pod to which to forward.
     * @param podNamespace The namespace containing the pod.
     * @param localPort The local port to be forwarded.
     * @param remotePort The port on the pod to which to forward.
     * @returns A Disposable which can be used to terminate port forwarding, or undefined
     * if port forwarding failed.
     */
    portForward(podName: string, podNamespace: string | undefined, localPort: number, remotePort: number): Promise<vscode.Disposable | undefined>;
}

export namespace KubectlV1 {
    /**
     * Represents the result of invoking another program via the shell.
     */
    export interface ShellResult {
        /**
         * The exit code of the invoked program.
         */
        readonly code: number;
        /**
         * The output of the invoked program, as printed to the standard output stream.
         */
        readonly stdout: string;
        /**
         * The error output of the invoked program, as printed to the standard error stream.
         */
        readonly stderr: string;
    }
}
