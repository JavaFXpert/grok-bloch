var blochSphere = null;

let ground = null;
const groundPositionVertical = -1.8;

var quantumPhaseDisk = null;
var quantumPhaseLine = null;

var vectorPasted = false; // Indicates that vector was pasted for display

var quantumStateDiracGrid = new BABYLON.GUI.Grid();

var quantumStateGrid = new BABYLON.GUI.Grid();
var probAmplitudeTextBlock0 = new BABYLON.GUI.TextBlock();
var probAmplitudeTextBlock1 = new BABYLON.GUI.TextBlock();
var probabilityTextBlock0 = new BABYLON.GUI.TextBlock();
var probabilityTextBlock1 = new BABYLON.GUI.TextBlock();
var azimuthRadiansTextBlock = new BABYLON.GUI.TextBlock();

var outcomeProbabilityBar = new BABYLON.GUI.Slider();


// createScene function that creates and return the scene


// function getQuantumPhaseCartesianCoords() {
//     let axisX = Math.sin(blochSphere.getAzimuthRadians());
//     let axisY = groundPosition + .01;
//     let axisZ = -Math.cos(blochSphere.getAzimuthRadians());
//
//     return new BABYLON.Vector3(axisX, axisY, axisZ);
// }


function adaptRatio(value) {
    var devicePixelRatio = window.devicePixelRatio || 1.0;
    return devicePixelRatio * value;
}

function adaptRatioStr(value) {
    return adaptRatio(value) + "px";
}

