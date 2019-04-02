/**
 * Supports invoking Helm using the Kubernetes extension's configuration
 * settings and user interface.
 */
export interface HelmV1 {
    /**
     * Invokes the Helm command line tool, using any path, version or
     * other configuration options defined by the Kubernetes extension.
     * @param command The Helm command line including all arguments, e.g.
     * "install stable/foo".
     * @returns The output of Helm, or undefined if the extension
     * could not invoke Helm.
     */
    invokeCommand(command: string): Promise<HelmV1.ShellResult | undefined>;
}

export namespace HelmV1 {
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
