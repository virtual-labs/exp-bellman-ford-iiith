'use strict';
import { states, graph,numNodes } from "./randomGraph.js";
import { cy } from "./displayGraph.js";
import { refreshComponents, changeColorGraph, colorPreviousEdges,areEqual } from "./helper.js";
const observ = document.getElementById("observations");
window.refreshWorkingArea = refreshWorkingArea;
window.openIteration = openIteration;
window.submitIteration = submitIteration;
let selectedIteration = 0;
let iterEdgeList = {};

function createDistanceAndParentTable() {
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    d[0] = 0;
    p[0] = 0;
    for (let i = 0; i < numNodes-1; i++) {
        for (const edge of graph) {
            const edgeId = edge.source.toString() + ":" + edge.target.toString();
            if (iterEdgeList[i].includes(edgeId) && d[edge.source] + edge.weight < 1e6) {
                d[edge.target] = d[edge.source] + edge.weight;
                p[edge.target] = edge.source;
            }
        }
    }
    let tableBody = "";
    for (let node = 0; node < numNodes; node++) {
        if (d[node] < 1e6) {
            tableBody += `<tr><th>${node}</th><th>${d[node]}</th><th>${p[node]}</th></tr>`
        } else {
            tableBody += `<tr><th>${node}</th><th>INF</th><th>-1</th></tr>`
        }
    }
    document.getElementById("table-body").innerHTML = tableBody;
}

function submitIteration() {
    document.getElementById("table-body").innerHTML = "";
    for (let iter = 0; iter < numNodes-1; iter++) {
        if (!areEqual(iterEdgeList[iter], states[iter].selectedEdges)) {
            observ.innerHTML = "<span>&#10007;</span> Fail";
            observ.className = "failure-message";
            createDistanceAndParentTable();
            return;
        }
    }
    observ.innerHTML = "<span>&#10003;</span> Success";
    observ.className = "success-message";
    let tableBody = "";
    for (let node = 0; node < numNodes; node++) {
        if (states[5].distance[node] < 1e6) {
            tableBody += `<tr><th>${node}</th><th>${states[5].distance[node]}</th><th>${states[5].parent[node]}</th></tr>`
        } else {
            tableBody += `<tr><th>${node}</th><th>INF</th><th>-1</th></tr>`
        }
    }
    document.getElementById("table-body").innerHTML = tableBody;

}

function openIteration(evt, iterNumber) {
    selectedIteration = parseInt(iterNumber[iterNumber.length - 1])
    // remove classname is-active from id iteration0 to iteration 5
    for (let iter = 0; iter < numNodes-1; iter++) {
        document.getElementById("iteration" + iter.toString()).classList.remove("is-active")
    }
    evt.currentTarget.className += " is-active";
    changeColorGraph("lightgreen");
    colorPreviousEdges(iterEdgeList[selectedIteration]);
}



export function refreshWorkingArea() {
    selectedIteration = 0;
    document.getElementById("table-body").innerHTML = "";
    iterEdgeList = {};
    for (let i = 0; i < numNodes-1; i++) {
        iterEdgeList[i] = [];
    }
    refreshComponents();
}
cy.on('tap', 'edge', function (evt) {
    let edge = evt.target;
    if (iterEdgeList[selectedIteration].includes(edge.id())) {
        iterEdgeList[selectedIteration].splice(iterEdgeList[selectedIteration].indexOf(edge.id()), 1);
        edge.style('line-color', 'lightgreen');
    }
    else {
        iterEdgeList[selectedIteration].push(edge.id());
        edge.style('line-color', 'red');
    }
});
refreshWorkingArea();