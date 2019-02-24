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
         * A display name for the cluster type. This is displayed in the
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

    /**
     * The user interface component that hosts the Add Existing Cluster and
     * Create Cluster wizards. Your cluster provider can display UI by calling
     * methods of this interface.
     */
    export interface Wizard {
        /**
         * Shows the specified HTML in the user interface.
         * @param htmlBody The HTML to be displayed. In addition to a HTML string,
         * this can be a Promise that resolves to a HTML string (useful for async
         * scenarios), or an Observable producing a series of HTML strings (useful for
         * progress indication scenarios).
         */
        showPage(htmlBody: Sequence<string>): Promise<void>;
    }

    /**
     * A sequence of values pushed by a data source. In the context of a cluster provider,
     * you might implement this interface if you have a function which returns a sequence
     * of pages such as a progress display.
     */
    export interface Observable<T> {
        /**
         * Subscribes an object to be notified when a new data value is pushed.
         * @param observer The object to be subscribed.
         */
        subscribe(observer: Observer<T>): void;
    }

    /**
     * An object that observes an Observable sequence. In the context of the cluster provider,
     * this is implemented by the Kubernetes extension; if you are implementing a sequence
     * of asynchronous pages (such as a progress display) as an Observable, then your Observable
     * calls the onNext method of any subscribed Observer(s).
     */
    export interface Observer<T> {
        /**
         * Notifies the observer that the Observable has pushed a value. In the context of a cluster
         * provider, you would call this on the provided Observer to update a displayed user interface.
         * @param value The value being pushed - in the context of the cluster provider, the updated
         * HTML to display.
         * @returns In the context of the cluster provider, indicates whether the update was delivered
         * to the wizard. You can normally ignore the return value except to await it.
         */
        onNext(value: T): Promise<boolean>;
    }

    /**
     * A value, or an asynchronous sequence of one (Thenable) or more (Observable) values.
     * In the context of a cluster provider, this represents a UI page being provided
     * synchronously, a UI page being provided asynchronously, or a sequence of UI pages
     * being provided asynchronously based on external events (typically used for progress
     * indication).
     */
    export type Sequence<T> = T | Thenable<T> | Observable<T>;

    /**
     * If a cluster provider UI page gathers user input using a form, you must use this
     * name as the id property of the form.
     */
    export const WIZARD_FORM_NAME = "form";

    /**
     * The name of the function invoked by NEXT_PAGE to navigate to the next page of the cluster
     * provider UI. This is provided in case you need to call the function in a custom way;
     * for most situations, use the NEXT_PAGE code fragment.
     */
    export const NEXT_PAGE_FN_NAME = "onNext";
    /**
     * If a cluster provider UI page provides a way for the user to navigate to the next page,
     * it must call this code fragment from its triggering event.
     * @example
     * `<form id='${k8s.clusterprovider.WIZARD_FORM_NAME}'>
          <input type='hidden' name='${k8s.clusterprovider.CLUSTER_TYPE_KEY}' value='mytype' />
          <button onclick='${k8s.clusterprovider.NEXT_PAGE}'>Next &gt;</button>
      </form>`
     */
    export const NEXT_PAGE = "onNext();";

    /**
     * If a cluster provider UI page provides a way for the user to navigatge to the next page,
     * it must submit a form containing at least this key with a value of the cluster type's 'id'
     * property.
     * @example
     * `<form id='${k8s.clusterprovider.WIZARD_FORM_NAME}'>
     *     <input type='hidden' name='${k8s.clusterprovider.CLUSTER_TYPE_KEY}' value='mytype' />
     *     <button onclick='${k8s.clusterprovider.NEXT_PAGE}'>Next &gt;</button>
     * </form>`
     */
    export const CLUSTER_TYPE_KEY = 'clusterType';

    /**
     * When a wizard-provided step calls your cluster provider's 'next' method, the 'message'
     * parameter will include this key to identify which step sent the message.  Currently
     * the only value the wizard will send is SELECT_CLUSTER_TYPE_STEP_ID.
     */
    export const SENDING_STEP_KEY = 'sendingStep';
    /**
     * Sent as the message[SENDING_STEP_KEY] value when the wizard 'select cluster type' screen
     * invokes your cluster provider.
     */
    export const SELECT_CLUSTER_TYPE_STEP_ID = 'selectClusterType';
}
