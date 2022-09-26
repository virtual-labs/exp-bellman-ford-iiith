**Brief History**

The algorithm was first proposed by Alfonso Shimbel, but is instead named after Richard Bellman and Lester Ford Jr., who published it in 1958 and 1956, respectively. Edward F. Moore also published a variation of the algorithm in 1959, and for this reason, it is also sometimes called the Bellman-Ford-Moore algorithm. The algorithm helps us to find the shortest distance from a source vertex to all other vertices in a weighted graph. It is slower than Dijkstra's algorithm for the same problem, but more versatile, as it is capable of handling graphs in which some of the edge weights are negative numbers.

**Working**

This is a dynamic programming-based algorithm, which means it will check all the possible solutions with the help of results of previously solved sub-problems. This is the idea behind dynamic programming. Bellman-Ford works by underestimating the distance/cost from the source vertex to another vertex. Now we will check for a better path and as soon as we find a better path we will update the distance/cost of that vertex. This process will continue until we have no better paths to update the distance/cost of any vertex. This is the basic idea behind the algorithm. Now we will see the algorithm in detail.
1. The first step is to initialize the distance of all the vertices from the source vertex to infinity. The distance of the source vertex from itself is 0.
2. Make a list of edges this can be easily done by traversing the adjacency list of the graph.
3. Now we will relax all the edges. Relaxing an edge means checking if the distance of the destination vertex is greater than the distance of the source vertex plus the weight of the edge. For example, the edge we are currently relaxing is (u,v) and distance of u from the source vertex is d\[u\] and distance of v from the source vertex is d\[v\] and the weight of the edge is w\[u,v\]. Now we will check if d\[v\] > d\[u\] + w\[u,v\]. If this condition is true then we will update the distance of v from the source vertex to d\[v\] = d\[u\] + w\[u,v\].
4. We need to repeat the above step V-1 times where V is the number of vertices in the graph.

**Why V-1 times?**

In a graph containing V vertex V-1 is the maximal length of the shortest path in a graph. After k iterations of the Bellman-Ford algorithm, you know the minimum distance between any two vertices, when restricted to paths of length at most k. Since this is a dynamic programming algorithm so we need to check all the possible combinations, as a result, we need to repeat the above step V-1 times.

**Pseudo Code**

    BellmanFord(Graph, source):
        distance = [] 
        distance[source] = 0
        for each vertex v in Graph: 
            if v != source
                distance[v] = infinity
        for i = 1 to size of Graph:
            for each edge (u, v) with weight w in Graph:
                if distance[u] + w < distance[v]:
                    distance[v] = distance[u] + w
    
    In the above algorithm distance[v] represents the length of the shortest path from source to v.
    They are initialized to infinity except for the source vertex, which is initialized to 0.
    The outer loop is repeated V-1 times, where V is the number of vertices in the graph.
    The inner loop relaxes all the edges in the graph.

**Time Complexity**

**Average case:** O(VE)

From the above pseudo-code, we can see that the outer loop is repeated V-1 times and the inner loop is repeated E times where E is the number of edges in the graph. So the time complexity of the algorithm is O(V*E). This is the average time complexity of the algorithm.

**Worst case:** O(V^3)

The worst case, would occur when we have a complete graph, then E would be equal to V^2. So the time complexity of the algorithm in the worst case would be O(V^3). 

**Best case:** O(E)

We can optimize the algorithm by stoping the outer loop if we are not able to update the distance of any vertex in the inner loop (distance array). Thus in best case the outer loop would run only once and hence best case time complexity will be equal to O(E).

**Space Complexity**

The space complexity of the algorithm is O(V) as we are using an array to store the distance of all the vertices from the source vertex. In the above pseudo-code, we are only calculating the shortest distance but the shortest path can be calculated by storing the parent of each vertex in an array. This will increase the space complexity of the algorithm to O(V*2) because we are using two arrays to store the distance and parent of each vertex.


**Pseudo Code for the optimized algorithm with parent array**

    BellmanFord(Graph, source):
        distance = [] 
        parent = []
        distance[source] = 0
        for each vertex v in Graph: 
            if v != source
                distance[v] = infinity
                parent[v] = null
        for i = 1 to size of Graph:
            for each edge (u, v) with weight w in Graph:
                if distance[u] + w < distance[v]:
                    distance[v] = distance[u] + w
                    parent[v] = u


**Negative Edges and Negative Cycle**

Bellman-Ford is used over Dijkstra's Algorithm because it handles graphs with negative edges, but we need to ensure that the graph doesn't contain any negative cycle. In the case of a negative cycle, the shortest distance will be minus infinity. For example, consider a cycle between edges A, B and C. The weights are 
w(A,B) -> -3
W(B,C) -> -2
W(C,A) -> 1

If we want to find the shortest distance between A and C we would not be able to find it, as we will be stuck in an infinite loop because the shortest path will look like A->B->C->A->B->C.......... and so on. 

With the help of the Bellman-Ford algorithm, we can detect a negative cycle in a graph. Let us say we ran the algorithm V-1 times but on the Vth iteration we are still able to relax an edge, this means that there is a negative cycle in the graph. This is because the shortest path can't be longer than V-1 edges. So if we can relax an edge after V-1 iterations then there must be a negative cycle in the graph.