'use strict';
import { makeGraph, states, numEdges, graph } from "./randomGraph.js";
import { addEdges, cy } from "./displayGraph.js";
import { removeEdges } from "./demo.js";

const observ = document.getElementById("observations");
window.refreshWorkingArea = refreshWorkingArea;
window.openIteration = openIteration;
window.submitIteration = submitIteration;
let selectedIteration = 0;
let iterEdgeList = {};

function fillStates() {
    let numNodes = 7;
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    d[0] = 0;
    p[0] = 0;
    for (let i = 0; i < numNodes; ++i) {
        let tempState = {};
        let selectedEdges = [];
        for (let j = 0; j < numEdges; ++j) {
            const edgeId = graph[j].source.toString() + ":" + graph[j].target.toString();
            if (d[graph[j].source] + graph[j].weight < d[graph[j].target] && d[graph[j].source] + graph[j].weight < 1e6) {
                d[graph[j].target] = d[graph[j].source] + graph[j].weight;
                p[graph[j].target] = graph[j].source;
                selectedEdges.push(edgeId);
            }
        }
        tempState["selectedEdges"] = selectedEdges;
        tempState["distance"] = d.slice();
        tempState["parent"] = p.slice();
        states[i] = tempState;
    }
}


export function pastIteration(iteration) {
    const key = iteration;
    let distance = states[key]["distance"];
    let parent = states[key]["parent"];
    for (let i = 0; i < 7; i++) {
        if (distance[i] < 1e6) {
            document.getElementById("text" + i.toString()).innerHTML = distance[i].toString();
            document.getElementById("parent" + i.toString()).innerHTML = parent[i].toString();
        }
    }
}

function areEqual(array1, array2) {
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

function changeColorGraph(edgeColor) {
    cy.edges().style('line-color', edgeColor);
}

function colorPreviousEdges(selectedEdges) {
    selectedEdges.forEach((edgeId) => {
        cy.edges('[id=\'' + edgeId + '\']').style('line-color', "red");
    });
}

function submitIteration() {
    document.getElementById("table-body").innerHTML = "";
    for (let iter = 0; iter < 6; iter++) {
        if (!areEqual(iterEdgeList[iter], states[iter].selectedEdges)) {
            observ.innerHTML = "<span>&#10007;</span> Fail";
            observ.className = "failure-message";
            return;
        }
    }
    observ.innerHTML = "<span>&#10003;</span> Success";
    observ.className = "success-message";
    let tableBody = "";
    for (let node = 0; node < 7; node++) {
        if (states[5].distance[node] < 1e6) {
            tableBody += `<tr><th>${node}</th><th>${states[5].distance[node]}</th><th>${states[5].parent[node]}</th></tr>`
        }else{
            tableBody += `<tr><th>${node}</th><th>INF</th><th>-1</th></tr>`
        }
    }
    document.getElementById("table-body").innerHTML = tableBody;

}

function openIteration(evt, cityName) {
    selectedIteration = parseInt(cityName[cityName.length - 1])
    // remove classname is-active from id iteration0 to iteration 5
    for (let iter = 0; iter < 6; iter++) {
        document.getElementById("iteration" + iter.toString()).classList.remove("is-active")
    }
    evt.currentTarget.className += " is-active";
    changeColorGraph("lightgreen");
    colorPreviousEdges(iterEdgeList[selectedIteration]);
}



export function refreshWorkingArea() {
    selectedIteration = 0;
    document.getElementById("table-body").innerHTML = "";
    observ.innerHTML = "";
    iterEdgeList = {};
    for (let i = 0; i < 6; i++) {
        iterEdgeList[i] = [];
    }
    removeEdges();
    makeGraph();
    addEdges(null);
    fillStates();
    document.getElementById("iteration0").click();
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