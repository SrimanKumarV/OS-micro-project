const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

let processes = [];

app.post("/add", (req, res) => {
    const { name, alloc, max } = req.body;

    if (alloc > max) {
        return res.json({ error: "Allocation > Max not allowed" });
    }

    processes.push({
        name,
        alloc,
        max,
        need: max - alloc
    });

    res.json({ success: true, processes });
});

app.post("/run", (req, res) => {
    let available = req.body.available;

    let work = available;
    let finish = new Array(processes.length).fill(false);
    let safeSeq = [];

    let count = 0;

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

app.listen(3000, () => console.log("Server running on http://localhost:3000"));