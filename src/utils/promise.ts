// Allows to return values from callback functions
// Usage:
// const promiseController = new PromiseController();
// fcn((callbackData) => {return promiseController.resolve(callbackData);})
// return promiseController.promise;
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
