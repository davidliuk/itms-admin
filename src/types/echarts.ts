import { CallbackDataParams } from 'echarts/types/dist/shared';
// 它表示图表的回调数据参数类型，通常用于定义回调函数的参数类型，以便在图表交互时获取相关数据。
export interface ToolTipFormatterParams extends CallbackDataParams {
  axisDim: string; // 轴的维度
  axisIndex: number; // 轴的索引
  axisType: string; // 轴的类型
  axisId: string; // 轴的id
  axisValue: string; // 轴的值
  axisValueLabel: string; // 轴的值的标签
}
