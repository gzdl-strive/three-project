type Fn = (...args: unknown[]) => unknown;

interface Cache<T> {
  [key: string]: T[];
}

class Pubsub {
  private cache: Cache<Fn> = {};
  // 监听
  on(eventName: string, fn: Fn) {
    // cache可能为空，所以需要对这个cache初始化，如果eventName没有出现过，就初始化为一个数组
    this.cache[eventName] = this.cache[eventName] || [];
    // 将函数放入数组中
    this.cache[eventName].push(fn);
  }
  // 触发
  emit(eventName: string, ...args: unknown[]) {
    // 读取eventName对应的函数数组，如果不存在，置为空数组
    (this.cache[eventName] || []).forEach(fn => {
      fn(...args);
    });
  }
  // 取消
  off(eventName: string, fn: Fn) {
    let index = indexOf(this.cache[eventName], fn);
    if (index === -1) {
      return;
    }
    this.cache[eventName].splice(index, 1);
  }
}

const indexOf = (arr: Fn[], fn: Fn) => {
  if (arr === undefined) return -1;
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === fn) {
      index = i;
    }
  }
  return index;
}

export default Pubsub;