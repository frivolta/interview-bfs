const fs = require("fs");
const prompt = require("prompt-sync")({ sigint: true });

const getMap = () => {
  return JSON.parse(fs.readFileSync("./map.json"));
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
    // Room objects should be collected only if they are in the objectsToCollect array
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

// Output to console log in this format:
// ID Room Object collected
// ----------------------------------
const outputFromPath = (path) => {
  console.log("ID \t Room \t Object collected");
  console.log("----------------------------------");
  // Console log a table where every line is a room and the objects collected in that room
  for (room of path) {
    console.log(
      `${room.id} \t ${room.name} \t ${
        room.collected.length ? room.collected : "None"
      }`
    );
  }
};

const findRoomById = (map, roomId) => {
  return map.rooms.find((room) => room.id === roomId);
};

// This is the function that will be called when the game is loaded
function init() {
  const startRoomId = prompt("What is room id?");
  const objectsToCollect = prompt(
    "What objects do you want to collect? (comma separated): "
  );
  const objectsToCollectArray = objectsToCollect.split(",");
  const path = bfs(getMap(), parseInt(startRoomId), objectsToCollectArray);
  outputFromPath(path);
}

init();
