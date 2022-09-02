/* eslint-disable @typescript-eslint/no-explicit-any */

// Allows to return values from callback functions
// Usage:
// const promiseController = new PromiseController();
// fcn((callbackData) => {return promiseController.resolve(callbackData);})
// return promiseController.promise;
export class PromiseController {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  promise: Promise<any>;
  resolve: (reason?: any) => void = () => null;
  reject: (value: any) => void = () => null;
}
