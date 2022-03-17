export class PromiseController {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
  promise: Promise<any>;
  resolve: Function;
  reject: Function;
}