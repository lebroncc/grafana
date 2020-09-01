export interface PanelEditorTab {
  id: string;
  text: string;
  active: boolean;
  icon: string;
}

export enum PanelEditorTabId {
  Query = 'query',
  Transform = 'transform',
  Visualize = 'visualize',
  Alert = 'alert',
}

export enum DisplayMode {
  Fill = 0,
  Fit = 1,
  Exact = 2,
}

export const displayModes = [
  // { value: DisplayMode.Fill, label: 'Fill', description: 'Use all available space' },
  // { value: DisplayMode.Fit, label: 'Fit', description: 'Fit in the space keeping ratio' },
  // { value: DisplayMode.Exact, label: 'Exact', description: 'Same size as the dashboard' },
  { value: DisplayMode.Fill, label: '填充', description: '使用全部可用的空间' },
  { value: DisplayMode.Fit, label: '适应', description: '保持比列自适应大小' },
  { value: DisplayMode.Exact, label: '精确', description: '保持仪表板相同大小' },
];
