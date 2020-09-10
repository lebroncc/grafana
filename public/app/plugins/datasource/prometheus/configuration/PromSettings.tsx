import React, { SyntheticEvent } from 'react';
import { EventsWithValidation, InlineFormLabel, regexValidation, LegacyForms } from '@grafana/ui';
const { Select, Input, FormField, Switch } = LegacyForms;
import {
  SelectableValue,
  onUpdateDatasourceJsonDataOptionChecked,
  DataSourcePluginOptionsEditorProps,
} from '@grafana/data';
import { PromOptions } from '../types';

const httpOptions = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
];

type Props = Pick<DataSourcePluginOptionsEditorProps<PromOptions>, 'options' | 'onOptionsChange'>;

export const PromSettings = (props: Props) => {
  const { options, onOptionsChange } = props;

  return (
    <>
      <div className="gf-form-group">
        <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
              label="抓取间隔"
              labelWidth={13}
              inputEl={
                <Input
                  className="width-6"
                  value={options.jsonData.timeInterval}
                  spellCheck={false}
                  placeholder="15s"
                  onChange={onChangeHandler('timeInterval', options, onOptionsChange)}
                  validationEvents={promSettingsValidationEvents}
                />
              }
              tooltip="Set this to the typical scrape and evaluation interval configured in Prometheus. Defaults to 15s."
            />
          </div>
        </div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
              label="查询超时"
              labelWidth={13}
              inputEl={
                <Input
                  className="width-6"
                  value={options.jsonData.queryTimeout}
                  onChange={onChangeHandler('queryTimeout', options, onOptionsChange)}
                  spellCheck={false}
                  placeholder="60s"
                  validationEvents={promSettingsValidationEvents}
                />
              }
              tooltip="Set the Prometheus query timeout."
            />
          </div>
        </div>
        <div className="gf-form">
          <InlineFormLabel
            width={13}
            tooltip="Specify the HTTP Method to query Prometheus. (POST is only available in Prometheus >= v2.1.0)"
          >
            HTTP 方法
          </InlineFormLabel>
          <Select
            options={httpOptions}
            value={httpOptions.find(o => o.value === options.jsonData.httpMethod)}
            onChange={onChangeHandler('httpMethod', options, onOptionsChange)}
            width={7}
          />
        </div>
      </div>
      <h3 className="page-heading">其他</h3>
      <div className="gf-form-group">
        <div className="gf-form">
          <Switch
            checked={options.jsonData.disableMetricsLookup}
            label="禁用指标查找"
            labelClass="width-14"
            onChange={onUpdateDatasourceJsonDataOptionChecked(props, 'disableMetricsLookup')}
            tooltip="Checking this option will disable the metrics chooser and metric/label support in the query field's autocomplete. This helps if you have performance issues with bigger Prometheus instances."
          />
        </div>
        <div className="gf-form-inline">
          <div className="gf-form max-width-30">
            <FormField
              label="自定义查询参数"
              labelWidth={14}
              tooltip="Add Custom parameters to Prometheus or Thanos queries."
              inputEl={
                <Input
                  className="width-25"
                  value={options.jsonData.customQueryParameters}
                  onChange={onChangeHandler('customQueryParameters', options, onOptionsChange)}
                  spellCheck={false}
                  placeholder="Example: max_source_resolution=5m&timeout=10"
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const promSettingsValidationEvents = {
  [EventsWithValidation.onBlur]: [
    regexValidation(
      /^$|^\d+(ms|[Mwdhmsy])$/,
      'Value is not valid, you can use number with time unit specifier: y, M, w, d, h, m, s'
    ),
  ],
};

export const getValueFromEventItem = (eventItem: SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
  if (!eventItem) {
    return '';
  }

  if (eventItem.hasOwnProperty('currentTarget')) {
    return eventItem.currentTarget.value;
  }

  return (eventItem as SelectableValue<string>).value;
};

const onChangeHandler = (
  key: keyof PromOptions,
  options: Props['options'],
  onOptionsChange: Props['onOptionsChange']
) => (eventItem: SyntheticEvent<HTMLInputElement> | SelectableValue<string>) => {
  onOptionsChange({
    ...options,
    jsonData: {
      ...options.jsonData,
      [key]: getValueFromEventItem(eventItem),
    },
  });
};
