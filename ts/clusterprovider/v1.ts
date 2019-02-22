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

    /**
     * The actions for which a cluster provider may be invoked.
     * The possible values are 'create' (the Create Cluster command)
     * and 'configure' (the Add Existing Cluster command).
     */
    export type ClusterProviderAction = 'create' | 'configure';

    /**
     * Represents a cluster provider - an object that provides a
     * user interface for working with a particular type of Kubernetes
     * cluster, such as Minikube or Azure Kubernetes Services.  The
     * cluster provider should perform any requires interaction with the
     * user, and take whatever platform-specific steps are required
     * to add an existing cluster to the kubeconfig file or to create a
     * cluster of the appropriate type, depending on the action for which
     * it is invoked.
     */
    export interface ClusterProvider {
        /**
         * A programmatic identifier for the cluster provider.
         */
        readonly id: string;
        /**
         * A display mame for the cluster type. This is displayed in the
         * cluster type drop-down at the start of the Add Existing Cluster
         * or Create Cluster wizard.
         */
        readonly displayName: string;
        /**
         * The actions supported by the cluster provider. For example, if
         * you support registering existing clusters but not creating new
         * clusters, this array should contain 'configure' only.
         */
        readonly supportedActions: ClusterProviderAction[];
        /**
         * Invoked by the Kubernetes extension to perform actions and
         * display user interface. This is first called when the user
         * chooses your cluster type in the wizard; it is called again
         * when your user interface transitions to a new page.
         * @param wizard The wizard to use for showing any required user
         * interface. Your implementation can call the showPage() method
         * to prompt for information or display results.
         * @param action The command the user invoked: 'configure' for
         * Add Existing Cluster, 'create' for Create Cluster.
         * @param message An object containing any information from the
         * HTML form that requested to move to the next page.  TODO: provide
         * more details about this.
         */
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
