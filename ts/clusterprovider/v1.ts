/**
 * Supports working with the Add Existing Cluster and Create Cluster
 * commands.
 */
export interface ClusterProviderV1 {
    /**
     * Registers a cluster type for a cloud or other environment.  The cluster provider
     * will be displayed in the cloud selection step of the Add Existing Cluster and/or
     * Create Cluster wizard, and if selected will be prompted to show its own user interface
     * for filling in details.
     * @param clusterProvider The cluster provider to be registered.
     */
    register(clusterProvider: ClusterProviderV1.ClusterProvider): void;
    /**
     * Lists registered cluster providers.
     * @returns The cluster types registered for the Add Existing Cluster and Create Cluster
     * commands.
     */
    list(): ReadonlyArray<ClusterProviderV1.ClusterProvider>;
}

export namespace ClusterProviderV1 {

    export type ClusterProviderAction = 'create' | 'configure';

    export interface ClusterProvider {
        readonly id: string;
        readonly displayName: string;
        readonly supportedActions: ClusterProviderAction[];
        next(wizard: Wizard, action: ClusterProviderAction, message: any): void;
    }

    export interface Wizard {
        showPage(htmlBody: Sequence<string>): Promise<void>;
    }

    export interface Observable<T> {
        subscribe(observer: Observer<T>): void;
    }

    export interface Observer<T> {
        onNext(value: T): Promise<boolean>;
    }

    export type Sequence<T> = T | Thenable<T> | Observable<T>;

    export const WIZARD_FORM_NAME = "form";

    export const NEXT_PAGE_FN_NAME = "onNext";
    export const NEXT_PAGE = "onNext();";

    export const CLUSTER_TYPE_KEY = 'clusterType';

    export const SENDING_STEP_KEY = 'sendingStep';
    export const SELECT_CLUSTER_TYPE_STEP_ID = 'selectClusterType';
}
