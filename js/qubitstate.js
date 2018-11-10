class QubitState {
    constructor(inclinationRadians, azimuthRadians) {
        this.inclinationRadians = inclinationRadians;
        this.azimuthRadians = azimuthRadians;
    }

    setCartesianCoords(babylonAxesVector) {
        var babylonAxisX = babylonAxesVector.x;
        var babylonAxisY = babylonAxesVector.y;
        var babylonAxisZ = babylonAxesVector.z;

        this.inclinationRadians = Math.acos(babylonAxisY);
        this.azimuthRadians = (Math.atan(babylonAxisX / -babylonAxisZ) + Math.PI * 2) % (Math.PI * 2);
    }

    getCartesianCoords() {
        var babylonAxisX = Math.sin(this.inclinationRadians) *
            Math.sin(this.azimuthRadians);
        var babylonAxisY = Math.cos(this.inclinationRadians);
        var babylonAxisZ = -Math.sin(this.inclinationRadians) *
            Math.cos(this.azimuthRadians);

        return new BABYLON.Vector3(babylonAxisX, babylonAxisY, babylonAxisZ);
    }

    getProbAmplitude0() {
        var probAmpComplex = new ComplexNum(Math.cos(this.getInclinationRadians() / 2), 0);
        return probAmpComplex;
    }

    getProbAmplitude1() {
        var sinHalfIncl = Math.sin(this.getInclinationRadians() / 2);
        var probAmpComplex = new ComplexNum(Math.cos(this.getAzimuthRadians()) * sinHalfIncl,
            Math.sin(this.getAzimuthRadians()) * sinHalfIncl);
        return probAmpComplex;
    }

    getProbability0() {
        return Math.pow(this.getProbAmplitude0().absValue(), 2);
    }

    getProbability1() {
        return Math.pow(this.getProbAmplitude1().absValue(), 2);
    }

    setInclinationRadians(inclinationRadians) {
        this.inclinationRadians = inclinationRadians;
    }

    getInclinationRadians() {
        return this.inclinationRadians;
    }

    setAzimuthRadians(azimuthRadians) {
        this.azimuthRadians = (azimuthRadians + Math.PI * 2) % (Math.PI * 2);
    }

    getAzimuthRadians() {
        return this.azimuthRadians % (Math.PI * 2);
    }

}
