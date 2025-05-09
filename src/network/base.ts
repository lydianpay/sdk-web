export abstract class Base {
    private baseUri: string;

    constructor(baseUri: string) {
        this.baseUri = baseUri;

        if (!this.baseUri) {
            throw new Error('baseUri is required');
        }
    }

    protected async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${this.baseUri}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
        };

        const config = Object.assign({}, options, {headers});
        const response = await fetch(url, config);

        if (response.ok) {
            const data = await response.json();
            return data as T;
        }

        throw new Error(response.statusText);
    }
}
