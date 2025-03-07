export const generatePath = (origin: string, destination: string, validAddresses: string[]): string[] => {
  // Validate addresses first
  if (!validAddresses.includes(origin) || !validAddresses.includes(destination)) {
    return ["Invalid address."];
  }

  if (origin === destination) {
    return []; // No pathway needed - Origin and Destination are the same
  }

  const originParts = origin.split(".");
  const destParts = destination.split(".");
  const path: string[] = [origin];

  // Find common prefix level
  let commonLevel = 0;
  while (commonLevel < originParts.length && originParts[commonLevel] === destParts[commonLevel]) {
    commonLevel++;
  }

  // Generate upward path
  for (let i = originParts.length - 1; i >= commonLevel; i--) {
    const segment = [...originParts];
    for (let j = i; j < originParts.length; j++) {
      segment[j] = "0";
    }
    const upPath = segment.join(".");
    if (upPath !== origin && upPath !== "0.0.0.0") {
      path.push(upPath);
    }
  }

  // Generate downward path
  for (let i = commonLevel; i < destParts.length - 1; i++) {
    const segment = [...destParts];
    for (let j = i + 1; j < destParts.length; j++) {
      segment[j] = "0";
    }
    const downPath = segment.join(".");
    if (downPath !== "0.0.0.0") {
      path.push(downPath);
    }
  }

  if (origin !== destination) {
    path.push(destination);
  }

  return path;
};
