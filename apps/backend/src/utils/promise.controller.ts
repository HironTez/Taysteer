/**
 * Allows to return values from callback functions
 * @example
 * const async myFunction = () => {
 *   const promiseController = new PromiseController(); // Create a new promise controller
 *   someFunctionWithCallback((dataToReturn) => {
 *     promiseController.resolve(dataToReturn); // Resolve the promise
 *   });
 *   return promiseController.promise; // Return the promise
 * }
 */
export class PromiseController<T, R> {
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void = () => null;
  reject: (reason?: R) => void = () => null;
}
