/* eslint-disable */

//封装执行一次通用函数
export function once(fn) {
  if (Object.prototype.toString.call(fn) !== "[object Function]") {
    throw new Error('请传递一个函数');
  };

  return function (...rest) {
    if (fn) {
      fn.apply(this, rest);
      fn = null;
    };
  };
};
