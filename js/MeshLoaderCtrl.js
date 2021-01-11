let Showroom, ShowroomLoaderTask, CloudsTask
let Weather_C_ProductsTask, Weather_X_ProductsTask, Weather_S_ProductsTask, Weather_C_P, Weather_X_P, Weather_DISPLAY_P, 
    plane_1, plane_2, plane_3, plane_4


function LoadAssets(scene, assetsManager) {
    //Weather S
    Weather_S_P = new BABYLON.TransformNode("Weather_S_P");
    plane_3 = BABYLON.MeshBuilder.CreatePlane("plane_3", {size:150}, scene);
    plane_3.position.y = 50;
    plane_3.parent = Weather_S_P;

    //Weather C
    Weather_C_P = new BABYLON.TransformNode("Weather_C_P");
    plane_1 = BABYLON.MeshBuilder.CreatePlane("plane_1", {size:150}, scene);
    plane_1.position.y = 50;
    plane_1.parent = Weather_C_P;

    //Weather X
    Weather_X_P = new BABYLON.TransformNode("Weather_X_P");
    plane_2 = BABYLON.MeshBuilder.CreatePlane("plane_2", {size:150}, scene);
    plane_2.position.y = 50;
    plane_2.parent = Weather_X_P;

    Weather_DISPLAY_P = new BABYLON.TransformNode("Weather_DISPLAY_P");
    plane_4 = BABYLON.MeshBuilder.CreatePlane("plane_4", {size:150}, scene);
    plane_4.position.y = 50;
    plane_4.parent = Weather_DISPLAY_P;

    //CanyonEnvTask
    CanyonEnvTask = assetsManager.addCubeTextureTask("CanyonEnvTask", "./assets/Studio_Softbox_2Umbrellas_cube_specular (1).dds");

    CanyonEnvTask.onSuccess = function (task) {
        hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(task.texture.name, scene);
        //hdrTexture = task.texture
        hdrTexture.rotationY = 65 * (Math.PI / 180);
        hdrTexture.level = 0.6

        hdrSkyboxMaterial = new BABYLON.PBRMaterial("hdrSkyBox", scene);
        hdrSkyboxMaterial.backFaceCulling = false;
        hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
        hdrSkyboxMaterial.reflectionTexture.level = 0.1
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        hdrSkyboxMaterial.microSurface = 1.0;
        hdrSkyboxMaterial.disableLighting = false;

        // Create Skybox from hdri
        hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
        hdrSkybox.visibility = 0
        hdrSkybox.material = hdrSkyboxMaterial;
        hdrSkybox.infiniteDistance = false;

    }
    CanyonEnvTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }

    //CLoudsTask
    CloudsTask = assetsManager.addCubeTextureTask("CloudsTask", "./assets/TropicalSunnyDay");

    CloudsTask.onSuccess = function (task) {
        cloudsText = task.texture
        var cloudsBox = BABYLON.MeshBuilder.CreateBox("cloudsBox", { size: 500 }, scene);
        var cloudsMat = new BABYLON.StandardMaterial("cloudsMat", scene);
        cloudsMat.backFaceCulling = false;
        cloudsMat.reflectionTexture = cloudsText
        cloudsMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        cloudsMat.disableLighting = true;
        cloudsBox.material = cloudsMat;


    }
    CloudsTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }


    Showroom_P = new BABYLON.TransformNode("Showroom_P");
    ShowroomLoaderTask = assetsManager.addMeshTask("", "", "./assets/Henkel_Messe.glb")

    ShowroomLoaderTask.onSuccess = function (task) {

        task.loadedMeshes[0].position.x = 0
        task.loadedMeshes[0].position.y = 0
        task.loadedMeshes[0].parent = Showroom_P
        Showroom_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    }

    ShowroomLoaderTask.onError = function (task, message, exception) {
        console.log(message, exception);
    }


    //FINISH

    var pbr
    assetsManager.onFinish = function (task) {
        CreateCustomMaterials()
        ChangeMaterialProperties()
        AccessModelsForFunctionality()
        AddGlow()
        HandleWebglSetup()
        let barWidth = parseInt(document.getElementById("trueWidth").style.maxWidth, 10); 
        console.log(barWidth)
        let middleCanvas = canvas.width/2
        console.log(middleCanvas)
        let iconSize = document.getElementById("sn-4").width
        console.log(iconSize)
        let middleDistance = (middleCanvas - iconSize/2).toString() + "px"
        console.log(middleDistance)
        document.getElementById("sn-4").style.left= middleDistance
        disableAllColliders();
    }
    //Asset Manager check
    assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
        engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
        document.getElementsByClassName("text-progress")[0].innerHTML = (100 - remainingCount / totalCount * 100).toFixed() + "%"
    };

    assetsManager.load();
}