function createScene(engine, canvas, config) {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    blochSphere = new BlochSphere("blochSphere", scene, 0, 0);

    BABYLON.SceneOptimizer.OptimizeAsync(scene);

    // scene.clearColor = new BABYLON.Color3( .75, .75, .75);
    scene.clearColor = new BABYLON.Color3(1.0, 1.0, 1.0);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2.5, Math.PI / 2.5, 6, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-3, 7, 1), scene);

    ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 2.5,
        height: 2.5
    }, scene);
    ground.position.y = groundPositionVertical;
    ground.isPickable = false;

    /////// Quantum phase panel, ellipse, line, and label
    // Colors per surface
    // const cylColors = [
    //     new BABYLON.Color4(0.75, 0.75, 0.75, 1),		// bottom cap
    //     new BABYLON.Color4(0, 0, 0, 1),				// tube
    //     new BABYLON.Color4(0.75, 0.75, 0.75, 1)		// top cap
    // ];
    //
    // quantumPhaseCylinder =
    //     BABYLON.MeshBuilder.CreateCylinder("phaseCyl",
    //         {height: 0.01, diameter: 2,
    //             faceColors: cylColors}, scene);
    /////// END Quantum phase panel, ellipse, line, and label

    quantumPhaseDisk = new QuantumPhaseDisk("quantumPhaseDisk", scene, blochSphere, groundPositionVertical);


    // Buttons, panels
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    /////// Outcome probability panel, bar, and labels
    var outcomeProbabilityPanel = new BABYLON.GUI.StackPanel();
    outcomeProbabilityPanel.height = adaptRatioStr(410);

    const outcomeProbabilityHeadingTextBlock = new BABYLON.GUI.TextBlock();
    outcomeProbabilityHeadingTextBlock.text = "Prob of |0⟩";
    outcomeProbabilityHeadingTextBlock.color = "black";
    outcomeProbabilityHeadingTextBlock.fontSize = config.fontSize;
    outcomeProbabilityHeadingTextBlock.height = adaptRatioStr(30);
    outcomeProbabilityPanel.addControl(outcomeProbabilityHeadingTextBlock);

    const outcomeProbabilityTextBlock1 = new BABYLON.GUI.TextBlock();
    outcomeProbabilityTextBlock1.text = "1";
    outcomeProbabilityTextBlock1.color = "black";
    outcomeProbabilityTextBlock1.fontSize = config.fontSize;
    outcomeProbabilityTextBlock1.height = adaptRatioStr(30);
    outcomeProbabilityPanel.addControl(outcomeProbabilityTextBlock1);

    outcomeProbabilityBar.minimum = 0;
    outcomeProbabilityBar.maximum = 1;
    outcomeProbabilityBar.isThumbClamped = true;
    outcomeProbabilityBar.isVertical = true;
    outcomeProbabilityBar.displayThumb = false;
    outcomeProbabilityBar.width = adaptRatioStr(30);
    outcomeProbabilityBar.height = adaptRatioStr(290);
    outcomeProbabilityBar.background = "#CCCCCC";
    outcomeProbabilityBar.color = "#666666";
    outcomeProbabilityBar.value = 0;
    outcomeProbabilityPanel.addControl(outcomeProbabilityBar);

    const outcomeProbabilityTextBlock0 = new BABYLON.GUI.TextBlock();
    outcomeProbabilityTextBlock0.text = "0";
    outcomeProbabilityTextBlock0.color = "black";
    outcomeProbabilityTextBlock0.fontSize = config.fontSize;
    outcomeProbabilityTextBlock0.height = adaptRatioStr(30);
    outcomeProbabilityPanel.addControl(outcomeProbabilityTextBlock0);

    advancedTexture.addControl(outcomeProbabilityPanel);
    outcomeProbabilityPanel.linkWithMesh(blochSphere);
    outcomeProbabilityPanel.linkOffsetX = adaptRatioStr(-390);
    /////// END Outcome probability panel, bar, and labels


    /////// Gates panel
    var leftPanel = new BABYLON.GUI.StackPanel();
    leftPanel.width = adaptRatioStr(250);
    leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(leftPanel);

    var rightPanel = new BABYLON.GUI.StackPanel();
    rightPanel.width = adaptRatioStr(110);
    rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(rightPanel);

    // TODO: Move these into styles
    var buttonSize = adaptRatioStr(65);
    var paddingTop = adaptRatioStr(5);

    var xGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/x-gate.png");
    xGateBtn.paddingTop = paddingTop;
    xGateBtn.width = buttonSize;
    xGateBtn.height = buttonSize;
    xGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.X);
        blochSphere.applyGate(Gate.X);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(xGateBtn);

    var yGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/y-gate.png");
    yGateBtn.paddingTop = paddingTop;
    yGateBtn.width = buttonSize;
    yGateBtn.height = buttonSize;
    yGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.Y);
        blochSphere.applyGate(Gate.Y);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(yGateBtn);

    var zGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/z-gate.png");
    zGateBtn.paddingTop = paddingTop;
    zGateBtn.width = buttonSize;
    zGateBtn.height = buttonSize;
    zGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.Z);
        blochSphere.applyGate(Gate.Z);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(zGateBtn);

    var hGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/h-gate.png");
    hGateBtn.paddingTop = paddingTop;
    hGateBtn.width = buttonSize;
    hGateBtn.height = buttonSize;
    hGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.H);
        blochSphere.applyGate(Gate.H);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(hGateBtn);

    const rxPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/rx-pi12-gate.png");
    rxPi8GateBtn.paddingTop = paddingTop;
    rxPi8GateBtn.width = buttonSize;
    rxPi8GateBtn.height = buttonSize;
    rxPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RxPi8);
        blochSphere.applyGate(Gate.RxPi12);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(rxPi8GateBtn);

    const ryPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/ry-pi12-gate.png");
    ryPi8GateBtn.paddingTop = paddingTop;
    ryPi8GateBtn.width = buttonSize;
    ryPi8GateBtn.height = buttonSize;
    ryPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RyPi8);
        blochSphere.applyGate(Gate.RyPi12);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(ryPi8GateBtn);

    const rzPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/rz-pi12-gate.png");
    rzPi8GateBtn.paddingTop = paddingTop;
    rzPi8GateBtn.width = buttonSize;
    rzPi8GateBtn.height = buttonSize;
    rzPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RzPi8);
        blochSphere.applyGate(Gate.RzPi12);
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(rzPi8GateBtn);

    var zeroStateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/zero-state.png");
    zeroStateBtn.paddingTop = paddingTop;
    zeroStateBtn.width = buttonSize;
    zeroStateBtn.height = buttonSize;
    zeroStateBtn.onPointerDownObservable.add(() => {
        blochSphere.setProbAmplitudes(math.complex(1, 0), math.complex(0, 0));
        updateQuantumStateDisplay(config);
    });
    leftPanel.addControl(zeroStateBtn);

    var sGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/s-gate.png");
    sGateBtn.paddingTop = paddingTop;
    sGateBtn.width = buttonSize;
    sGateBtn.height = buttonSize;
    sGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.S);
        blochSphere.applyGate(Gate.S);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(sGateBtn);

    var sDagGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/s-dag-gate.png");
    sDagGateBtn.paddingTop = paddingTop;
    sDagGateBtn.width = buttonSize;
    sDagGateBtn.height = buttonSize;
    sDagGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.St);
        blochSphere.applyGate(Gate.St);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(sDagGateBtn);

    var tGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/t-gate.png");
    tGateBtn.paddingTop = paddingTop;
    tGateBtn.width = buttonSize;
    tGateBtn.height = buttonSize;
    tGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.T);
        blochSphere.applyGate(Gate.T);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(tGateBtn);

    var tDagGateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/t-dag-gate.png");
    tDagGateBtn.paddingTop = paddingTop;
    tDagGateBtn.width = buttonSize;
    tDagGateBtn.height = buttonSize;
    tDagGateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.Tt);
        blochSphere.applyGate(Gate.Tt);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(tDagGateBtn);

    const rxmPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/rx-mpi12-gate.png");
    rxmPi8GateBtn.paddingTop = paddingTop;
    rxmPi8GateBtn.width = buttonSize;
    rxmPi8GateBtn.height = buttonSize;
    rxmPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RxmPi8);
        blochSphere.applyGate(Gate.RxmPi12);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(rxmPi8GateBtn);

    const rymPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/ry-mpi12-gate.png");
    rymPi8GateBtn.paddingTop = paddingTop;
    rymPi8GateBtn.width = buttonSize;
    rymPi8GateBtn.height = buttonSize;
    rymPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RymPi8);
        blochSphere.applyGate(Gate.RymPi12);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(rymPi8GateBtn);

    const rzmPi8GateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/rz-mpi12-gate.png");
    rzmPi8GateBtn.paddingTop = paddingTop;
    rzmPi8GateBtn.width = buttonSize;
    rzmPi8GateBtn.height = buttonSize;
    rzmPi8GateBtn.onPointerDownObservable.add(() => {
        console.log(Gate.RzmPi8);
        blochSphere.applyGate(Gate.RzmPi12);
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(rzmPi8GateBtn);

    var oneStateBtn = BABYLON.GUI.Button.CreateImageOnlyButton("but", "textures/one-state.png");
    oneStateBtn.paddingTop = paddingTop;
    oneStateBtn.width = buttonSize;
    oneStateBtn.height = buttonSize;
    oneStateBtn.onPointerDownObservable.add(() => {
        blochSphere.setProbAmplitudes(math.complex(0, 0), math.complex(1, 0));
        updateQuantumStateDisplay(config);
    });
    rightPanel.addControl(oneStateBtn);

    /////// END Gates panel


    /////// Top panel (State in Dirac notation)
    // \vert \psi \rangle = \sqrt{ 0.80} \vert 0 \rangle + (\sqrt{0.20}) e^{i 0.25\pi} \vert 1 \rangle
    // \vert \psi \rangle = \sqrt{ 0.80} \vert 0 \rangle + (\sqrt{0.20}) e^{i 0.25\pi} \vert 1 \rangle

    var qubitStateDiracImagePanel = new BABYLON.GUI.StackPanel();
    qubitStateDiracImagePanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    qubitStateDiracImagePanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    qubitStateDiracImagePanel.height = adaptRatioStr(546);
    qubitStateDiracImagePanel.paddingTop = adaptRatioStr(10);
    advancedTexture.addControl(qubitStateDiracImagePanel);

    var qubitStateDiracImage = new BABYLON.GUI.Image("but", "images/qubit-state-dirac.png");
    qubitStateDiracImage.width = adaptRatioStr(546);
    qubitStateDiracImage.height = adaptRatioStr(48);
    qubitStateDiracImagePanel.addControl(qubitStateDiracImage);

    var qubitStateDiracTextPanel = new BABYLON.GUI.StackPanel();
    qubitStateDiracTextPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    qubitStateDiracTextPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    qubitStateDiracTextPanel.height = adaptRatioStr(546);
    qubitStateDiracTextPanel.paddingTop = adaptRatioStr(10);
    advancedTexture.addControl(qubitStateDiracTextPanel);

    var qubitStateDiracTextBlock = new BABYLON.GUI.TextBlock();
    qubitStateDiracTextBlock.text = "Dirac notation will go here";
    qubitStateDiracTextBlock.color = "black";
    qubitStateDiracTextBlock.fontSize = config.fontSize;

    // qubitStateDiracPanel.width = "728px";
    // qubitStateDiracPanel.height = "163px";
    // qubitStateDiracPanel.
    //
    /////// END Top panel


    /////// Bottom panel
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    // TODO: Make this info appear in a different form (e.g. a vector)
    //advancedTexture.addControl(UiPanel);

    // Grid labels
    var basisLabel0 = new BABYLON.GUI.TextBlock();
    basisLabel0.text = "|0⟩";
    basisLabel0.color = "black";
    basisLabel0.fontSize = config.fontSize;

    var basisLabel1 = new BABYLON.GUI.TextBlock();
    basisLabel1.text = "|1⟩";
    basisLabel1.color = "black";
    basisLabel1.fontSize = config.fontSize;


    //// Dirac notation grid
    quantumStateDiracGrid.width = adaptRatioStr(546);
    quantumStateDiracGrid.height = adaptRatioStr(40);

    quantumStateDiracGrid.addRowDefinition(adaptRatio(0.4));
    quantumStateDiracGrid.addRowDefinition(adaptRatio(0.6));
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(118), true);
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(79), true);
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(125), true);
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(66), true);
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(46), true);
    quantumStateDiracGrid.addColumnDefinition(adaptRatio(50), true);

    qubitStateDiracTextPanel.addControl(quantumStateDiracGrid);
    //// END Dirac notation grid


    // Grid
    //var grid = new BABYLON.GUI.Grid();
    // quantumStateGrid.background = "black";
    // quantumStateGrid.adaptWidthToChildren = true;
    quantumStateGrid.width = adaptRatioStr(300);
    quantumStateGrid.height = adaptRatioStr(80);

    quantumStateGrid.addColumnDefinition(0.70);
    quantumStateGrid.addColumnDefinition(0.10);
    quantumStateGrid.addColumnDefinition(0.30);
    quantumStateGrid.addRowDefinition(0.50);
    quantumStateGrid.addRowDefinition(0.50);

    // quantumStateGrid.addControl(basisLabel0, 0, 1);
    // quantumStateGrid.addControl(basisLabel1, 1, 1);

    UiPanel.addControl(quantumStateGrid);
    /////// END Bottom panel


    /////// User may paste one or more state vectors for display on the Bloch sphere
    const strToComplexNum = function(complexStr) {
        // Delineation between real and imaginary parts is first sign (+/-) that isn't at the start of the string
        let minusSignPosition = complexStr.indexOf('-', 1);
        if (complexStr.charAt(minusSignPosition - 1) === 'e') {
            minusSignPosition = complexStr.indexOf('-', minusSignPosition + 1);
        }
        let plusSignPosition = complexStr.indexOf('+', 1);
        if (complexStr.charAt(plusSignPosition - 1) === 'e') {
            plusSignPosition = complexStr.indexOf('+', plusSignPosition + 1);
        }
        let imaginaryPositive = true;
        if (minusSignPosition > 0) {
            if (plusSignPosition < 0 || minusSignPosition < plusSignPosition) {
                imaginaryPositive = false;
            }
        }

        let realPartStr = "";
        let imagPartStr = "";

        if (imaginaryPositive) {
            // There should be a plus sign in the string
            realPartStr = complexStr.substring(0, plusSignPosition);
            imagPartStr = complexStr.substring(plusSignPosition);
        } else {
            // There should be a minus sign in the string
            realPartStr = complexStr.substring(0, minusSignPosition);
            imagPartStr = complexStr.substring(minusSignPosition);
        }
        if (imagPartStr.endsWith('j')) {
            imagPartStr = imagPartStr.substring(0, imagPartStr.indexOf('j'));
        } else if (imagPartStr.endsWith('i')) {
            imagPartStr = imagPartStr.substring(0, imagPartStr.indexOf('i'));
        }
        return math.complex(Number(realPartStr), Number(imagPartStr));
    };

    const statevectorInputText = new BABYLON.GUI.InputText();
    statevectorInputText.width = 0.25;
    statevectorInputText.maxWidth = 0.25;
    statevectorInputText.height = adaptRatioStr(40);
    statevectorInputText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    statevectorInputText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    statevectorInputText.text = "";
    statevectorInputText.color = "white";
    statevectorInputText.background = "gray";
    statevectorInputText.paddingBottom = adaptRatioStr(8);
    statevectorInputText.paddingLeft = adaptRatioStr(8);

    statevectorInputText.onTextPasteObservable.add(function() {
        let txt = statevectorInputText.text;
        statevectorInputText.text = "** Pasted **";
        setTimeout(() => {
            statevectorInputText.text = ""
        }, 1500);

        let tempStateStrArray = [];
        let pos = 0;

        // Remove everything up to and including the final '[' (but there should only be one)
        pos = txt.lastIndexOf('[');
        if (pos >= 0 && txt.length > pos + 1) {
            txt = txt.substring(pos + 1);
        }

        // Remove everything including and after the first ']' (but there should only be one)
        pos = txt.indexOf(']');
        if (pos >= 0) {
            txt = txt.substring(0, pos);
        }

        // Remove all spaces
        txt = txt.replace(/\s/g, '');

        // Populate tempStateStrArray
        tempStateStrArray = txt.split(',');

        vectorPasted = true;

        blochSphere.setAllowMultipleStateLines(false);
        for (let idx = 0; idx < tempStateStrArray.length; idx++) {

            // Send each pair of complex numbers the bloch sphere,
            // suppressing the disposal of the previous one
            if (idx >= 3) {
                blochSphere.setAllowMultipleStateLines(true);
            } else {
                blochSphere.setAllowMultipleStateLines(false);
            }

            if (idx % 2 == 1) {
                blochSphere.setProbAmplitudes(
                    strToComplexNum(tempStateStrArray[idx - 1]),
                    strToComplexNum(tempStateStrArray[idx])
                );
                updateQuantumStateDisplay(config);
            }
        }
        blochSphere.setAllowMultipleStateLines(false);

    });


    advancedTexture.addControl(statevectorInputText);


    /////// Control panel
    // Define selection panel and groups
    var inclination = function(radians) {
        blochSphere.setInclinationRadians(radians);
        blochSphere.resetGlobalPhase();
        blochSphere.updateQuantumStateLine();
        updateQuantumStateDisplay(config);
    }

    var azimuth = function(radians) {
        blochSphere.setAzimuthRadians(radians);
        blochSphere.resetGlobalPhase();
        blochSphere.updateQuantumStateLine();
        updateQuantumStateDisplay(config);
    }

    var displayValue = function(value) {
        //return BABYLON.Tools.ToDegrees(value) | 0;
        //return value.toFixed(2);
        return (value / Math.PI).toFixed(2);
    }

    var rotateGroup = new BABYLON.GUI.SliderGroup("Spherical coordinates:", "S");
    rotateGroup.addSlider("Polar angle", inclination, "π radians", 0, Math.PI, 0, displayValue)
    rotateGroup.addSlider("Azimuth angle", azimuth, "π radians", 0, Math.PI * 2, 0, displayValue)

    var selectBox = new BABYLON.GUI.SelectionPanel("sp", [rotateGroup]);
    selectBox.width = adaptRatio(0.35);
    selectBox.height = adaptRatio(0.25);
    selectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    // TODO: Uncomment next line if sliders desired
    // advancedTexture.addControl(selectBox);
    /////// END Control panel


    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                // TODO: Find out how to identify that sphere was picked
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh == blochSphere.sphere) {
                    //if(pointerInfo.pickInfo.hit) {
                    console.log("pickedPoint: " + pointerInfo.pickInfo.pickedPoint);

                    blochSphere.setCartesianCoords(pointerInfo.pickInfo.pickedPoint);
                    //blochSphere.updateQuantumStateLine();
                    updateQuantumStateDisplay(config);
                }
                break;
        }
    });

    //blochSphere.updateQuantumStateLine();
    updateQuantumStateDisplay(config);

    // return the created scene
    return scene;
};

