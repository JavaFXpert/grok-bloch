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
class QuantumPhaseDisk extends BABYLON.Mesh {
    constructor(name, scene, blochSphere, verticalPositionInScene) {
        super(name, scene);
        this.blochSphere = blochSphere;

        this.scene = scene;
        this.verticalPositionInScene = verticalPositionInScene;

        this.phaseCyl =
            BABYLON.MeshBuilder.CreateCylinder("phaseCyl",
                {height: 0.01, diameter: 2,
                    faceColors: [
                        new BABYLON.Color4(0.75, 0.75, 0.75, 1),	// bottom cap
                        new BABYLON.Color4(0, 0, 0, 1),				// tube
                        new BABYLON.Color4(0.75, 0.75, 0.75, 1)		// top cap
                    ]},
                scene);
        this.phaseCyl.position.y = verticalPositionInScene;
        this.lineColor = new BABYLON.Color3(.3, .3, .3);
        this.quantumPhaseLine = null;
        this.quantumPhaseLineCap = null;
        this.quantumPhaseLineColor = new BABYLON.Color3(0, 0, 1);

        this.setupDisk();
    }

    getQuantumPhaseCartesianCoords() {
        let xPos = Math.sin(this.blochSphere.getAzimuthRadians());
        //let yPos = this.verticalPositionInScene + 0.01;
        let yPos = 0.01;
        let zPos = -Math.cos(this.blochSphere.getAzimuthRadians());

        return new BABYLON.Vector3(xPos, yPos, zPos);
    }

    /// Methods to construct the 3D quantum phase cylinder
    setupDisk() {
        var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        this.phaseCyl.material = myMaterial;
        //this.position.y = this.verticalPositionInScene;
        this.phaseCyl.scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);

        const circumferenceLine = this.createCircumferenceLine();
        circumferenceLine.parent = this.phaseCyl;
        circumferenceLine.color = this.lineColor;

        myMaterial.alpha = 0.2;

        // Array of points to construct that corresponds to Bloch X axis line
        const xAxisPoints = [
            new BABYLON.Vector3(0, 0.01, -1.0),
            new BABYLON.Vector3(0, 0.01, 1.0)
        ];

        // Array of points to construct that corresponds to Bloch Y axis line
        const yAxisPoints = [
            new BABYLON.Vector3(-1.0, 0.01, 0),
            new BABYLON.Vector3(1.0, 0.01, 0)
        ];

        //Create axis lines
        const xAxisLine = BABYLON.MeshBuilder.CreateDashedLines("xAxisLine",
            {points: xAxisPoints, dashSize: 3, gapSize: 3}, this.scene);
        const yAxisLine = BABYLON.MeshBuilder.CreateDashedLines("yAxisLine",
            {points: yAxisPoints, dashSize: 3, gapSize: 3}, this.scene);

        xAxisLine.color = this.lineColor;
        yAxisLine.color = this.lineColor;

        xAxisLine.isPickable = false;
        yAxisLine.isPickable = false;

        xAxisLine.parent = this.phaseCyl;
        yAxisLine.parent = this.phaseCyl;

        // Axis labels
        const zeroLabel = this.makeTextPlane("0", "black", 0.4);
        zeroLabel.position = new BABYLON.Vector3(0.1, 0.0, -1.2);
        zeroLabel.isPickable = false;

        const piLabel = this.makeTextPlane("π", "black", 0.4);
        piLabel.position = new BABYLON.Vector3(0.1, 0.0, 1.2);
        piLabel.isPickable = false;

        const piOver2Label = this.makeTextPlane("π/2", "black", 0.4);
        piOver2Label.position = new BABYLON.Vector3(1.2, 0.0,0);
        piOver2Label.isPickable = false;
        
        const pi3Over2Label = this.makeTextPlane("3π/2", "black", 0.4);
        pi3Over2Label.position = new BABYLON.Vector3(-1.25, 0.0, 0);
        pi3Over2Label.isPickable = false;


        this.updateQuantumPhaseLine()
    }

    createCircumferenceLine() {
        var myPoints = [];
        var radius = 1 - 0.02;
        var deltaTheta = Math.PI / 20;
        var theta = 0;
        var Y = 0.01;
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
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 70, this.scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 30, "bold 30px Arial", color, "transparent", true);
        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, this.scene, true);
        // plane.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", this.scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        plane.parent = this.phaseCyl;
        plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
        return plane;
    }

    updateQuantumPhaseLine() {
        if (this.quantumPhaseLine) this.quantumPhaseLine.dispose();
        if (this.quantumPhaseLineCap) this.quantumPhaseLineCap.dispose();

        let quantumPhaseCartesianCoords = this.getQuantumPhaseCartesianCoords();

        //Array of points to construct Bloch X axis line
        const quantumPhasePoints = [
            //this.phaseCyl.position,
            new BABYLON.Vector3(0, 0.01, 0),
            quantumPhaseCartesianCoords
        ];

        this.quantumPhaseLine =
            BABYLON.MeshBuilder.CreateLines("quantumPhasePoints",
                {points: quantumPhasePoints}, this.scene);
        this.quantumPhaseLine.parent = this.phaseCyl;

        this.quantumPhaseLineCap = BABYLON.MeshBuilder.CreateCylinder("quantumPhaseLineCap", {height: 0.1, diameterTop: 0.0, diameterBottom: 0.1, tessellation: 6, subdivisions: 1 }, this.scene);
        this.quantumPhaseLineCap.parent = this.phaseCyl;

        this.quantumPhaseLine.color = this.quantumPhaseLineColor;
        this.quantumPhaseLineCap.color = this.quantumPhaseLineColor;
        this.quantumPhaseLineCap.position = this.getQuantumPhaseCartesianCoords();
        this.quantumPhaseLineCap.rotation = new BABYLON.Vector3(-Math.PI / 2, -this.blochSphere.getAzimuthRadians(), 0);
    }

}
