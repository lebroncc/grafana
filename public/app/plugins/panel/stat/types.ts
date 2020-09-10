import { SingleStatBaseOptions, BigValueColorMode, BigValueGraphMode, BigValueJustifyMode } from '@grafana/ui';
import {
  ReducerID,
  SelectableValue,
  standardEditorsRegistry,
  FieldOverrideContext,
  getFieldDisplayName,
  escapeStringForRegex,
} from '@grafana/data';
import { PanelOptionsEditorBuilder } from '@grafana/data';

// Structure copied from angular
export interface StatPanelOptions extends SingleStatBaseOptions {
  graphMode: BigValueGraphMode;
  colorMode: BigValueColorMode;
  justifyMode: BigValueJustifyMode;
}

export const colorModes: Array<SelectableValue<BigValueColorMode>> = [
  { value: BigValueColorMode.Value, label: 'Value' },
  { value: BigValueColorMode.Background, label: 'Background' },
];

export const graphModes: Array<SelectableValue<BigValueGraphMode>> = [
  { value: BigValueGraphMode.None, label: 'None' },
  { value: BigValueGraphMode.Area, label: 'Area graph' },
];

export const justifyModes: Array<SelectableValue<BigValueJustifyMode>> = [
  { value: BigValueJustifyMode.Auto, label: 'Auto' },
  { value: BigValueJustifyMode.Center, label: 'Center' },
];

export function addStandardDataReduceOptions(
  builder: PanelOptionsEditorBuilder<SingleStatBaseOptions>,
  includeOrientation = true,
  includeFieldMatcher = true
) {
  builder.addRadio({
    path: 'reduceOptions.values',
    name: '展示',
    description: '为一列、序列、展示的每一行计算一个值',
    settings: {
      options: [
        { value: false, label: '计算' },
        { value: true, label: '所有值' },
      ],
    },
    defaultValue: false,
  });

  builder.addNumberInput({
    path: 'reduceOptions.limit',
    name: 'Limit',
    description: 'Max number of rows to display',
    settings: {
      placeholder: '5000',
      integer: true,
      min: 1,
      max: 5000,
    },
    showIf: options => options.reduceOptions.values === true,
  });

  builder.addCustomEditor({
    id: 'reduceOptions.calcs',
    path: 'reduceOptions.calcs',
    name: '值',
    // description: 'Choose a reducer function / calculation',
    description: '选择一个计算方法',
    editor: standardEditorsRegistry.get('stats-picker').editor as any,
    defaultValue: [ReducerID.mean],
    // Hides it when all values mode is on
    showIf: currentConfig => currentConfig.reduceOptions.values === false,
  });

  if (includeFieldMatcher) {
    builder.addSelect({
      path: 'reduceOptions.fields',
      name: '字段',
      description: '选择应包含在面板中的字段',
      settings: {
        allowCustomValue: true,
        options: [],
        getOptions: async (context: FieldOverrideContext) => {
          const options = [
            { value: '', label: 'Numeric Fields' },
            { value: '/.*/', label: 'All Fields' },
          ];
          if (context && context.data) {
            for (const frame of context.data) {
              for (const field of frame.fields) {
                const name = getFieldDisplayName(field, frame, context.data);
                const value = `/^${escapeStringForRegex(name)}$/`;
                options.push({ value, label: name });
              }
            }
          }
          return Promise.resolve(options);
        },
      },
      defaultValue: '',
    });
  }

  if (includeOrientation) {
    builder.addRadio({
      path: 'orientation',
      name: '方向',
      description: '多个序列或字段的叠加方向',
      settings: {
        options: [
          { value: 'auto', label: '自适应' },
          { value: 'horizontal', label: '水平' },
          { value: 'vertical', label: '垂直' },
        ],
      },
      defaultValue: 'auto',
    });
  }
}
