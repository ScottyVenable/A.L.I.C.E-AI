import { Configuration, OpenAIApi } from "openai";
import { Interests, Traits, CurrentEmotion, SexualOrientation, GenderIdentity } from "./personality";
import { PersonalKnowledge, LongTermMemory, ShortTermMemory } from "./memory";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
  //Check if API Key is working
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  //Check for user input
  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter input.",
      }
    });
    return;
  }


  try {


  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePersonalityPrompt(userInput),
    temperature: 0.6,
    max_tokens: 100,
    frequency_penalty: 0.5,
    presence_penalty: 0.6,
    stop: [" Human:", " AI:"],
  });



    //Created AI Response
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePersonalityPrompt(userInput),
      temperature: 0.7,
      max_tokens: 100,
      frequency_penalty: 0.5,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });

  } 
  
  catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
    }
  
  
}




//Prompt Generators

function generatePersonalityPrompt(userInput) {
  const inputMessage = userInput;
  const personalityTraits = Traits;
  const personalityInterests = Interests;
  const personalityCurrentEmotion = CurrentEmotion;
  const memoryKnowledge = PersonalKnowledge;
  const memoryLongTerm = LongTermMemory;
return `Here is some information about an AI personality named Alice:
Personality Traits: ${personalityTraits}
Interests: ${personalityInterests}
Long Term Memory: ${memoryLongTerm}
Knowledge: ${memoryKnowledge}


Sender Relationship to Alice: Your enemy
Alice's Current Emotion: ${personalityCurrentEmotion}
Message from Sender: ${inputMessage}

Connecting the provided relationship, current emotion, and message, generate a brief sentence 
showing what Alice's thought process would be like if they read that message.


Thought:`


;

}




/*
function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
*/
