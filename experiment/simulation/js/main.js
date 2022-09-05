'use strict';
import { compNodes, resetCounts } from "./integrate.js";
import { jsplumbInstance, editConnectionMap } from "./components.js";
import { makeGraph, printGraph } from "./randomGraph.js";
import { addEdges } from "./displayGraph.js";
export const connectionMap = new Map();
export let componentsList = [];
const EMPTY="";
const container = document.getElementById("diagram");
container.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});
window.refreshWorkingArea = refreshWorkingArea;

function emptyList() {
    for(const component of componentsList) {
        let elem = document.getElementById(component.id);
        elem.parentNode.removeChild(elem);
    }
    componentsList = [];
}
export function refreshObservations() {
    // refresh the errors
    document.getElementById("error-container").style.display="none";   
    document.getElementById("output-text").innerHTML = EMPTY;
    document.getElementById("graph-image").style.display = "none";
}

export function refreshTable(){
    document.getElementById("table-body").innerHTML = EMPTY;
}

export function refreshWorkingArea() {
    // to reset the working area
    jsplumbInstance.deleteEveryEndpoint();
    editConnectionMap();
    emptyList();
    resetCounts();
    makeGraph();
    addEdges();
    refreshObservations();
}
refreshWorkingArea();