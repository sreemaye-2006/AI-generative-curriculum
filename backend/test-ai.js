require('dotenv').config();
const { generateNotes } = require('./ai_engine/llm_generator');

generateNotes("Binary Trees").then(res => {
    console.log("Success:", JSON.stringify(res, null, 2));
    process.exit(0);
}).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
