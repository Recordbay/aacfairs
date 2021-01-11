
let MainSceneMats=[]
let Led_Radar_Mats = []
let Led_Pdf_Mats = []
let Radar_Mats = []
let Radar_C_Mats = []
let Radar_X_Mats = []
let Radar_S_Mats = []
let logo_anim_vid;
let screenMat;
let blackText, ms1Text, ms2Text, ms3Text, ms4Text;
let ScreenHighlights=[];
function ChangeMaterialProperties() {

    Radar_Mats.push(Radar_C_Mats,Radar_X_Mats, Radar_S_Mats)
    //name references to check
    Radar_C_Mats.push("CGroup")
    Radar_X_Mats.push("XGroup")
    Radar_S_Mats.push("SGroup")

    logo_anim_vid = CreateVideoTexture("logo_anim_vid", "./assets/UV_Screen_03.mp4")
    blackText = new BABYLON.Texture("./assets/full_black.jpg", scene)
    ScreenHighlights[0] = blackText
    ms1Text = new BABYLON.Texture("./assets/ms highlight 3.jpg", scene)
    ScreenHighlights[1] = ms1Text
    ms2Text = new BABYLON.Texture("./assets/ms highlight 4.jpg", scene)
    ScreenHighlights[2] = ms2Text
    ms3Text = new BABYLON.Texture("./assets/ms highlight 1.jpg", scene)
    ScreenHighlights[3] = ms3Text
    ms4Text = new BABYLON.Texture("./assets/ms highlight 2.jpg", scene)
    ScreenHighlights[4] = ms4Text
    
    var redLeo = new BABYLON.Color3.FromHexString("#FF0000");
    var blueBay = new BABYLON.Color3.FromHexString("#063c9d");
    var lightGrayBay = new BABYLON.Color3.FromHexString("#eeeeee");
    var darkGrayBay = new BABYLON.Color3.FromHexString("#909090");
    var blackBay = new BABYLON.Color3.FromHexString("#000000");

    var GrayLight = new BABYLON.Color3.FromHexString("#FFFFFF");
    var GrayDark = new BABYLON.Color3.FromHexString("#EDEDED");

    var yellow = new BABYLON.Color3.FromHexString("#E19A00");

    let sceneMats = scene.materials;
    for (let mat of sceneMats) {
        // console.log(mat.name)
        if (mat.name == "hdrSkyBox" || mat.name == "cloudsMat") {
            continue;
        }

        mat.reflectionTexture = hdrTexture;
        mat.transparencyMode = 2
                
        MainSceneMats.push(mat)
        if(mat.name == "Gray Wall A"){
            mat.albedoColor = GrayLight
            mat.roughness = 0.3
        }

        else if(mat.name == "Gray Wall B" || mat.name == "or_Ecken" || mat.name == "or_Dach down"){
            mat.albedoColor = GrayDark
            mat.roughness = 0.2
        }

        else if(mat.name.startsWith("Led R") ) {
            Led_Radar_Mats[BandToIndex(mat.name.charAt(6))] = mat
        }

        else if(mat.name.startsWith("pdf") ) {
            Led_Pdf_Mats[parseInt(mat.name.charAt(3))] = mat
        }

        else if(mat.name == "White Wall" || mat.name == "Boden up"){
            mat.albedoColor = GrayLight
            mat.roughness = 0.3
        }
        else if(mat.name == "Led Names"){
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#616161")
        }
        else if(mat.name == "Led New P"){
            mat.albedoColor = redLeo
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#ff0000")
            mat.roughness = 0.25
        }
        else if(mat.name == "Market Segments Mats"){
            mat.emissiveColor = darkGrayBay;
            mat.emissiveTexture = blackText;
            screenMat = mat;
        }

        else if(mat.name == "Screen Texture"){
            console.log("I AM HERE")
            mat.albedoTexture = logo_anim_vid
        }
        else if(mat.name == "White Led plus"){
            mat.emissiveColor = new BABYLON.Color3.FromHexString("#FFFFFF")
        }

        else if(mat.name == "White Metal"){
            mat.albedoColor = GrayLight
            mat.metallic = 1
            mat.roughness = 0.8
        }
        
        else if(mat.name == "Touch Glass"){
            mat.albedoColor = GrayLight
            mat.metallic = 0.2
            mat.roughness =0.25
        }

        else if(mat.name == "Red Logo" || mat.name == "Red WAll"){
            mat.albedoColor = redLeo
            mat.metallic = 0.4
            mat.roughness =0.33
        }

        else if(mat.name == "coll Mat"){
            mat.alpha = 0
            mat.transparencyMode = 2
        }
        else if(mat.name =="60dx boden"){
            mat.unlit = true
        }
        else if (mat.name.startsWith("discover")){
            mat.albedoColor = redLeo
            mat.metallic = .15
            mat.roughness = 0.25
        }
    }
}

