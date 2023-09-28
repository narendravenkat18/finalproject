
const express = require('express');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require("./key.json");

// Initialize Firebase Admin
const adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const firestoreDB = getFirestore(adminApp);

const app = express();

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/log", async function(req, res) {
    const { email1, password1 } = req.query;
    const email = email1;
    const password = password1;

    try {
        await firestoreDB.collection('cricketers').add({
            Email: email,
            Password: password
        });
        res.send("You Signed up Successfully with " + email);
    } catch (error) {
        console.error("Error storing data:", error);
        res.status(500).send("Error storing data.");
    }
});

app.get('/sig', function(req, res) {
    const { email2, password2 } = req.query;
    const imail = email2;
    const iassword = password2;
    let dataPresent = false;

    firestoreDB.collection('cricketers').get().then((docs) => {
        docs.forEach((doc) => {
            if (imail == doc.data().Email && iassword == doc.data().Password) {
                dataPresent = true;
            }
        });

        if (dataPresent) {
            res.sendFile(__dirname + "/index2.html");
        } else {
            res.send("Data not present in Firebase, please login");
        }
    });
});

const port = 7000; // Use any available port
app.listen(port, function() {
    console.log("Server started on port", port);
})
