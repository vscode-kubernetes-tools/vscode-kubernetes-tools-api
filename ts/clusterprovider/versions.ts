import { APIKey, API } from '..';

import { ClusterProviderV1 } from './v1';

export const CLUSTER_PROVIDER_V1: APIKey<ClusterProviderV1> = { component: "clusterprovider", version: "v1" };

export interface ClusterProviderAPI {
    readonly v1: Promise<API<ClusterProviderV1>>;
}
