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
     * @param options Options for port forwarding.
     * @returns A Disposable which can be used to terminate port forwarding, or undefined
     * if port forwarding failed.
     */
    portForward(podName: string, podNamespace: string | undefined, localPort: number, remotePort: number, options?: KubectlV1.PortForwardOptions): Promise<vscode.Disposable | undefined>;
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

    /**
     * Options for performing port forwarding using kubectl.
     */
    export interface PortForwardOptions {
        /**
         * Specifies whether and how to display the forwarded port in the Visual Studio
         * Code user interface. If not present, the forwarded port is not shown.
         */
        readonly showInUI?: PortForwardUIOptions;
    }

    /**
     * Specifies that the forwarded port should not be shown in the Visual Studio Code
     * user interface. This is equivalent to omitting the PortForwardOptions.showInUI property.
     */
    export interface PortForwardNoUIOptions {
        /**
         * Specifies that the port-forward should not be displayed in any location.
         */
        readonly location: 'none';
    }

    /**
     * Specifies that the forwarded port should be shown in the Visual Studio Code
     * status bar. When any forwarded ports have this set, the status bar displays
     * a "Kubectl Port Forwarding" indicator which the user can click to see a
     * list of active port-forwards.
     */
    export interface PortForwardStatusBarUIOptions {
        /**
         * Specifies the status bar as the display location.
         */
        readonly location: 'status-bar';
        /**
         * A string to be shown alongside the port-forward if the user displays the
         * list. This helps the user to identify the purpose of the port-forward.
         */
        readonly description?: string;
        /**
         * A function to be called if the user cancels port forwarding via the
         * list of active port-forwards. This can be used to clean up associated
         * state (for example, to note that the port will need to be re-forwarded
         * if the user wants to perform whatever operation was using the forwarded
         * port again), to provide information to the user, etc.
         */
        readonly onCancel?: () => void;
    }

    /**
     * Specifies whether and how to display a forwarded port in the Visual Studio
     * Code user interface.
     */
    export type PortForwardUIOptions = PortForwardNoUIOptions | PortForwardStatusBarUIOptions;
}
