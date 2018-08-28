export default class FailableException {
    public errors: any;
    constructor(errors: any) {
        this.errors = errors;
    }
}