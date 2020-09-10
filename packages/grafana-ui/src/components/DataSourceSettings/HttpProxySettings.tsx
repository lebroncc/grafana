import React from 'react';
import { HttpSettingsBaseProps } from './types';
import { Switch } from '../Forms/Legacy/Switch/Switch';

export const HttpProxySettings: React.FC<HttpSettingsBaseProps> = ({ dataSourceConfig, onChange }) => {
  return (
    <>
      <div className="gf-form-inline">
        <Switch
          label="TLS 客户端认证"
          labelClass="width-13"
          checked={dataSourceConfig.jsonData.tlsAuth || false}
          onChange={event => onChange({ ...dataSourceConfig.jsonData, tlsAuth: event!.currentTarget.checked })}
        />

        <Switch
          label="CA 证书"
          labelClass="width-13"
          checked={dataSourceConfig.jsonData.tlsAuthWithCACert || false}
          onChange={event =>
            onChange({ ...dataSourceConfig.jsonData, tlsAuthWithCACert: event!.currentTarget.checked })
          }
          tooltip="Needed for verifying self-signed TLS Certs"
        />
      </div>
      <div className="gf-form-inline">
        <Switch
          label="跳过 TLS 验证"
          labelClass="width-13"
          checked={dataSourceConfig.jsonData.tlsSkipVerify || false}
          onChange={event => onChange({ ...dataSourceConfig.jsonData, tlsSkipVerify: event!.currentTarget.checked })}
        />
      </div>
      <div className="gf-form-inline">
        <Switch
          label="转发 OAuth 标识"
          labelClass="width-13"
          checked={dataSourceConfig.jsonData.oauthPassThru || false}
          onChange={event => onChange({ ...dataSourceConfig.jsonData, oauthPassThru: event!.currentTarget.checked })}
          tooltip="Forward the user's upstream OAuth identity to the data source (Their access token gets passed along)."
        />
      </div>
    </>
  );
};
