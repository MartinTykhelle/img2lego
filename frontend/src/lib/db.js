import Dexie from 'dexie';

export const db = new Dexie('legoDatabase');
db.version(1).stores({
    legoColors: '++colorCode, r, g, b, name, enabled, hue',
    legoImage: '++id, filename, width, height, *buffer, *colorCounts',
});
