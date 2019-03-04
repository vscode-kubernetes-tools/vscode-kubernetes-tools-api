export interface KubectlV1 {
    invokeCommand(command: string): Promise<KubectlV1.ShellResult | undefined>;
}

export namespace KubectlV1 {
    export interface ShellResult {
        readonly code: number;
        readonly stdout: string;
        readonly stderr: string;
    }
}
