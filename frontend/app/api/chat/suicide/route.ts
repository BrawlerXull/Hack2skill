import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import nodemailer from 'nodemailer';
import FamilyMemberModel from '@/models/FamilyMember';
import connectToDatabase from '@/lib/mongodb';

interface ChatRequest {
  message: string;
  userId: string;
}

export async function POST(req: Request) {
  await connectToDatabase();
  const apiKey = "AIzaSyD_AM1vtBozbFogrkUUoviWmljs78KBLkI";
  const vapiApiKey = "55ff777f-7aa7-4ead-94fc-72e4ccd8e396";

  const { message, userId }: ChatRequest = await req.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const modelName = "tunedModels/suicide-detection-e332mfepzedp";

  const generationConfig = {
    temperature: 0.0,
    top_p: 0.95,
    top_k: 10,
    max_output_tokens: 8192,
    response_mime_type: 'text/plain',
  };

  const model = genAI.getGenerativeModel({ model: modelName, generationConfig, safetySettings });

  try {
    triggerVapiEmergencyCall(vapiApiKey);
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    // Suicide risk detection logic
    const isSuicideRisk = await detectSuicideRisk(responseText);


    if (isSuicideRisk) {
      // Fetch family member details
      const familyMember = await FamilyMemberModel.findOne({ userId });

      // Trigger emergency interventions
      await Promise.all([
        triggerVapiEmergencyCall(vapiApiKey),
        sendFamilyEmailAlerts(familyMember?.familyEmails || [], message)
      ]);
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in suicide detection process:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Advanced suicide risk detection function
async function detectSuicideRisk(text: string): Promise<boolean> {
  const riskKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 
    'hopeless', 'no reason to live', 'pain is too much'
  ];

  const lowercaseText = text.toLowerCase();
  return riskKeywords.some(keyword => lowercaseText.includes(keyword));
}

// Enhanced email alert function
async function sendFamilyEmailAlerts(familyEmails: string[], message: string) {
  if (familyEmails.length === 0) {
    console.warn('No family emails found to send alerts');
    return;
  }


  const sender = "chaudhari.chinmay39@gmail.com"; // Replace with your sender email
  const emailPassword = "gqxv erdg awwb iqgz";

  if (!sender || !emailPassword) {
    console.error('Email credentials are missing');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: sender, pass: emailPassword },
  });

  const mailPromises = familyEmails.map(async (receiver) => {
    const mailOptions = {
      from: sender,
      to: receiver,
      subject: '⚠️ Urgent: Potential Suicide Risk Detected',
      text: `A potential suicide risk message was detected:\n\n"${message}"\n\nPlease take immediate action and contact the individual. The current Location of the user is https://maps.app.goo.gl/nYaac6sp9jkFpkLf7`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent to: ${receiver}`);
    } catch (error) {
      console.error(`Error sending email to ${receiver}:`, error);
    }
  });

  await Promise.all(mailPromises);
}

// Improved Vapi emergency call function
async function triggerVapiEmergencyCall(vapiApiKey: string) {
  const phoneNumber = "+919420114728";
  const assistantId = "f01f3ab7-f257-465d-9f96-f33a5d32c1d1";

  if (!phoneNumber || !assistantId) {
    console.error("Emergency contact or Vapi Assistant ID is missing");
    return;
  }

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer b313c63f-57af-4c4d-9abb-3dc6e221406b`,
      },
      body: JSON.stringify({
        phoneNumber: {
          twilioPhoneNumber: "+19375290139", 
          twilioAccountSid: "AC457e70634f163909f77ff9c7617385e9",
          twilioAuthToken: "cf0837b41a7399333d68a639cf3070a8"
        },
        assistantId: assistantId,
        customer: {
          number: phoneNumber,
          name: "Emergency Contact"
        }

      }),
    });

    const data = await response.json();
    console.log("Emergency call triggered successfully:", data);
  } catch (error) {
    console.error("Error triggering Vapi emergency call:", error);
  }
}