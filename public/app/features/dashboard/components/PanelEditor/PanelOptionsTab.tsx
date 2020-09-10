import React, { FC, useMemo, useRef } from 'react';
import { DashboardModel, PanelModel } from '../../state';
import { PanelData, PanelPlugin, SelectableValue } from '@grafana/data';
import { Counter, DataLinksInlineEditor, Field, Input, RadioButtonGroup, Select, Switch, TextArea } from '@grafana/ui';
import { getPanelLinksVariableSuggestions } from '../../../panel/panellinks/link_srv';
import { getVariables } from '../../../variables/state/selectors';
import { PanelOptionsEditor } from './PanelOptionsEditor';
import { AngularPanelOptions } from './AngularPanelOptions';
import { VisualizationTab } from './VisualizationTab';
import { OptionsGroup } from './OptionsGroup';

interface Props {
  panel: PanelModel;
  plugin: PanelPlugin;
  data: PanelData;
  dashboard: DashboardModel;
  onPanelConfigChange: (configKey: string, value: any) => void;
  onPanelOptionsChanged: (options: any) => void;
}

export const PanelOptionsTab: FC<Props> = ({
  panel,
  plugin,
  data,
  dashboard,
  onPanelConfigChange,
  onPanelOptionsChanged,
}) => {
  const visTabInputRef = useRef<HTMLInputElement>();
  const linkVariablesSuggestions = useMemo(() => getPanelLinksVariableSuggestions(), []);
  const elements: JSX.Element[] = [];
  const panelLinksCount = panel && panel.links ? panel.links.length : 0;

  const variableOptions = getVariableOptions();
  const directionOptions = [
    { label: 'Horizontal', value: 'h' },
    { label: 'Vertical', value: 'v' },
  ];

  const maxPerRowOptions = [2, 3, 4, 6, 8, 12].map(value => ({ label: value.toString(), value }));

  const focusVisPickerInput = (isExpanded: boolean) => {
    if (isExpanded && visTabInputRef.current) {
      visTabInputRef.current.focus();
    }
  };
  // Fist common panel settings Title, description
  elements.push(
    <OptionsGroup title="设置" id="Panel settings" key="Panel settings">
      <Field label="面板标题">
        <Input defaultValue={panel.title} onBlur={e => onPanelConfigChange('title', e.currentTarget.value)} />
      </Field>
      <Field label="描述" description="面板描述支持 markdown 和 链接.">
        <TextArea
          defaultValue={panel.description}
          onBlur={e => onPanelConfigChange('description', e.currentTarget.value)}
        />
      </Field>
      <Field label="是否透明" description="面板展示不设置背景.">
        <Switch value={panel.transparent} onChange={e => onPanelConfigChange('transparent', e.currentTarget.checked)} />
      </Field>
    </OptionsGroup>
  );

  elements.push(
    <OptionsGroup title="可视化" id="Panel type" key="Panel type" defaultToClosed onToggle={focusVisPickerInput}>
      <VisualizationTab panel={panel} ref={visTabInputRef} />
    </OptionsGroup>
  );

  // Old legacy react editor
  if (plugin.editor && panel && !plugin.optionEditors) {
    elements.push(
      <OptionsGroup title="选项" id="legacy react editor" key="legacy react editor">
        <plugin.editor data={data} options={panel.getOptions()} onOptionsChange={onPanelOptionsChanged} />
      </OptionsGroup>
    );
  }

  if (plugin.optionEditors && panel) {
    elements.push(
      <PanelOptionsEditor
        key="面板选项"
        options={panel.getOptions()}
        onChange={onPanelOptionsChanged}
        replaceVariables={panel.replaceVariables}
        plugin={plugin}
        data={data?.series}
      />
    );
  }

  if (plugin.angularPanelCtrl) {
    elements.push(
      <AngularPanelOptions panel={panel} dashboard={dashboard} plugin={plugin} key="angular panel options" />
    );
  }

  elements.push(
    <OptionsGroup
      renderTitle={isExpanded => <>链接 {!isExpanded && panelLinksCount > 0 && <Counter value={panelLinksCount} />}</>}
      id="panel links"
      key="panel links"
      defaultToClosed
    >
      <DataLinksInlineEditor
        links={panel.links}
        onChange={links => onPanelConfigChange('links', links)}
        suggestions={linkVariablesSuggestions}
        data={[]}
      />
    </OptionsGroup>
  );

  elements.push(
    <OptionsGroup title="重复选项" id="panel repeats" key="panel repeats" defaultToClosed>
      <Field
        label="重复变量"
        description="在此面板中重复所选变量的值。这在编辑模式下不可见。您需要返回到仪表板，然后更新变量或重新加载仪表板。."
      >
        <Select
          value={panel.repeat}
          onChange={value => onPanelConfigChange('repeat', value.value)}
          options={variableOptions}
        />
      </Field>
      {panel.repeat && (
        <Field label="Repeat direction">
          <RadioButtonGroup
            options={directionOptions}
            value={panel.repeatDirection || 'h'}
            onChange={value => onPanelConfigChange('repeatDirection', value)}
          />
        </Field>
      )}

      {panel.repeat && panel.repeatDirection === 'h' && (
        <Field label="Max per row">
          <Select
            options={maxPerRowOptions}
            value={panel.maxPerRow}
            onChange={value => onPanelConfigChange('maxPerRow', value.value)}
          />
        </Field>
      )}
    </OptionsGroup>
  );

  return <>{elements}</>;
};

function getVariableOptions(): Array<SelectableValue<string>> {
  const options = getVariables().map((item: any) => {
    return { label: item.name, value: item.name };
  });

  if (options.length === 0) {
    options.unshift({
      label: 'No template variables found',
      value: null,
    });
  }

  options.unshift({
    label: 'Disable repeating',
    value: null,
  });

  return options;
}
