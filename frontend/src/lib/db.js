import Dexie from 'dexie';

export const db = new Dexie('legoDatabase');
db.version(1).stores({
  friends: '++id, name, age', // Primary key and indexed props
  legoColors: '++colorCode, r, g, b, name, enabled',
  legoImage: '++id, filename, width, height, *buffer, *colorCounts', 
});
