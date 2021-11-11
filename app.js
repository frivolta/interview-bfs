const startRoom = 4;
const objectsToCollect = ["Knife", "Potted Plant", "Pillow"];
const map = {
  rooms: [
    { id: 1, name: "Hallway", north: 2, east: 7, objects: [] },
    {
      id: 2,
      name: "Dining Room",
      north: 5,
      south: 1,
      west: 3,
      east: 4,
      objects: [],
    },
    { id: 3, name: "Kitchen", east: 2, objects: [{ name: "Knife" }] },
    { id: 4, name: "Sun Room", west: 2, north: 6, south: 7, objects: [] },
    {
      id: 5,
      name: "Bedroom",
      south: 2,
      east: 6,
      objects: [{ name: "Pillow" }],
    },
    { id: 6, name: "Bathroom", west: 5, south: 4, objects: [] },
    {
      id: 7,
      name: "Living room",
      west: 1,
      north: 4,
      objects: [{ name: "Potted Plant" }],
    },
  ],
};

// Breadth-first search to find the shortest path to all rooms from the start room and collect all objects
const bfs = (map, startRoom, objectsToCollect) => {
  const queue = [{ ...findRoomById(map, startRoom) }];
  const visited = new Set();
  const objectsCollected = [];
  const path = [{ ...findRoomById(map, startRoom) }];

  visited.add(findRoomById(map, startRoom));

  while (queue.length) {
    const currentRoom = queue.shift();
    const roomObjectes = currentRoom.objects.map((object) => object.name);
    objectsCollected.push(...roomObjectes);
    path.push({ ...currentRoom, collected: roomObjectes });
    const neighbors = getNeighbors(map, currentRoom);
    if (checkIfObjectsCollected(objectsCollected, objectsToCollect)) {
      path.shift();
      return path;
    }
    for (neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  throw new Error("No path found");
};

const checkIfObjectsCollected = (objectsCollected, objectsToCollect) => {
  for (object of objectsToCollect) {
    if (!objectsCollected.includes(object)) {
      return false;
    }
  }
  return true;
};

const getNeighbors = (map, room) => {
  const neighbors = [];
  if (room.north) {
    neighbors.push(findRoomById(map, room.north));
  }
  if (room.south) {
    neighbors.push(findRoomById(map, room.south));
  }
  if (room.east) {
    neighbors.push(findRoomById(map, room.east));
  }
  if (room.west) {
    neighbors.push(findRoomById(map, room.west));
  }
  return neighbors;
};

const findRoomById = (map, roomId) => {
  return map.rooms.find((room) => room.id === roomId);
};

// This is the function that will be called when the game is loaded
function init() {
  bfs(map, 4, objectsToCollect);
}

console.log(bfs(map, startRoom, objectsToCollect));