let RadarPositions = []
let DiscoverMeshes = []
let ClickableObjects = [];
const AnchorPosition = []
const AnchorLookAt = []
let Ref_Middle_P, MiddleProduct
function AccessModelsForFunctionality() {
    // By  Mesh
    scene.meshes.forEach(elem => {
        //Walker Nav Collisions
        if (elem.name.startsWith("c_")) {
            elem.checkCollisions = true;
            elem.isVisible = false;
        }
        //disable original non baked objects
        else if (elem.name.startsWith("or_")) {
            elem.isVisible = false
        }
        else if (elem.name.startsWith("P_1")) {
            elem.isVisible = false
            Weather_DISPLAY_P.position = elem.getAbsolutePosition()
            Weather_DISPLAY_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_DISPLAY_P.position.y = 12
            Weather_DISPLAY_P.rotation.y = 230 * (Math.PI / 180)
            //feedWithCollider(Weather_DISPLAY_P, 100, 100, 25, 0, 25, 0)
        }
        //weather c
        else if (elem.name.startsWith("P_2")) {
            RadarPositions[0] = new BABYLON.Vector3(elem.getAbsolutePosition().x, 12, elem.getAbsolutePosition().z)
            elem.isVisible = false
            Weather_C_P.position = elem.getAbsolutePosition()
            Weather_C_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_C_P.position.y = 12
            Weather_C_P.rotation.y = 230 * (Math.PI / 180)
            feedWithCollider(Weather_C_P, 100, 100, 25, 0, 25, 0)
        }
        //weather x
        else if (elem.name.startsWith("P_3")) {
            RadarPositions[1] = new BABYLON.Vector3(elem.getAbsolutePosition().x, 12, elem.getAbsolutePosition().z)
            elem.isVisible = false
            Weather_X_P.position = elem.getAbsolutePosition()
            Weather_X_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_X_P.position.y = 12
            Weather_X_P.rotation.y = -45 * (Math.PI / 180)
            //feedWithCollider(Weather_X_P, 100, 100, 25, 0, 25, 0)
        }
        //weather s
        else if (elem.name.startsWith("P_4")) {
            RadarPositions[2] = new BABYLON.Vector3(elem.getAbsolutePosition().x, 12, elem.getAbsolutePosition().z)
            elem.isVisible = false
            Weather_S_P.position = elem.getAbsolutePosition()
            Weather_S_P.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
            Weather_S_P.position.y = 12
            Weather_S_P.rotation.y = 230 * (Math.PI / 180)
            //feedWithCollider(Weather_S_P, 100, 100, 25, 0, 25, 0)
        }

        // radar discover
        else if (elem.name.startsWith("Discover_")){
            elem.rotationQuaternion = null
            elem.rotation.x = 0 * (Math.PI / 180)
            elem.rotation.y = 0 * (Math.PI / 180)
            elem.rotation.z = 0 * (Math.PI / 180)
            DiscoverMeshes.push(elem)
        }
        //screen colliders
        else if (elem.name.startsWith("ms")){
            elem.material = colMat;
            let num = elem.name.slice(-1)
            num = parseInt(num)
            MouseOverAble(elem, num)
        }


    })

    //By Null Node
    scene.transformNodes.forEach(elem => {
        if (elem.name == "New Product") {
            //elem.setEnabled(false)
        }
        else if (elem.name == "Middle New Product") {
            elem.rotationQuaternion = null
            elem.rotation.y = 90 * (Math.PI / 180)
            elem.rotation.z = 90 * (Math.PI / 180)
            MiddleProduct = elem

        }
        else if (elem.name == "Pdf Cloner") {
            elem.getChildren().forEach(mesh => {
                //feedWithCollider(mesh, 6, 0.1, 20, 0, 0, 0)
            })
        }
        else if (elem.name == "Station Anchors") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                AnchorPosition.push(mesh.getAbsolutePosition())
            })
        }
        else if (elem.name == "Station LookAt") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                AnchorLookAt.push(mesh.getAbsolutePosition())
            })
        }
        else if (elem.name == "Area Colliders") {
            elem.getChildren().forEach(mesh => {
                mesh.isVisible = false
                mesh.collisionResponse = true
                //feedWithAreaCollider(mesh, 100, 500, 750, 0, 20, 0)
                scene.registerBeforeRender(function () {
                    if (mesh.intersectsMesh(camcoll, true)) {
                        document.getElementById('debugger-camera-area').innerHTML = mesh.name
                        let n = mesh.name.charAt(0)
                        if(CheckIn(n) && !isAnimatingCam){
                            let indexElem = parseInt(n)
                            let elemID = "go-" + indexElem
                            console.log(indexElem)
                            //handleUISelection(document.getElementById(elemID), parseInt(n))
                            //Handle Weather Controls automatically
                            //showMenuControl(indexElem)
                        } 
                    }
                });
            })
        }
    })
}

function feedWithCollider(elem, h, w, d, xOffset, yOffset, zOffset) {
    let elemColl = new BABYLON.MeshBuilder.CreateBox("Collider " + elem.name, { height: h, width: w, depth: d }, scene)
    elemColl.position = new BABYLON.Vector3(xOffset, yOffset, zOffset)
    elemColl.parent = elem;
    elemColl.material = colMat;
    elemColl.isPickable = true;
    ClickableObjects.push(elemColl)

    elemColl.actionManager = new BABYLON.ActionManager(scene);
	
	//ON MOUSE ENTER
	elemColl.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){	

	}));
	
	//ON MOUSE EXIT
	elemColl.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){

	}));
}


function MouseOverAble(mesh, num){
    mesh.isPickable = true;
    mesh.actionManager = new BABYLON.ActionManager(scene);
	
	//ON MOUSE ENTER
	mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){	
        screenMat.emissiveTexture = ScreenHighlights[num]
        console.log("entered to " + mesh.name)
        console.log(screenMat.emissiveTexture.name)
	}));
	
	//ON MOUSE EXIT
	mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
        screenMat.emissiveTexture = ScreenHighlights[0]
        console.log("out of " + mesh.name)
	}));
}





