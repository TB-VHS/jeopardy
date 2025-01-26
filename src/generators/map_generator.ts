/****************************************************
Prompt (Claude):
Today i need a map for a little adventure game:
size 100x100
utf-8 letters 
G = grass
B = boreal tree
C = coniferous
W = water
R = rock
Only one see - somewhat natural, please
*****************************************************/

function createNaturalMap(width: number = 100, height: number = 100): string {
  // Initialize map with grass
  const gameMap: string[][] = Array.from({ length: height }, () => 
      Array(width).fill('G')
  );
  
  // Create a natural-looking lake
  const centerX = Math.floor(Math.random() * 40) + 30;
  const centerY = Math.floor(Math.random() * 40) + 30;
  
  // Generate lake
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          if (dist < Math.floor(Math.random() * 5) + 10) {
              gameMap[y][x] = 'W';
          }
      }
  }
  
  // Add forest clusters
  for (let i = 0; i < 200; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      if (gameMap[y][x] === 'G') {
          const treeType = Math.random() > 0.5 ? 'B' : 'C';
          
          // Create small forest clusters
          for (let dx = -2; dx <= 2; dx++) {
              for (let dy = -2; dy <= 2; dy++) {
                  const newX = x + dx;
                  const newY = y + dy;
                  
                  if (newX >= 0 && newX < width && 
                      newY >= 0 && newY < height && 
                      gameMap[newY][newX] === 'G' && 
                      Math.random() < 0.7) {
                      gameMap[newY][newX] = treeType;
                  }
              }
          }
      }
  }
  
  // Add scattered rocks
  for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      
      if (gameMap[y][x] === 'G') {
          // Small rock formations
          for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                  const newX = x + dx;
                  const newY = y + dy;
                  
                  if (newX >= 0 && newX < width && 
                      newY >= 0 && newY < height && 
                      gameMap[newY][newX] === 'G' && 
                      Math.random() < 0.4) {
                      gameMap[newY][newX] = 'R';
                  }
              }
          }
      }
  }
  
  // Convert to string
  return gameMap.map(row => row.join('')).join('\n');
}

// Generate and print the map
console.log(createNaturalMap());

