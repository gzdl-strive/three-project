import Pubsub from './pubsub';
import { Sizes, Time } from './three_utils';

const uuid = (): string => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now();
  }
  const uuid = 'xxxyyxxx-xxxx-6xxx-yxxx-xxxxxyyyxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  })
  return uuid.replace(/-/g, '');
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
  uuid,
  capitalize,
  Pubsub,
  Sizes,
  Time
}