function UpdateEnvReflections(hdr){
    let sceneMats = scene.materials;
    for (let mat of sceneMats) {
        if (mat.name == "hdrSkyBox" ) {
            continue;
        }
        mat.reflectionTexture = hdr;
    }

}

var colMat
function CreateCustomMaterials() {
    colMat = new BABYLON.StandardMaterial("colMat", scene)
    colMat.wireframe = true
    colMat.alpha = 0;

    let plane_1_text = new BABYLON.Texture("./assets/em battery pack.png", scene)
    let plane_1_mat = new BABYLON.PBRMaterial("plane_1_mat", scene)
    plane_1_mat.albedoTexture = plane_1_text
    plane_1_mat.opacityTexture = plane_1_text
    plane_1.material = plane_1_mat
    plane_1.material.unlit = true

    let plane_2_text = new BABYLON.Texture("./assets/em power conversion.png", scene)
    let plane_2_mat = new BABYLON.PBRMaterial("plane_2_mat", scene)
    plane_2_mat.albedoTexture = plane_2_text
    plane_2_mat.opacityTexture = plane_2_text
    plane_2.material = plane_2_mat
    plane_2.material.unlit = true

    let plane_3_text = new BABYLON.Texture("./assets/em edrive.png", scene)
    let plane_3_mat = new BABYLON.PBRMaterial("plane_2_mat", scene)
    plane_3_mat.albedoTexture = plane_3_text
    plane_3_mat.opacityTexture = plane_3_text
    plane_3.material = plane_3_mat
    plane_3.material.unlit = true

    let plane_4_text = new BABYLON.Texture("./assets/display solutions plane.png", scene)
    let plane_4_mat = new BABYLON.PBRMaterial("plane_4_mat", scene)
    plane_4_mat.albedoTexture = plane_4_text
    plane_4_mat.opacityTexture = plane_4_text
    plane_4.material = plane_4_mat
    plane_4.material.unlit = true
}

function createVideoMat() {

    var videoMat = new BABYLON.PBRMaterial("videoMat", scene);
    videoMats.push(videoMat)
    var dotsText = new BABYLON.Texture("./assets/videoDots2.jpg", scene, true, false)
    var ambientScreen = new BABYLON.Texture("./assets/screenAmbient.jpg", scene, true, false)
    videoMat.ambientTexture = ambientScreen
    videoMat.bumpTexture = dotsText
    videoMat.bumpTexture.level = 0
    videoMat.bumpTexture.uScale = 1
    videoMat.bumpTexture.vScale = 1
    videoMat.emissiveColor = new BABYLON.Color3.FromHexString("#313131")
    videoMat.metallic = 0
    videoMat.roughness = 0

    return videoMat;
}
function CreateVideoTexture(name, url){
    var vidText = new BABYLON.VideoTexture(name, url, scene, true, false);
    vidText.vScale = 1
    vidText.uScale = -1
    vidText.video.pause()
    vidText.video.loop = true
    //vidText.getAlphaFromRGB =true
    return vidText;
}
