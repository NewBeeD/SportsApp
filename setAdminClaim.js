import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const uid = "3X1UmQTpAPf9cM275CAjBshTcC82"; // Replace with your actual UID

getAuth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("Admin claim set for user:", uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting admin claim:", error);
    process.exit(1);
  });