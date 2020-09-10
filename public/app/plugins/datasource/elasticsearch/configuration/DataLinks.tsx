import React from 'react';
import { css } from 'emotion';
import { Button, stylesFactory, useTheme } from '@grafana/ui';
import { GrafanaTheme, VariableOrigin, DataLinkBuiltInVars } from '@grafana/data';
import { DataLinkConfig } from '../types';
import { DataLink } from './DataLink';

const getStyles = stylesFactory((theme: GrafanaTheme) => ({
  infoText: css`
    padding-bottom: ${theme.spacing.md};
    color: ${theme.colors.textWeak};
  `,
  dataLink: css`
    margin-bottom: ${theme.spacing.sm};
  `,
}));

type Props = {
  value?: DataLinkConfig[];
  onChange: (value: DataLinkConfig[]) => void;
};
export const DataLinks = (props: Props) => {
  const { value, onChange } = props;
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      <h3 className="page-heading">数据链接</h3>

      <div className={styles.infoText}>添加指向现有字段的链接。链接将显示在字段值旁边的日志行详细信息中。</div>

      <div className="gf-form-group">
        {value &&
          value.map((field, index) => {
            return (
              <DataLink
                className={styles.dataLink}
                key={index}
                value={field}
                onChange={newField => {
                  const newDataLinks = [...value];
                  newDataLinks.splice(index, 1, newField);
                  onChange(newDataLinks);
                }}
                onDelete={() => {
                  const newDataLinks = [...value];
                  newDataLinks.splice(index, 1);
                  onChange(newDataLinks);
                }}
                suggestions={[
                  {
                    value: DataLinkBuiltInVars.valueRaw,
                    label: 'Raw value',
                    documentation: 'Raw value of the field',
                    origin: VariableOrigin.Value,
                  },
                ]}
              />
            );
          })}
        <div>
          <Button
            variant={'secondary'}
            className={css`
              margin-right: 10px;
            `}
            icon="plus"
            onClick={event => {
              event.preventDefault();
              const newDataLinks = [...(value || []), { field: '', url: '' }];
              onChange(newDataLinks);
            }}
          >
            新增
          </Button>
        </div>
      </div>
    </>
  );
};
