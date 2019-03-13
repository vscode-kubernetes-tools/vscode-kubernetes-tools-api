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
