let slideNum = 0
function toNextQuestion(){
    slideNum++
    if(slideNum>3){
        toFirstQuestion()
        return
    }
    let slidePath = "assets/ui/Quiz_0"+ parseInt(slideNum) + ".png"
    document.getElementById("quiz-screen").src = slidePath

}

function toFirstQuestion(){
    slideNum = 0
    document.getElementById("quiz-screen").src = "assets/ui/Quiz_00.png"
}

//MARKET SEGMENTS
//Select MS
function ClickOnMS(mesh){
    //alert(mesh.name)
    document.getElementById("overlay-ms").classList.remove("close");
    document.getElementById("overlay-ms").children[0].children[0].children[1].innerHTML = MarketSegmentsDict[mesh.name][0]
    document.getElementById("overlay-ms").children[0].children[1].children[0].children[0].innerHTML = MarketSegmentsDict[mesh.name][1]
    document.getElementById("overlay-ms").children[0].children[1].children[1].children[0].src = MarketSegmentsDict[mesh.name][2]
}

let MarketSegmentsDict = {
    "ms_1":["E-MOBILITY", "Henkel provides solutions for bonding, connecting, protecting and thermal managements for batteries, e-Drive and power conversion components. In this way, it gives its customers a competitive advantage that reaches from the individual cell through to the control unit.", "./assets/ui/emo icon.png"],
    "ms_2": ["AUTOMOTIVE ELECTRONICS", "Henkel provides solutions for bonding, connecting, protecting and thermal managements for batteries, e-Drive and power conversion components. In this way, it gives its customers a competitive advantage that reaches from the individual cell through to the control unit.", "./assets/ui/auto icon.png"],
    "ms_4": ["EXTERIOR, POWERTRAIN, INTERIOR, CHASSIS", "Since many years Henkel serves companies that produce Exterior, Interior, Powertrain and Chassis Components. We offer solutions for assembly, sealing and protection of parts like headlamps, combustion engines or liftgates. This enables component manufacturers to respond to increasing requirements such as joining of dissimilar plastics, porosity sealing or protection against oils and coolants in the engine compartment.", "./assets/ui/epic icon.png"],
    "ms_3": ["SURFACE TREATMENT, CLEANERS & LUBRICANTS", "Henkel Automotive Components offers surface treatments, cleaners and lubricants for the metal processing industry. This includes innovative die casting and forging lubricants, water-based machining and grinding fluids, neutral cleaners, as well as pretreatment solutions for steel, galvanized and light metal substrates. Our deep technology know-how along the whole value chain enables us to provide the best possible processes solutions to our customers.", "./assets/ui/stcl icon.png"]
}


async function agendaClick(){
    //close overlay blcoker
    let overlays = document.getElementsByClassName("overlay-blocker");
    for(let ov of overlays){
        if(ov.id=="agenda"){
            continue;
        }
        ov.classList.add("close")
    }
    await document.getElementById("agenda").classList.toggle("close");
}

function chatClick(){
    document.getElementById("chat").classList.toggle("close");
}