let walkerCam, rotateCam, InfoColliders, arrowColliders, pointerMesh, pointerFake, isLocked, camcoll
let collideButonNum = 0
let overButton = false;
var walkerSelection;
function SetupCameras(scene) {
    //collect infocolliders
    CreateWalkerCam(scene)
    rotateCam = CreateRotateCam(scene, "mainRotateCam", new BABYLON.Vector3(0, 5, 0))

    //SetWalkerMouseInteraction()
    //CreateRaycast(scene)

}

function SetWalkerMouseInteraction() {
    //We start without being locked.
    isLocked = false;

    // On click event, request pointer lock
    scene.onPointerDown = function (evt) {
        //hitObj = checkInfoHit();
        //console.log("isLocked ? " + isLocked)
        if (scene.activeCamera == walkerCam) {
            if (!isLocked) {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }
        }
    }
    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function () {
        var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
        // If the user is already locked
        if (!controlEnabled) {
            //camera.detachControl(canvas);
            isLocked = false;
        } else {
            //camera.attachControl(canvas);
            isLocked = true;
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

}

let camPos
function CreateWalkerCam(scene) {
    // Parameters : name, position, scene
    camPos = new BABYLON.Vector3(0,14.07,140)
    walkerCam = new BABYLON.UniversalCamera("walkerCam", camPos, scene);
    //walkerCam.detachControl(canvas);
    //camPos.x = 42

    // Targets the camera to a particular position. In this case the scene origin
    walkerCam.setTarget(new BABYLON.Vector3(0, 21.076, 0));
    //different sensibilit for mobile and desktop
    if (isMobileDevice()){
        alert("hello mobile")
        walkerCam.touchAngularSensibility = 40000
    }
        
    else{
        console.log("hello desktop")
        walkerCam.angularSensibility = 4000
    }
        

    // Attach the camera to the canvas
    walkerCam.applyGravity = true;
    walkerCam.ellipsoid = new BABYLON.Vector3(0.2, 7, 0.1);
    walkerCam.checkCollisions = true;
    walkerCam.minZ = 0.05

    //Controls  WASD
    // walkerCam.keysUp.push(87);
    // walkerCam.keysDown.push(83);
    // walkerCam.keysRight.push(68);
    // walkerCam.keysLeft.push(65);
    // walkerCam.speed = 2

    // walkerCam.attachControl(canvas, true);

    // Add collider Object
    camcoll = new BABYLON.MeshBuilder.CreateBox("cam collisionss", { height: 1, width: 1, depth: 1 }, scene)
    camcoll.position.y = -5
    camcoll.position.z = 10
    camcoll.parent = walkerCam;
    //camcoll.material = colMat;

}


//walkerCam.position -> camPos -> Vector3(id=5)
function CreateRotateCam(scene, name, origin) {
    let camera = new BABYLON.ArcRotateCamera(name, 90 * (Math.PI / 180), 80 * (Math.PI / 180), 25, origin, scene);
    camera.minZ = 1
    camera.panningDistanceLimit = 0;
    camera.pinchToPanMaxDistance = 0;
    camera.panningSensibility = 0
    camera.lowerRadiusLimit = 1
    camera.upperRadiusLimit = 100
    camera.upperBetaLimit = 90 * (Math.PI / 180)
    camera.angularSensibilityX = 3000
    camera.angularSensibilityy = 3000
    camera.wheelPrecision = 10
    //camera.attachControl(canvas, false, false, false);

    return camera

}

function jump(rate) {
    walkerCam.cameraDirection.y = rate;
}

let gazingAt = "nothing"
function CreateRaycast(scene) {

    pointerFake = BABYLON.MeshBuilder.CreateSphere('pointerFake', { diameter: .00075 }, scene);
    pointerFake.parent = walkerCam
    pointerFake.position.z = 0.06;

    var ray = new BABYLON.Ray();
    var rayHelper = new BABYLON.RayHelper(ray);

    var localMeshDirection = new BABYLON.Vector3(0, 0, 1);
    var localMeshOrigin = new BABYLON.Vector3(0, 0, 0);
    var length = 200;

    rayHelper.attachToMesh(walkerCam, localMeshDirection, localMeshOrigin, length);

    //rayHelper.show(scene, new BABYLON.Color3(1,0,0));

    pointerMesh = BABYLON.MeshBuilder.CreateSphere('', { diameter: 1 }, scene);
    pointerMat = new BABYLON.PBRMaterial("pointerMat", scene);
    pointerMat.unlit = true
    pointerMat.albedoColor = new BABYLON.Color3.FromHexString("#ea1e1e")
    pointerMat.emissiveColor = new BABYLON.Color3.FromHexString("#ea1e1e")
    pointerMesh.material = pointerMat
    pointerFake.material = pointerMat
    pointerMesh.setEnabled(false);

    scene.registerBeforeRender(function () {

        var hitInfo = ray.intersectsMeshes(ClickableObjects, true);
        if (hitInfo.length) {
            //console.log(hitInfo[0].pickedMesh.name);
            document.getElementById('debugger-text').innerHTML = hitInfo[0].pickedMesh.name
            walkerSelection = hitInfo[0].pickedMesh.name;
            // hitInfo[0].pickedMesh.parent.getChildMeshes()[2].scaling = pulseAnimVector
            //pointerMesh.setEnabled(true);
            //pointerFake.setEnabled(false)
            pointerMesh.position.copyFrom(hitInfo[0].pickedPoint);
            pointerMat.emissiveColor = new BABYLON.Color3(1, 1, 1)
            if(hitInfo[0].pickedMesh.name.startsWith("Collider Weather_")){
                gazingAt = hitInfo[0].pickedMesh.name.charAt(17)
            }
            else if(hitInfo[0].pickedMesh.name.startsWith("Collider Pdf")){
                gazingAt = hitInfo[0].pickedMesh.name.charAt(13)
            }

        } else if(scene.activeCamera){
            walkerSelection = "";
            document.getElementById('debugger-text').innerHTML = "Nothing to select"
            //console.log("hitting nothing");
            //pointerMesh.setEnabled(false);
            pointerFake.setEnabled(true)
            pointerMat.emissiveColor = new BABYLON.Color3.FromHexString("#ea1e1e")
        }

    });
}
