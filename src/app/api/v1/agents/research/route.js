import { GoogleGenerativeAI } from '@google/generative-ai';
const { tavily } = require("@tavily/core");
import { NextRequest, NextResponse } from 'next/server';

// Helper function to safely access environment variables
const getEnvVar = (key) => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not defined.`);
    return undefined; // Or throw an error if it's critical
  }
  return value;
};

const analyzeResearchData = async (client, data, prompt) => {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const analysisPrompt = `Analyze the following research data, gathered using both general research and targeted web searches with Tavily, to identify key competitors, relevant links, and important keywords or phrases. The original research prompt was: ${prompt}. Provide the results in a JSON format. If you cannot reliably extract the information then return an empty array for that field. REMOVE ALL MARKDOWN FORMATTING.

    \`\`\`json
    {
      "competitors": ["competitor1", "competitor2"],
      "links": ["http://example.com/link1", "http://example.com/link2"],
      "keyPhrases": ["phrase1", "phrase2"]
    }
    \`\`\`

    Research Data:

    \`\`\`
    ${JSON.stringify(data)}
    \`\`\``;

    try {
        const response = await model.generateContent(analysisPrompt);
        let textResponse = response.response.text();

        // Aggressively remove markdown formatting
        textResponse = textResponse.replace(/```(json)?/g, ''); // Remove code block markers
        textResponse = textResponse.replace(/`+/g, ''); // Remove any remaining backticks
        textResponse = textResponse.trim(); // Trim whitespace

        try {
            // Attempt to parse the JSON response
            const parsedData = JSON.parse(textResponse);
            return parsedData;
        } catch (parseError) {
            console.error("Error parsing JSON from analysis:", parseError);
            console.log("Raw response from analysis:", textResponse);

            // Return a default object if parsing fails
            return {
                competitors: [],
                links: [],
                keyPhrases: [],
                parseError: parseError.message, // Include parse error
                rawResponse: textResponse
            };
        }
    } catch (error) {
        console.error("Error during analysis:", error);
        return {
            competitors: [],
            links: [],
            keyPhrases: [],
            analysisError: error.message
        };
    }
};

const performTavilySearch = async (query) => {
    const tavilyApiKey = getEnvVar("TAVILY_API_KEY");
    if (!tavilyApiKey) {
        console.warn("Tavily API key not found. Skipping Tavily search.");
        return { results: [], error: "Tavily API key missing" };
    }

    try {
        const tvly = tavily({ apiKey: tavilyApiKey });
        const response = await tvly.search(query);
        return { results: response.results, error: null };
    } catch (error) {
        console.error("Error during Tavily search:", error);
        return { results: [], error: error.message };
    }
};

// Function to extract information from Tavily search results
const extractInfoFromTavilyResults = (tavilyResults) => {
    const links = [];
    const competitors = new Set(); // Use a Set to avoid duplicate competitor names
    const keyPhrases = new Set();

    if (Array.isArray(tavilyResults)) {
        tavilyResults.forEach(result => {
            if (result.url) {
                links.push(result.url);
            }

            // Basic competitor extraction: look for company names in the title
            if (result.title) {
                const titleWords = result.title.split(/\s+/);
                titleWords.forEach(word => {
                    if (word.match(/^(?:[A-Z][a-z]+)+$/)) { // Simple check for capitalized words
                        competitors.add(word);
                    }
                });
            }

            if (result.content) {
                const contentWords = result.content.split(/\s+/);
                contentWords.forEach(word => {
                    if (word.length > 5 && word.length < 15) {
                        keyPhrases.add(word);
                    }
                });
            }
        });
    }

    return {
        links: Array.from(links),
        competitors: Array.from(competitors),
        keyPhrases: Array.from(keyPhrases)
    };
};

export async function POST(req) {
    try {
        const { prompt, config, feedback } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Initialize the Google Generative AI client
        const apiKey = getEnvVar('GOOGLE_AI_API_KEY');
        if (!apiKey) {
            return NextResponse.json({ error: 'GOOGLE_AI_API_KEY is not set in environment variables' }, { status: 500 });
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        // Initialize the model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: config?.maxTokens || 2048,
                temperature: config?.temperature || 0.7,
            },
        });

        const phases = [
            'Project Definition',
            'Data Collection',
            'Analysis',
            'Competitive Analysis',
            'Trend Analysis',
            'Insight Synthesis',
            'Recommendations',
        ];

        const results = {};
        const phaseContents = {};
        const extractedTavilyInfo = { // Store extracted info
            links: [],
            competitors: [],
            keyPhrases: []
        };
        // Execute each research phase
        for (const phase of phases) {
            try {
                const response = await model.generateContent(`${prompt}\n\nPhase: ${phase}`);
                const text = response.response.text();
                results[phase] = text;
                phaseContents[phase] = text;

                // Perform Tavily search for the phase
                const tavilySearchQuery = `${prompt} - ${phase}`;
                const tavilySearchResult = await performTavilySearch(tavilySearchQuery);

                if (tavilySearchResult.error) {
                    console.warn(`Tavily search failed for phase ${phase}: ${tavilySearchResult.error}`);
                    results[`${phase}_tavily_error`] = tavilySearchResult.error;
                } else {
                    results[`${phase}_tavily`] = tavilySearchResult.results;

                    // Extract info and store it
                    const extractedInfo = extractInfoFromTavilyResults(tavilySearchResult.results);
                    extractedTavilyInfo.links = extractedTavilyInfo.links.concat(extractedInfo.links);
                    extractedTavilyInfo.competitors = extractedTavilyInfo.competitors.concat(extractedInfo.competitors);
                    extractedTavilyInfo.keyPhrases = extractedTavilyInfo.keyPhrases.concat(extractedInfo.keyPhrases);

                    // Append Tavily results to phaseContents for analysis
                    phaseContents[phase] += `\n\nTavily Results:\n${JSON.stringify(tavilySearchResult.results)}`;
                }

            } catch (phaseError) {
                console.error(`Error in phase ${phase}:`, phaseError);
                results[phase] = `Error: ${phaseError.message}`;
                phaseContents[phase] = `Error: ${phaseError.message}`;
            }
        }

        // Analyze the collected research data, including Tavily results
        const analysisResults = await analyzeResearchData(genAI, phaseContents, prompt);

        // Integrate extracted Tavily information into analysisResults
        analysisResults.links = [...new Set([...analysisResults.links, ...extractedTavilyInfo.links])]; // Merge and deduplicate
        analysisResults.competitors = [...new Set([...analysisResults.competitors, ...extractedTavilyInfo.competitors])];
        analysisResults.keyPhrases = [...new Set([...analysisResults.keyPhrases, ...extractedTavilyInfo.keyPhrases])];

        // If feedback is provided, process it
        let feedbackResults = null;
        if (feedback) {
            try {
                const feedbackResponse = await model.generateContent({
                    prompt: `Original research:\n${prompt}\n\nFeedback:\n${feedback}`,
                });
                feedbackResults = feedbackResponse.response.text();
                results['Feedback'] = feedbackResults;
            } catch (feedbackError) {
                console.error("Error processing feedback:", feedbackError);
                feedbackResults = `Error: ${feedbackError.message}`;
                results['Feedback'] = feedbackResults;
            }
        }

        // Structure the final response
        const finalResponse = {
            researchResults: results,
            analysis: analysisResults,
            feedback: feedbackResults,
        };

        return NextResponse.json(finalResponse);

    } catch (error) {
        console.error('Error during research:', error);
        return NextResponse.json({ error: 'An error occurred during research', details: error.message }, { status: 500 });
    }
}