'use strict';
import { removeEdges } from "./showEdges.js";
import { cy,addEdges } from "./displayGraph.js";
import { states, makeGraph, numNodes, graph, numEdges } from "./randomGraph.js";
const observ = document.getElementById("observations")

export function showInfo(){
    let info = document.getElementsByClassName("tooltiptext")[0];
    if(info.style.visibility === "visible"){
        info.style.visibility = "hidden";
    }
    else{
        info.style.visibility = "visible";
    }
}

export function refreshComponents(){
    observ.innerHTML = "";
    removeEdges();
    makeGraph();
    addEdges();
    document.getElementById("iteration0").click();
    fillStates();
}

export function changeColorGraph(edgeColor) {
    cy.edges().style('line-color', edgeColor);
}

export function colorPreviousEdges(selectedEdges) {
    selectedEdges.forEach((edgeId) => {
        cy.edges('[id=\'' + edgeId + '\']').style('line-color', "red");
    });
}
export function areEqual(array1, array2) {
    if (array1.length === array2.length) {
        return array1.every(element => {
            if (array2.includes(element)) {
                return true;
            }
            return false;
        });
    }
    return false;
}

export function fillStates() {
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    d[0] = 0;
    p[0] = 0;
    for (let i = 0; i < numNodes; ++i) {
        let tempState = {};
        let selectedEdges = [];
        for (const edge of graph) {
            const edgeId = edge.source.toString() + ":" + edge.target.toString();
            if (d[edge.source] + edge.weight < d[edge.target] && d[edge.source] + edge.weight < 1e6) {
                d[edge.target] = d[edge.source] + edge.weight;
                p[edge.target] = edge.source;
                selectedEdges.push(edgeId);
            }
        }
        tempState["selectedEdges"] = selectedEdges;
        tempState["distance"] = d.slice();
        tempState["parent"] = p.slice();
        states[i] = tempState;
    }
}