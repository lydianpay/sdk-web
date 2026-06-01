import { Base } from '../base';
import { GetSDKConfigResponse } from '../../types';

const resourceName = 'merchant/config';

export class Config extends Base {
  async getSDKConfig(): Promise<GetSDKConfigResponse> {
    return await this.request<GetSDKConfigResponse>(`/${resourceName}`);
  }
}
