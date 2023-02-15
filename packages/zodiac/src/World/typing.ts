/* 环境太阳光Debug参数 */
export interface EnvironmentDebugParameter {
  color: number;
  intensity: number;
}
/* Floor颜色 */
export type FloorColors = Record<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', string>;