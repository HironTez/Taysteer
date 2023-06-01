/**
 * Allows to return values from callback functions
 * @example
 * const myFunction = () => {
 *   const promiseController = new PromiseController();
 *   someFunc(data => promiseController.resolve(data))
 *   return promiseController.promise;
 * }
 */
export class PromiseController<T> {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  promise: Promise<T>;
  resolve: (value: T) => void = () => {};
  reject: (reason?: Error) => void = () => {};
}
