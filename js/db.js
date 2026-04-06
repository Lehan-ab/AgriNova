// Database initialization using Dexie.js
const db = new Dexie("AgrinovaDB");

db.version(1).stores({
    users: "++id, role, phone, password, name",
    suppliers: "++id, name, category, location, verified, rating, reviews, description, phone",
    requests: "++id, farmerName, supplierId, service, date, status",
    messages: "++id, threadId, sender, text, timestamp"
});

// Mock Data Seeding for the presentation
db.on('populate', async () => {
    await db.suppliers.bulkAdd([
        {
            name: "Green Harvest Machinery",
            category: "Machinery",
            location: "Kurunegala",
            verified: true,
            rating: 4.8,
            reviews: 32,
            description: "Tractor rental and land preparation services.",
            phone: "+94 77 123 4567"
        },
        {
            name: "Lanka Seeds Co",
            category: "Seeds",
            location: "Anuradhapura",
            verified: true,
            rating: 4.5,
            reviews: 18,
            description: "High-quality paddy and vegetable seeds.",
            phone: "+94 71 987 6543"
        },
        {
            name: "AgriTransport Pro",
            category: "Transport",
            location: "Dambulla",
            verified: false,
            rating: 4.2,
            reviews: 10,
            description: "Fast and reliable crop transport to economic centers.",
            phone: "+94 75 555 4444"
        },
        {
            name: "AgriAdvisor Silva",
            category: "Advisory",
            location: "Kandy",
            verified: true,
            rating: 4.9,
            reviews: 55,
            description: "Expert soil testing and crop disease consulting.",
            phone: "+94 76 222 3333"
        }
    ]);

    await db.requests.add({
        farmerName: "Nimal",
        supplierId: 1,
        service: "Tractor rental",
        date: "2026-04-10",
        status: "Pending"
    });
});

db.open();
