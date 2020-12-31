/**
 * Supports working with the Debug (Redirect locally) command.
 */
export interface LocalTunnelDebuggerV1 {
    /**
     * Registers a local tunnel debugger. The debugger will be invoked on user action
     * when the user selects the Debug (Redirect locally) command in the cluster explorer,
     * or when running the Debug (Redirect locally) command in the command palette. The
     * local tunnel debugger wil show its own user interface once invoked.
     * @param localTunnelDebugger The local tunnel debugger to be registered.
     */
    registerLocalTunnelDebugProvider(localTunnelDebugger: LocalTunnelDebuggerV1.LocalTunnelDebugger): void;

    /**
     * Checks if at least one local tunnel debug provider has been registered, and if
     * so calls the debuggers' startDebugging method.
     * @param target The object passed by Visual Studio Code as the command target. If a
     * local tunnel debugger has been installed, this target will be passed to the
     * debugger's startDebugging method.
     */
    startLocalTunnelDebugProvider(target?: any): void;
}

export namespace LocalTunnelDebuggerV1 {
    /**
     * Represents a local tunnel debugger - an object that provides a
     * user interface for working with a type of debugger redirecting the
     * traffic from the user's cluster to the local machine.
     */
    export interface LocalTunnelDebugger {
        /**
         * A programmatic identifier for the local tunnel debugger.
         */
        readonly id: string;
        /**
         * Invoked by the Kubernetes extension on user action to start
         * the debugger on the targeted node.
         * @param target The object passed by Visual Studio Code as the
         * command target. Use the cluster explorer API to resolve this
         * target (resolveCommandTarget method). This parameter will be
         * undefined if the debugging action is initiated through the
         * Visual Studio command palette.
         */
        startDebugging(target?: any): void;
    }
}