function azimuthRadiansToPiRadians(radians) {
    var piRadians = (radians / Math.PI).toFixed(2)
    var piRadiansStr = piRadians + "π";

    if (piRadiansStr === "0.00π" || piRadiansStr === "2.00π") {
        piRadiansStr = "0      ";
    } else if (piRadiansStr === "0.13π") {
        piRadiansStr = "π/8    ";
    } else if (piRadiansStr === "0.17π") {
        piRadiansStr = "π/6    ";
    } else if (piRadiansStr === "0.25π") {
        piRadiansStr = "π/4    ";
    } else if (piRadiansStr === "0.33π") {
        piRadiansStr = "π/3    ";
    } else if (piRadiansStr === "0.50π") {
        piRadiansStr = "π/2    ";
    } else if (piRadiansStr === "0.67π") {
        piRadiansStr = "2π/3 ";
    } else if (piRadiansStr === "0.75π") {
        piRadiansStr = "3π/4 ";
    } else if (piRadiansStr === "0.83π") {
        piRadiansStr = "5π/6 ";
    } else if (piRadiansStr === "0.88π") {
        piRadiansStr = "7π/8 ";
    } else if (piRadiansStr === "1.00π") {
        piRadiansStr = "π      ";
    } else if (piRadiansStr === "1.13π") {
        piRadiansStr = "9π/8 ";
    } else if (piRadiansStr === "1.17π") {
        piRadiansStr = "7π/6 ";
    } else if (piRadiansStr === "1.25π") {
        piRadiansStr = "5π/4 ";
    } else if (piRadiansStr === "1.33π") {
        piRadiansStr = "4π/3 ";
    } else if (piRadiansStr === "1.50π") {
        piRadiansStr = "3π/2 ";
    } else if (piRadiansStr === "1.67π") {
        piRadiansStr = "5π/3 ";
    } else if (piRadiansStr === "1.75π") {
        piRadiansStr = "7π/4 ";
    } else if (piRadiansStr === "1.83π") {
        piRadiansStr = "11π/6";
    } else if (piRadiansStr === "1.88π") {
        piRadiansStr = "15π/8";
    }
    return piRadiansStr;
}

