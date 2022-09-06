'use strict';
function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}
let states = {};

export let graph = [];
export let selectedEdge = [];
export let numEdges;
function resolveNegCycle(cycle) {
    let src = cycle[0];
    let dst = cycle[1];
    console.log(src, dst);
    for (let edge in graph) {
        if (graph[edge].source === src && graph[edge].target === dst) {
            graph[edge].weight = 60;
        }
    }
}

function NegCycleBellmanFord(numEdges, numNodes) {
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    let x;
    for (let i = 0; i < numNodes; ++i) {
        x = -1;
        for (let j = 0; j < numEdges; ++j) {
            if (d[graph[j].source] + graph[j].weight < d[graph[j].target]) {
                d[graph[j].target] = d[graph[j].source] + graph[j].weight;
                p[graph[j].target] = graph[j].source;
                x = graph[j].target;
            }
        }
    }

    if (x !== -1) {
        for (let i = 0; i < numNodes; ++i)
            x = p[x];

        let cycle = [];
        for (let v = x; ; v = p[v]) {
            cycle.push(v);
            if (v == x && cycle.length > 1)
                break;
        }
        cycle.reverse();
        resolveNegCycle(cycle);
    }
}

export function makeGraph() {
    let numNodes = 7;
    // fixing 5 edges for better testcase
    graph.push({ source: 0, target: 1, weight: getRandomArbitrary(0, 10) });
    graph.push({ source: 0, target: 2, weight: getRandomArbitrary(0, 10) });
    graph.push({ source: 0, target: 3, weight: getRandomArbitrary(0, 10) });
    graph.push({ source: 3, target: 2, weight: getRandomArbitrary(-10, -5) });
    graph.push({ source: 2, target: 1, weight: getRandomArbitrary(-5, 0) });
    let remainingEdges = getRandomArbitrary(4,6);
    numEdges = remainingEdges + 5;
    while (remainingEdges > 0) {
        let source;
        let target;
        source = Math.floor(Math.random() * (numNodes - 1)) + 1;
        target = Math.floor(Math.random() * numNodes);
        if (source != target) {
            let isPresent = false;
            for (let i = 0; i < graph.length; i++) {
                if (graph[i].source === source && graph[i].target === target) {
                    isPresent = true;
                    break;
                }
            }
            if (!isPresent) {
                let weight = getRandomArbitrary(-10, 10);
                graph.push({ source: source, target: target, weight: weight });
                remainingEdges--;
            }
        }
    }
    graph.reverse();
    NegCycleBellmanFord(numEdges, numNodes);
    console.log(graph);
}

export function printGraph() {

    // create a 7*7 array and mark it as false
    let visited = [];
    for (let i = 0; i < 7; i++) {
        visited[i] = [];
        for (let j = 0; j < 7; j++) {
            visited[i][j] = false;
        }
    }

    let dataTable = "";

    for (let edge in graph) {
        let src = graph[edge].source;
        let dest = graph[edge].target;
        let weight = graph[edge].weight;
        dataTable += "<tr><td>" + src + "</td><td>" + dest + "</td><td>" + weight + "</td></tr>";
        visited[src][dest] = true;
        visited[dest][src] = true;
    }

    const tableElem = document.getElementById("table-body");
    tableElem.insertAdjacentHTML("beforeend", dataTable);

}

export function clearGraph() {
    graph = [];
}
