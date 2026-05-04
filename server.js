const express = require("express");
const path = require("path"); 
const app = express();

app.use(express.json());

// Serves your HTML/CSS/JS files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

let processes = [];

app.post("/add", (req, res) => {
    const { name, alloc, max } = req.body;

    // Validation to ensure data integrity
    if (parseInt(alloc) > parseInt(max)) {
        return res.json({ error: "Allocation > Max not allowed" });
    }

    processes.push({
        name,
        alloc: parseInt(alloc),
        max: parseInt(max),
        need: parseInt(max) - parseInt(alloc)
    });

    res.json({ success: true, processes });
});

app.post("/run", (req, res) => {
    let available = parseInt(req.body.available);

    let work = available;
    let finish = new Array(processes.length).fill(false);
    let safeSeq = [];

    let count = 0;

    // Banker's Algorithm Logic
    while (count < processes.length) {
        let found = false;

        for (let i = 0; i < processes.length; i++) {
            if (!finish[i] && processes[i].need <= work) {
                work += processes[i].alloc;
                safeSeq.push(processes[i].name);
                finish[i] = true;
                found = true;
                count++;
            }
        }

        if (!found) break;
    }

    if (count === processes.length) {
        res.json({
            safe: true,
            sequence: safeSeq
        });
    } else {
        res.json({
            safe: false
        });
    }
});

// Port handling for local vs production
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export for Vercel/Netlify
module.exports = app;