function updateQuantumStateDisplay(config) {
    blochSphere.resetGlobalPhase();
    probAmplitudeTextBlock0.dispose();

    var imaginary0 = blochSphere.getProbAmplitude0().im;
    var imaginary1 = blochSphere.getProbAmplitude1().im;

    // Update outcome probability bar
    outcomeProbabilityBar.value = blochSphere.getProbability0();

    probAmplitudeTextBlock0.text = blochSphere.getProbAmplitude0().re.toFixed(2); // +
    // (imaginary0 < 0 ? " - " : " + ") +
    // Math.abs(imaginary0).toFixed(2) + "i";
    probAmplitudeTextBlock0.color = "black";
    probAmplitudeTextBlock0.fontSize = config.fontSize;

    probAmplitudeTextBlock1.dispose();
    probAmplitudeTextBlock1.text = blochSphere.getProbAmplitude1().re.toFixed(2) +
        (imaginary1 < 0 ? " - " : " + ") +
        Math.abs(imaginary1).toFixed(2) + "i";
    probAmplitudeTextBlock1.color = "black";
    probAmplitudeTextBlock1.fontSize = config.fontSize;

    probabilityTextBlock0.dispose();
    probabilityTextBlock0.text = blochSphere.getProbability0().toFixed(2);
    probabilityTextBlock0.color = "black";
    probabilityTextBlock0.fontSize = config.fontSize;

    probabilityTextBlock1.dispose();
    probabilityTextBlock1.text = blochSphere.getProbability1().toFixed(2);
    probabilityTextBlock1.color = "black";
    probabilityTextBlock1.fontSize = config.fontSize;

    azimuthRadiansTextBlock.dispose();
    //azimuthRadiansTextBlock.text = (blochSphere.getAzimuthRadians() / Math.PI).toFixed(2) + "π";
    azimuthRadiansTextBlock.text = azimuthRadiansToPiRadians(blochSphere.getAzimuthRadians());
    azimuthRadiansTextBlock.color = "black";
    azimuthRadiansTextBlock.fontSize = config.fontSize * 0.7;
    azimuthRadiansTextBlock.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

    quantumStateGrid.addControl(probAmplitudeTextBlock0, 0, 0);
    quantumStateGrid.addControl(probAmplitudeTextBlock1, 1, 0);
    //quantumStateGrid.addControl(probabilityTextBlock0, 0, 2);
    //quantumStateGrid.addControl(probabilityTextBlock1, 1, 2);


    ////// Update Dirac notation
    quantumStateDiracGrid.addControl(probabilityTextBlock0, 1, 1)
    quantumStateDiracGrid.addControl(probabilityTextBlock1, 1, 3)
    quantumStateDiracGrid.addControl(azimuthRadiansTextBlock, 0, 5)
        ////// END Update Dirac notation


    ////// Update Quantum Phase display
    if (vectorPasted) {
        ground.visibility = 0;
    } else {
        ground.visibility = 1;
    }
    quantumPhaseDisk.updateQuantumPhaseLine();

    // let quantumPhaseCartesianCoords = getQuantumPhaseCartesianCoords();
    //
    // //Array of points to construct Bloch X axis line
    // quantumPhasePoints = [
    //     quantumPhaseCylinder.position,
    //     //new BABYLON.Vector3(0, 0, 2)
    //     quantumPhaseCartesianCoords
    // ];

    // if (quantumPhaseLine) quantumPhaseLine.dispose();
    // quantumPhaseLine =
    //     BABYLON.MeshBuilder.CreateLines("quantumPhasePoints",
    //         {points: quantumPhasePoints}, this.scene);
    // quantumPhaseLine.color = new BABYLON.Color3(0, 0, 0);
    // quantumPhaseLine.width = 5;


    ////// END Update Quantum Phase display
}