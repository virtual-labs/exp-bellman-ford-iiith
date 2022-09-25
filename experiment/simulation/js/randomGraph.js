'use strict';
function getRandomArbitrary(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}
export let states = {};

export let graph = [];
export let selectedEdge = [];
export let numEdges;
export let numNodes = 7;
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

function NegCycleBellmanFord(numEdges) {
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    let stopped;
    for (let i = 0; i < numNodes; ++i) {
        stopped = -1;
        for (const edge of graph) {
            if (d[edge.source] + edge.weight < d[edge.target]) {
                d[edge.target] = d[edge.source] + edge.weight;
                p[edge.target] = edge.source;
                stopped = edge.target;
            }
        }
    }

    if (stopped !== -1) {
        for (let i = 0; i < numNodes; ++i)
            stopped = p[stopped];

        let cycle = [];
        for (let v = stopped; ; v = p[v]) {
            cycle.push(v);
            if (v == stopped && cycle.length > 1)
                break;
        }
        cycle.reverse();
        resolveNegCycle(cycle);
    }
}

export function makeGraph() {
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

export function clearGraph() {
    states = {};
    graph = [];
}
