"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("./src/seed");
(0, seed_1.seedDatabase)()
    .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
})
    .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
