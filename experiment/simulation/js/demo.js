'use strict';
import { graph, makeGraph } from "./randomGraph.js";
import { addEdges, cy } from "./displayGraph.js";
import {simulationStatus,restartCircuit,fillStates,previousSimulation} from "./graphDemo.js"
import {clearGraph} from "./randomGraph.js";
import {hideEdge} from "./showEdges.js";
window.simulationStatus = simulationStatus;
window.previousSimulation = previousSimulation;
window.restartCircuit = restartCircuit;
window.showInfo = showInfo;
export const connectionMap = new Map();
export let componentsList = [];
const EMPTY="";
const container = document.getElementById("diagram");
container.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
window.refreshWorkingArea = refreshWorkingArea;

export function refreshTable(){
    document.getElementById("table-body").innerHTML = EMPTY;
}

function showInfo(){
    let info = document.getElementsByClassName("tooltiptext")[0];
    if(info.style.visibility === "visible"){
        info.style.visibility = "hidden";
    }
    else{
        info.style.visibility = "visible";
    }
}

export function removeEdges(){
    for(let i in graph){
        let src = graph[i].source.toString();
        let dest = graph[i].target.toString();
        let edgeId = src + ":" +dest;
        hideEdge(edgeId);
    }
    cy.remove(cy.edges());
    // empty graph
    clearGraph();
}

export function refreshWorkingArea() {
    makeGraph();
    addEdges(null);
    fillStates();
}
refreshWorkingArea();