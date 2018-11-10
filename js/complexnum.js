class ComplexNum {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    getReal() {
        return this.real;
    }

    getImaginary() {
        return this.imaginary;
    }

    absValue() {
        return Math.sqrt(Math.pow(this.real, 2) +
            Math.pow(this.imaginary, 2));
    }
}
