const API_KEY = "AIzaSyDGG1fHUrSrsKtifbek75KD32NyMqZoULc";

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const summarizeBtn = document.getElementById("summarizeBtn");
const clearBtn = document.getElementById("clearBtn");
const wordCountEl = document.getElementById("wordCount");


// const readingTimeEl = document.getElementById("readingTime");
// const reductionRateEl = document.getElementById("reductionRate");


// ---------------- WORD COUNTER ----------------
inputText.addEventListener("input", () => {
  const words = inputText.value.trim().split(/\s+/).filter(Boolean);
  wordCountEl.textContent = `${words.length} words`;
});

// ---------------- CLEAR BUTTON ----------------
clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.textContent =
    "Your summary will appear here after processing...";
  wordCountEl.textContent = "0 words";
});

// ---------------- SUMMARIZE FUNCTION ----------------
async function summarizeText() {
    
  const userText = inputText.value.trim();
  

  if (!userText) {
    alert("Please paste some text first!");
    return;
  }

  summarizeBtn.disabled = true;
  summarizeBtn.textContent = "Summarizing...";

  const prompt = `
        Purpose:
         You are an automated text-summarization engine that condenses user-provided content into a clear, accurate, and concise summary.

          Instructions:
           Summarize only the given text while preserving its main ideas, facts, and intent. Remove redundancy and minor details. Do not add new information, opinions, explanations, greetings, or meta-statements. Use neutral language and output only the final summary.

         TEXT:
         ${userText}
         `;

    try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary returned.";

    outputText.textContent = summary;
  } catch (err) {
    console.error(err);
    outputText.textContent =
      "⚠️Error generating summary. Please try again.";
  } finally {
    summarizeBtn.disabled = false;
    summarizeBtn.textContent = " Summarize Now";
  }
}

// ---------------- BUTTON CLICK ----------------
summarizeBtn.addEventListener("click", summarizeText);










function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// function updateStats(originalText, summaryText) {
//   const originalWords = countWords(originalText);
//   const summaryWords = countWords(summaryText);

//   // Reading time → 200 words = 1 min
//   const minutes = Math.max(1, Math.ceil(originalWords / 200));
//   readingTimeEl.textContent = `${minutes} min`;

//   // Reduction %
//   if (originalWords && summaryWords) {
//     const reduction =
//       Math.round(((originalWords - summaryWords) / originalWords) * 100);

//     reductionRateEl.textContent = `${reduction}%`;
//   }
// }

// ---------------- STATS CALCULATION ----------------

const readingTimeEl = document.getElementById("readingTime");
const reductionRateEl = document.getElementById("reductionRate");

// Function to calculate word count from a given text
function getWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Separate function to calculate stats
function calculateStats(originalText, summaryText) {
  const originalWords = getWordCount(originalText);
  const summaryWords = getWordCount(summaryText);

  // Estimated reading time (200 words per minute)
  const minutes = Math.max(1, Math.ceil(originalWords / 200));

  // Reduction percentage
  const reduction =
    originalWords > 0 && summaryWords > 0
      ? Math.round(((originalWords - summaryWords) / originalWords) * 100)
      : null;

  return {
    readingTime: `${minutes} min`,
    reduction: reduction !== null ? `${reduction}%` : "--%"
  };
}

// Function to update DOM elements
function updateStats(originalText, summaryText) {
  const stats = calculateStats(originalText, summaryText);

  readingTimeEl.textContent = stats.readingTime;
  reductionRateEl.textContent = stats.reduction;
}

