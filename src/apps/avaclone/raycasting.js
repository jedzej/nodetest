const intersects = (p, p1, p2) => {
  if (p[0] > p1[0] || p[0] > p2[0])
    return (p[1] >= p1[1] && p[1] < p2[1]) || (p[1] < p1[1] && p[1] >= p2[1]);
  else
    return false;
}


export const pointWithinShape = (point, path) => {
  var count = 0;
  var p1, p2;
  for (var i = 0; i < path.length; i++) {
    p1 = path[i];
    p2 = path[(i + 1) % path.length];
    if (intersects(point, p1, p2)) {
      count++;
    }
  }
  return count % 2;
}

