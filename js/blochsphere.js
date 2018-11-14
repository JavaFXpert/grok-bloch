/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class BlochSphere extends BABYLON.Mesh {
    constructor(name, scene, inclinationRadians, azimuthRadians) {
        super(name, scene);
        this.inclinationRadians = inclinationRadians;
        this.azimuthRadians = azimuthRadians;
        this.probAmplitude0 = math.complex(1, 0);
        this.probAmplitude1 = math.complex(0, 0);

        this.scene = scene;
        this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 2.0, diameterY: 2.0, diameterZ: 2.0}, scene);
        this.lineColor = new BABYLON.Color3(.3, .3, .3);
        this.quantumStateLine = null;
        this.quantumStateLineCap = null;
        this.quantumStateLineColor = new BABYLON.Color3(0, 0, 1);

        this.setupSphere();
    }

    setCartesianCoords(babylonAxesVector) {
        var babylonAxisX = babylonAxesVector.x;
        var babylonAxisY = babylonAxesVector.y;
        var babylonAxisZ = babylonAxesVector.z;

        this.setInclinationRadians(Math.acos(babylonAxisY));
        this.setAzimuthRadians((Math.atan(babylonAxisX / -babylonAxisZ) + Math.PI * 2) % (Math.PI * 2));
    }

    getCartesianCoords() {
        var babylonAxisX = Math.sin(this.inclinationRadians) *
            Math.sin(this.azimuthRadians);
        var babylonAxisY = Math.cos(this.inclinationRadians);
        var babylonAxisZ = -Math.sin(this.inclinationRadians) *
            Math.cos(this.azimuthRadians);

        return new BABYLON.Vector3(babylonAxisX, babylonAxisY, babylonAxisZ);
    }

    setProbAmplitudes(probAmp0, probAmp1) {
        console.log("In setProbAmplitudes(), probAmp0: " + probAmp0 + ", probAmp1: " + probAmp1);
        this.probAmplitude0 = probAmp0;
        this.probAmplitude1 = probAmp1;

        var inclRads = 2 * math.acos(math.abs(probAmp0));
        console.log("inclRads: " + inclRads);
        this.setInclinationRadians(inclRads);

        var probAmp0Polar = probAmp0.toPolar();
        var probAmp1Polar = probAmp1.toPolar();
        var azimRads = (probAmp1.toPolar().phi - probAmp0.toPolar().phi);

        console.log("azimRads: " + azimRads);
        this.setAzimuthRadians(azimRads);
    }

    // TODO: Combine both probAmplitude methods
    getProbAmplitude0() {
        // var probAmpComplex = math.complex(Math.cos(this.getInclinationRadians() / 2), 0);
        // return math.round(probAmpComplex, 4);
        return this.probAmplitude0;
    }

    getProbAmplitude1() {
        // var sinHalfIncl = Math.sin(this.getInclinationRadians() / 2);
        // var probAmpComplex = math.multiply(
        //     math.complex(Math.cos(this.getAzimuthRadians()),
        //                  Math.sin(this.getAzimuthRadians())),
        //     sinHalfIncl);
        // return math.round(probAmpComplex, 4);
        return this.probAmplitude1;
    }

    getProbability0() {
        return Math.pow(math.abs(this.getProbAmplitude0()), 2);
    }

    getProbability1() {
        return Math.pow(math.abs(this.getProbAmplitude1()), 2);
    }

    setInclinationRadians(inclinationRadians) {
        this.inclinationRadians = inclinationRadians;
        console.log("this.inclinationRadians: " + this.inclinationRadians);
        this.updateQuantumStateLine();
    }

    getInclinationRadians() {
        return this.inclinationRadians;
    }

    setAzimuthRadians(azimuthRadians) {
        this.azimuthRadians = (azimuthRadians + Math.PI * 2) % (Math.PI * 2);
        console.log("this.azimuthRadians: " + this.azimuthRadians);
        this.updateQuantumStateLine();
    }

    getAzimuthRadians() {
        return this.azimuthRadians % (Math.PI * 2);
    }

    applyGate(gate) {
        var currentQuantumState = math.matrix([[this.getProbAmplitude0()], [this.getProbAmplitude1()]]);
        console.log("currentQuantumState: " + currentQuantumState);
        var newQuantumState = math.multiply(gate.matrix, currentQuantumState);
        console.log("newQuantumState: " + newQuantumState);

        // // Adjust quantum state such that coefficient of [0> is real and non-negative
        // var probAmpIm0 = math.subset(newQuantumState, math.index(0, 0)).im;
        // console.log("probAmpIm0: " + probAmpIm0);
        //
        // var adjScalar = 1;
        // if (probAmpIm0 != 0) {
        //     adjScalar = math.complex(0, -probAmpIm0).inverse();
        //     //adjScalar = math.complex(0, probAmpIm0).inverse();
        // }
        // console.log("adjScalar: " + adjScalar);
        //
        // /////TEST
        // var pa0 = math.subset(newQuantumState, math.index(0, 0));
        // console.log("pa0: " + pa0);
        // var adjPa0 = math.multiply(pa0, adjScalar);
        // console.log("adjPa0: " + adjPa0);
        // /////END TEST
        //
        // var adjQuantumState = math.multiply(adjScalar, newQuantumState);
        // console.log("adjQuantumState: " + adjQuantumState);
        //

        var probAmp0 = math.subset(newQuantumState, math.index(0, 0));
        var probAmp1 = math.subset(newQuantumState, math.index(1, 0));

        this.setProbAmplitudes(probAmp0, probAmp1);
    }

    /// Methods to construct the 3D Bloch sphere
    setupSphere() {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        this.sphere.material = myMaterial;
        this.position.y = 0.0;
        this.sphere.scaling = new BABYLON.Vector3(1.0, 1.0, 1.0);

        var equator = this.createEquator();
        equator.parent = this.sphere;
        equator.color = this.lineColor;

        myMaterial.alpha = 0.4;

        //Array of points to construct Bloch X axis line
        var xAxisPoints = [
            new BABYLON.Vector3(0, 0, -1.0),
            new BABYLON.Vector3(0, 0, 1.0)
        ];

        //Array of points to construct Bloch Y axis line
        var yAxisPoints = [
            new BABYLON.Vector3(-1.0, 0, 0),
            new BABYLON.Vector3(1.0, 0, 0)
        ];

        //Array of points to construct Bloch Z axis line
        var zAxisPoints = [
            new BABYLON.Vector3(0, 1.0, 0),
            new BABYLON.Vector3(0, -1.0, 0)
        ];

        //Create lines
        var xAxisLine = BABYLON.MeshBuilder.CreateLines("xAxisLine", {points: xAxisPoints}, this.scene);
        var yAxisLine = BABYLON.MeshBuilder.CreateLines("yAxisLine", {points: yAxisPoints}, this.scene);
        var zAxisLine = BABYLON.MeshBuilder.CreateLines("zAxisLine", {points: zAxisPoints}, this.scene);

        xAxisLine.color = this.lineColor;
        yAxisLine.color = this.lineColor;
        zAxisLine.color = this.lineColor;

        xAxisLine.isPickable = false;
        yAxisLine.isPickable = false;
        zAxisLine.isPickable = false;

        xAxisLine.parent = this.sphere;
        yAxisLine.parent = this.sphere;
        zAxisLine.parent = this.sphere;

        // Axis labels
        var xChar = this.makeTextPlane("X", "black", 0.2);
        xChar.position = new BABYLON.Vector3(0, 0.1, -1.2);
        xChar.isPickable = false;

        var yChar = this.makeTextPlane("Y", "black", 0.2);
        yChar.position = new BABYLON.Vector3(1.2, 0, 0);
        yChar.isPickable = false;

        var zeroKet = this.makeTextPlane("|0>", "black", 0.2);
        zeroKet.position = new BABYLON.Vector3(0, 1.2, 0);
        zeroKet.isPickable = false;

        var oneKet = this.makeTextPlane("|1>", "black", 0.2);
        oneKet.position = new BABYLON.Vector3(0, -1.2, 0);
        oneKet.isPickable = false;

        var plusKet = this.makeTextPlane("|+>", "black", 0.2);
        plusKet.position = new BABYLON.Vector3(0, -0.1, -1.2);
        plusKet.isPickable = false;

        var minusKet = this.makeTextPlane("<-|", "black", 0.2);
        minusKet.position = new BABYLON.Vector3(0, 0, 1.2);
        minusKet.isPickable = false;

        this.updateQuantumStateLine()
    }

    createEquator() {
        var myPoints = [];
        var radius = 1;
        var deltaTheta = Math.PI / 20;
        var theta = 0;
        var Y = 0;
        for (var i = 0; i<Math.PI * 20; i++) {
            myPoints.push(new BABYLON.Vector3(radius * Math.cos(theta), Y, radius * Math.sin(theta)));
            theta += deltaTheta;
        }

        //Create lines
        var lines = BABYLON.MeshBuilder.CreateDashedLines("lines", {points: myPoints, updatable: true}, this.scene);
        lines.isPickable = false;
        return lines;
    }

    makeTextPlane(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, this.scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, this.scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    }

    updateQuantumStateLine() {
        if (this.quantumStateLine) this.quantumStateLine.dispose();
        if (this.quantumStateLineCap) this.quantumStateLineCap.dispose();

        var qubitStateCartesianCoords = this.getCartesianCoords();

        var qStatePoints = [
            this.sphere.position,
            // new BABYLON.Vector3(0, 0, 0),
            qubitStateCartesianCoords
        ];
        this.quantumStateLine = BABYLON.MeshBuilder.CreateLines("qStatePoints", {points: qStatePoints}, this.scene);

        this.quantumStateLineCap = BABYLON.MeshBuilder.CreateCylinder("quantumStateLineCap", {height: 0.1, diameterTop: 0.0, diameterBottom: 0.1, tessellation: 6, subdivisions: 1 }, this.scene);

        this.quantumStateLine.color = this.quantumStateLineColor;
        this.quantumStateLineCap.color = this.quantumStateLineColor;
        this.quantumStateLineCap.position = this.getCartesianCoords();
        this.quantumStateLineCap.rotation = new BABYLON.Vector3(-this.getInclinationRadians(), -this.getAzimuthRadians(), 0);
    }

}
