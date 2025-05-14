export abstract class Base {
  private baseUri: string;
  private publishableKey: string;
  private clusterBaseUri: string;

  constructor(baseUri: string, publishableKey: string) {
    this.baseUri = baseUri;
    this.publishableKey = publishableKey;
    this.clusterBaseUri = '';

    if (!this.baseUri) {
      throw new Error('baseUri is required');
    }

    if (!this.publishableKey) {
      throw new Error('publishableKey is required');
    }
  }

  protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUri}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Publishable-Key': `${this.publishableKey}`,
    };

    const config = Object.assign({}, options, { headers });
    const response = await fetch(url, config);

    if (response.ok) {
      const data = await response.json();
      return data as T;
    }

    throw new Error(response.statusText);
  }

  protected async requestCluster<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.clusterBaseUri}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
    };

    const config = Object.assign({}, options, { headers });
    const response = await fetch(url, config);

    if (response.ok) {
      const data = await response.json();
      return data as T;
    }

    throw new Error(response.statusText);
  }

  public setClusterBaseUri(clusterBaseUri: string): void {
    this.clusterBaseUri = clusterBaseUri;

    if (!this.clusterBaseUri) {
      throw new Error('clusterBaseUri is required');
    }
  }
}
