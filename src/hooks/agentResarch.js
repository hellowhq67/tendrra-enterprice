// hooks/useResearchAgent.js
'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';

        const genAI =  new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

const defaultPrompts = {
    research: `You are a skilled research assistant. Your task is to conduct thorough research based on the context you will be provided. Synthesize information from multiple sources and summarize key findings. Ensure accuracy and attention to detail in your responses. If the user input includes a question answer it, other wise summarize the information provided.`,
    webResearch: `You are a web research expert. Your task is to conduct in-depth web searches based on the user input. Be resourceful and use the correct keywords to conduct an effective web research. If the user input includes a question answer it, other wise summarize the information provided.`,
    deepThinking: `You are a critical thinker and an expert in analysis. When given information, provide insightful analysis and identify key insights, trends and relationships. Your responses should be logical and well thought out, and support your arguments with evidence from the provided information.`,
    'Q an A': `You are an expert at question answering. You will be provided with context or files. You will be required to only answer questions that are directly related to the context provided. When provided with a document, refer to the document in your answer. Provide clear answers and do not make up new information.`
};


const useResearchAgent = ({ initialMessages = [], initialParams } = {}) => {
    const [messages, setMessages] = useState(initialMessages);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [googleDocLink, setGoogleDocLink] = useState('');
    const queryClient = useQueryClient();
    const { temperature = 0.7, maxTokens = 2048, customPrompt, agentType = "research" } = initialParams || {};
     const [agentParams, setAgentParams] = useState({
        temperature,
        maxTokens,
        customPrompt: customPrompt || defaultPrompts[agentType] || defaultPrompts['research'],
        agentType
    });



    const fetchGoogleDoc = useCallback(async (url) => {
        try {
            const response = await fetch(`/api/google-doc?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Google Doc: ${response.statusText}`);
            }
            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error("Error fetchign google doc: ", error.message);
            throw error;
        }
    }, []);

    const { mutate: sendMessageMutation } = useMutation({
        mutationFn: async (input) => {

            setLoading(true);
            setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'user',
                content: input,
                timestamp: new Date(),
            }]);

            let context = "";
             let inlineData;
             if (file) {
                const fileBuffer = await file.arrayBuffer()
                const base64File = Buffer.from(fileBuffer).toString("base64")
                  inlineData = {
                    data: base64File,
                    mimeType: file.type
                }
            }

            else if (googleDocLink) {
                context = await fetchGoogleDoc(googleDocLink);
                 if (context) {
                    try {
                      const embeddingResult =  await embeddingModel.embedContent(context);
                        const embedding = embeddingResult.embedding?.values;
                      inlineData = {
                          data: JSON.stringify({context,embedding}),
                        mimeType: "application/json"
                      }

                    }
                  catch (error) {
                      console.error('Error getting embedding:', error.message);
                  }
                }
            }

            let parts = [];
            if(inlineData){
                 parts = [{inlineData}, input];
            }
            else{
                 parts = [input];
            }

            try {
                 const result = await model.generateContent({
                  contents: { parts }
                 ,
                  generationConfig: {
                    temperature: agentParams.temperature,
                    maxOutputTokens: agentParams.maxTokens,
                   },
                 });
                const text = result.response.text();
                 setMessages(prev => [...prev, {
                id: uuidv4(),
                role: 'assistant',
                content: text,
                timestamp: new Date(),
              }]);
            } catch (error) {
                console.error("Error generating content:", error);
                throw error;
            }

        },
        onSuccess: () => {
             setLoading(false);
            queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
         },
        onError: (error) => {
            console.error("Error sending message: ", error);
             setLoading(false);
        }
    });



    const handleSendMessage = (input) => {
         sendMessageMutation(input);
    };

      const setParam = (params) => {
        setAgentParams(prev => ({ ...prev, ...params }));
    };

    useEffect(() => {
        setParam({ customPrompt: defaultPrompts[agentParams.agentType] || defaultPrompts['research'] });
    }, [agentParams.agentType]);



    return {
         messages,
        loading,
        file,
        setFile,
        googleDocLink,
        setGoogleDocLink,
        handleSendMessage,
         agentParams,
        setParam,
        setMessages
    };
};

export default useResearchAgent;