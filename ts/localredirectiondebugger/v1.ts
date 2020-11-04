/**
 * Supports working with the Debug (Redirect locally) command.
 */
export interface LocalRedirectionDebuggerV1 {
    /**
     * Registers a local redirection debugger. The debugger will be invoked on user action
     * when the user selects the Debug (Redirect locally) command in the cluster explorer,
     * or when running the Debug (Redirect locally) command in the command palette. The
     * local redirection debugger wil show its own user interface once invoked.
     * @param localRedirectionDebugger The local redirection debugger to be registered.
     */
    register(localRedirectionDebugger: LocalRedirectionDebuggerV1.LocalRedirectionDebugger): void;
}

export namespace LocalRedirectionDebuggerV1 {
    /**
     * Represents a local redirection debugger - an object that provides a
     * user interface for working with a type of debugger redirecting the
     * traffic from the user's cluster to the local machine.
     */
    export interface LocalRedirectionDebugger {
        /**
         * A programmatic identifier for the local redirection debugger.
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
