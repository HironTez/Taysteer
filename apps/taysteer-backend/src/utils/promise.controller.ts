/* eslint-disable @typescript-eslint/no-explicit-any */
export class PromiseController {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
  promise: Promise<any>;
  resolve: (reason?: any) => void;
  reject: (value: any) => void;
}
