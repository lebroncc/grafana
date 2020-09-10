import { PanelPlugin } from '@grafana/data';
import { TablePanel } from './TablePanel';
import { CustomFieldConfig, Options } from './types';
import { tablePanelChangedHandler, tableMigrationHandler } from './migrations';
import { TableCellDisplayMode } from '@grafana/ui';

export const plugin = new PanelPlugin<Options, CustomFieldConfig>(TablePanel)
  .setPanelChangeHandler(tablePanelChangedHandler)
  .setMigrationHandler(tableMigrationHandler)
  .setNoPadding()
  .useFieldConfig({
    useCustomConfig: builder => {
      builder
        .addNumberInput({
          path: 'width',
          name: '列宽度',
          settings: {
            placeholder: 'auto',
            min: 20,
            max: 300,
          },
          shouldApply: () => true,
        })
        .addRadio({
          path: 'align',
          name: '列对齐',
          settings: {
            options: [
              { label: '自适应', value: null },
              { label: '左对齐', value: 'left' },
              { label: '中间对齐', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
          },
          defaultValue: null,
        })
        .addSelect({
          path: 'displayMode',
          name: '单元格显示模式',
          description: '文本颜色，背景，显示为仪表等等',
          settings: {
            options: [
              { value: TableCellDisplayMode.Auto, label: '自适应' },
              { value: TableCellDisplayMode.ColorText, label: '文本颜色' },
              { value: TableCellDisplayMode.ColorBackground, label: '背景颜色' },
              { value: TableCellDisplayMode.GradientGauge, label: 'Gradient gauge' },
              { value: TableCellDisplayMode.LcdGauge, label: 'LCD gauge' },
              { value: TableCellDisplayMode.JSONView, label: 'JSON View' },
            ],
          },
        });
    },
  })
  .setPanelOptions(builder => {
    builder.addBooleanSwitch({
      path: 'showHeader',
      name: '展示表格标题',
      description: '是否显示表格标题',
      defaultValue: true,
    });
  });
