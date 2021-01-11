
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var page = document.title
let radarSpotLight, omniLight

/******* Add the create scene function ******/
var createScene = function () {

    // Create the scene space
    scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics();
    scene.gravity = new BABYLON.Vector3(0, -1, 0);

    // GameManager
    var assetsManager = new BABYLON.AssetsManager(scene)
    LoadAssets(scene, assetsManager, page)
    SetupCameras(scene)
    CreateLights()

    scene.onPointerMove = function () {
        //updates rotation of hotspots
        // if (currentWorld == "plane") {
        //     for (let hs of HsPLaneList) {
        //         A_LooksAt_B(hs, camera)
        //     }
        // }

        

    }

    scene.onPointerDown = function (evt, pickResult) {
        // We try to pick an object
        console.log(pickResult.pickedMesh.name)
        // GET ALL COLIDERS!!!!!!!!!!b
        if (pickResult.hit && pickResult.pickedMesh.name == "Collider Weather_C_P") {
            console.log(pickResult.pickedMesh.name)
            document.getElementsByClassName("layer1")[0].parentNode.classList.remove("close")
        }
        else if(pickResult.hit && pickResult.pickedMesh.name.startsWith("ms_")){
            ClickOnMS(pickResult.pickedMesh)
        }
    };


    return scene;
};
/******* End of the create scene function ******/

engine = createDefaultEngine();
if (!engine) throw 'WARNING: engine should not be null.';
scene = createScene();;
sceneToRender = scene

engine.runRenderLoop(function () {
    if (sceneToRender) {
        sceneToRender.render();
        //Debug Stuff
        document.getElementById('debugger-camera').innerHTML = walkerCam.absoluteRotation.y
        document.getElementById('debugger-fps').innerHTML = engine.getFps().toFixed() + "fps"
        AnimateEveryFrame()
        A_LooksAt_B(Weather_C_P, walkerCam)
        A_LooksAt_B(Weather_X_P, walkerCam)
        A_LooksAt_B(Weather_S_P, walkerCam)
        A_LooksAt_B(Weather_DISPLAY_P, walkerCam)
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

// CHANGE SCENE LOOK
function CreateLights() {

    omniLight = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 0, 0), scene);
    radarSpotLight = new BABYLON.SpotLight("radarSpotLight", new BABYLON.Vector3(64.18, 25, -14.35), new BABYLON.Vector3(0, -1, 0.0), 120 * (Math.PI / 180), 2, scene);
    radarSpotLight.intensity = 1500

}

function HandleWebglSetup() {
    //fix lighting for webgl 1
    if (engine.webGLVersion === 1) {
        console.log("this runs on IOS and only supports Webgl 1")
        omniLight.intensity = 0.5
        hdrTexture.level = 1
        //engine.getCaps().highPrecisionShaderSupported = false;
    }
    else {
        omniLight.intensity = 0.2
    }
}

function AddGlow() {
    // Add lights to the scene
    var gl = new BABYLON.GlowLayer("glow", scene, {
        mainTextureFixedSize: 1024 * 2,
        blurKernelSize: 64
    });
    gl.intensity = 0.5;
    // scene.meshes.forEach(elem => {
    //     if(elem.name.startsWith("Screen_") || elem.name =="Video_Screens"){
    //         gl.addExcludedMesh(elem)
    //     }
    // });
}

function makeLightScatter(mesh, scene) {
    var godrays = new BABYLON.VolumetricLightScatteringPostProcess(
        'godrays', 0.9, walkerCam, mesh, 100,
        BABYLON.Texture.BILINEAR_SAMPLINGMODE, engine, true);
    godrays.exposure = 0.15;
    mesh.material = new BABYLON.StandardMaterial(null, scene);
    mesh.material.diffuseTexture = new BABYLON.Texture("assets/light_boden.jpg", scene);

}

