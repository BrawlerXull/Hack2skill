"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {  Mic, MicOff, Play, Pause, RotateCcw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { motion } from "framer-motion"
import { Send, Info, BookOpen, Save, CheckCircle, Clock, ArrowRight, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useMoodCalendar } from "@/hooks/useMoodCalendar"
import { useUser } from "@clerk/nextjs"
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }


type MessageType = {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
}

type SessionType = {
  id: string
  date: Date
  messages: MessageType[]
  exercises: ExerciseType[]
  completed: boolean
}

type ExerciseType = {
  id: string
  title: string
  description: string
  type: "journaling" | "meditation" | "visualization" | "reflection"
  instructions: string[]
  completed: boolean
}

const exerciseTemplates = {
  disgust: [
    {
      title: "Releasing Disgust Through Journaling",
      description: "A journaling exercise to express and release feelings of disgust",
      type: "journaling",
      instructions: [
        "Find a quiet space where you won't be interrupted",
        "Write about what specifically is causing your feelings of disgust",
        "Describe how these feelings manifest in your body",
        "Explore why this situation or object triggers such a strong emotional response",
        "Reflect on what you can learn from these feelings and how to release them",
      ],
    },
    {
      title: "Grounding and Cleansing Visualization",
      description: "A visualization exercise to cleanse and release feelings of disgust",
      type: "visualization",
      instructions: [
        "Sit comfortably and close your eyes",
        "Visualize a wave of warm light slowly washing over you, starting at your feet",
        "Imagine the light cleansing and neutralizing the feeling of disgust from your body",
        "With each breath, release these feelings into the light",
        "Finish the visualization by imagining yourself feeling clean and refreshed",
      ],
    },
  ],
  happy: [
    {
      title: "Gratitude Journaling",
      description: "A journaling exercise to amplify feelings of happiness and gratitude",
      type: "journaling",
      instructions: [
        "Find a quiet space and sit comfortably",
        "Write down three things that brought you joy today",
        "Describe the emotions you felt and why they were significant",
        "Reflect on how you can bring more of these positive moments into your life",
        "Commit to practicing gratitude daily for at least one week",
      ],
    },
    {
      title: "Happiness Affirmation Meditation",
      description: "A meditation to enhance feelings of happiness and positivity",
      type: "meditation",
      instructions: [
        "Sit comfortably with your eyes closed",
        "Take several deep breaths, letting go of any tension in your body",
        "Repeat the following affirmations silently or out loud: 'I am worthy of joy', 'I attract happiness', 'I embrace the positive moments in my life'",
        "Sit in silence for a few minutes, focusing on the words and the feelings they bring",
        "Practice this daily to cultivate a habit of happiness",
      ],
    },
  ],
  sad: [
    {
      title: "Healing Through Tears",
      description: "A reflective journaling exercise to process sadness",
      type: "journaling",
      instructions: [
        "Find a quiet, comfortable place",
        "Write about the sadness you're feeling, letting the words flow freely",
        "Allow yourself to feel the emotion fully, without judgment or resistance",
        "After writing, reflect on any lessons or insights that arise from this sadness",
        "Commit to expressing your emotions through journaling regularly",
      ],
    },
    {
      title: "Comforting Visualization for Sadness",
      description: "A visualization exercise to bring comfort to feelings of sadness",
      type: "visualization",
      instructions: [
        "Sit comfortably, close your eyes, and take several deep breaths",
        "Visualize a nurturing, loving figure approaching you and offering comfort",
        "Let this figure embrace you or offer words of reassurance, acknowledging your sadness",
        "Focus on the feelings of warmth and care you receive from this image",
        "Allow this comfort to stay with you throughout the day",
      ],
    },
  ],
  fear: [
    {
      title: "Facing Your Fear with Courage",
      description: "A journaling exercise to explore and confront your fears",
      type: "journaling",
      instructions: [
        "Find a quiet space to sit and reflect",
        "Write about the fear you're experiencing and what it feels like in your body",
        "Describe the worst-case scenario that you're imagining",
        "Challenge your fear by writing about ways you can respond with courage",
        "Reflect on your capacity to face fear and take small steps towards it",
      ],
    },
    {
      title: "Breathing Through Fear",
      description: "A grounding breathing technique to help calm fearful thoughts",
      type: "meditation",
      instructions: [
        "Sit in a comfortable position with your eyes closed",
        "Inhale deeply through your nose for 4 counts, hold for 4 counts, exhale through your mouth for 4 counts",
        "Focus on your breath, letting go of any fearful thoughts with each exhale",
        "Repeat this cycle for 5-10 minutes, allowing yourself to feel grounded and calm",
        "Practice daily to reduce fear responses",
      ],
    },
  ],
  angry: [
    {
      title: "Releasing Anger Through Journaling",
      description: "A journaling exercise to process and release anger",
      type: "journaling",
      instructions: [
        "Find a quiet space where you can write freely",
        "Write about the source of your anger, without holding back",
        "Explore what triggered your anger and how it affects your body",
        "Reflect on any deeper feelings behind the anger, such as hurt or fear",
        "End the journaling session by writing about ways you can release or transform this anger",
      ],
    },
    {
      title: "Anger Release Breathwork",
      description: "A breathwork exercise to release the intensity of anger",
      type: "meditation",
      instructions: [
        "Sit comfortably and take a few deep breaths",
        "Inhale deeply through your nose, hold for 3 counts, and exhale forcefully through your mouth",
        "Repeat this process 5-10 times, focusing on releasing tension and anger with each exhale",
        "Allow your breath to guide you back to a state of calm",
        "Practice this breathwork whenever anger arises",
      ],
    },
  ],
  neutral: [
    {
      title: "Mindful Presence Practice",
      description: "A grounding exercise to help you connect with your neutral state",
      type: "meditation",
      instructions: [
        "Sit comfortably and close your eyes",
        "Focus on your breath and bring your attention to the present moment",
        "If your mind starts to wander, gently guide it back to your breath",
        "Notice how your body feels in this neutral space",
        "Allow yourself to simply be in this moment for 5-10 minutes",
      ],
    },
    {
      title: "Self-Reflection Journaling",
      description: "A journaling exercise to connect with your neutral, balanced self",
      type: "journaling",
      instructions: [
        "Find a quiet space to sit and reflect",
        "Write about your current emotional state and how you feel in this neutral space",
        "Consider the balance between your emotions, and how you can maintain this state",
        "Explore any areas where you feel stuck or uninspired, and reflect on ways to bring more energy into your life",
        "Commit to checking in with your neutral self regularly",
      ],
    },
  ]
}

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15)

export default function IFSTherapy() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionProgress, setSessionProgress] = useState(0)
  const [pastSessions, setPastSessions] = useState<SessionType[]>([])
  const [currentSession, setCurrentSession] = useState<SessionType | null>(null)

  const [activeTab, setActiveTab] = useState("chat")
  const [showIntroDialog, setShowIntroDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start a new therapy session
  const startSession = () => {
    const initialMessage: MessageType = {
      id: generateId(),
      role: "bot",
      content: "Welcome to your IFS therapy session. I'm here to help you explore your inner family system. How are you feeling today?",
      timestamp: new Date(),
    }

    const newSession: SessionType = {
      id: generateId(),
      date: new Date(),
      messages: [initialMessage],
      exercises: [],
      completed: false,
    }

    setMessages([initialMessage])
    setCurrentSession(newSession)
    setIsSessionActive(true)
    setCurrentPromptIndex(1)
    setSessionProgress(0)
  }

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mood, setMood] = useState<"disgust" | "sad" | "happy" | "fear" | "angry" | "neutral">("sad");
  
  let recognition: SpeechRecognition | null = null;
  if (typeof window !== "undefined") {
    recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
  }
  
  if (recognition) {
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
  
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscribedText(transcript);
      setInput(transcript);
    };
  }
  
  const startRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscribedText("");
    if (recognition) recognition.start();
  
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
  
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
  
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setAudioChunks((prev) => [...prev, e.data]); // Append new data to existing chunks
      }
    };
  
    recorder.start();
  
    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setRecordingInterval(interval);
    toast("Your speech is now being recorded.");
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    if (recordingInterval) clearInterval(recordingInterval);
    if (recognition) recognition.stop();
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    toast(`Recording saved (${formatTime(recordingTime)}).`);
  };
  
  const resetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingInterval) clearInterval(recordingInterval);
    setTranscribedText("");
    setAudioChunks([]); // Reset recorded audio
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop()); // Stop all audio tracks
      setAudioStream(null);
    }
    toast("Recording reset.");
  };
  
  const downloadRecording = () => {
    if (audioChunks.length === 0) {
      toast("No audio recorded.");
      return;
    }
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "full_recording.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // uploading
  const uploadRecording = () => {
    if (audioChunks.length === 0) {
      toast("No audio recorded.");
      return;
    }
  
    const blob = new Blob(audioChunks, { type: "audio/wav" });
  
    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append('file', blob, 'full_recording.wav');
  
    // Send the POST request with the file
    fetch('http://localhost:5000/predict',{
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('File uploaded successfully:', data);
    //   emotion_mapping = {
    //     'disgust': 0,
    //     'happy': 1,
    //     'sad': 2,
    //     'fear': 3,
    //     'angry': 4,
    //     'neutral': 5
    // }
    if(data.prediction == 0){
      setMood('disgust')
    }else if(data.prediction == 1){
      setMood('happy')         
    }
    else if(data.prediction == 2){
      setMood('sad')
    }
    else if(data.prediction == 3){
      setMood('fear')
    }
    else if(data.prediction == 4){  
      setMood('angry')
    }
    else if(data.prediction == 5){
      setMood('neutral')
    }

      toast("Recording uploaded successfully.");
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      toast("Error uploading recording.");
    });
  };

  const { user } = useUser()

  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessage: MessageType = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, newMessage]);
    setInput("");


 

    
  
    try {
      const res = await fetch(`/api/check-in?userId=${user?.id}`)

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to fetch check-ins")

        const checkIns = data.checkIns.map((checkIn: any) => ({
            ...checkIn,
            createdAt: new Date(checkIn.createdAt + "T00:00:00Z"), // Normalize date to midnight UTC
          }))

      const response = await fetch("/api/ifs-therapy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcribedText: input,
          history: messages.map((m) => ({
            user: m.role === "user" ? m.content : undefined,
            ai: m.role === "bot" ? m.content : undefined,
          })).filter(m => m.user || m.ai),
          checkIns: checkIns,
        }),
      });
  
      const data2 = await response.json();
  
      if (data2.response) {
        const botMessage: MessageType = {
          id: generateId(),
          role: "bot",
          content: data2.response,
          timestamp: new Date(),
        };
  
        setMessages((prev) => [...prev, botMessage]);
  
        // Update session progress based on message index
        // setSessionProgress((prev) => Math.min(prev + (100 / ifsPrompts.length), 100));
        setSessionProgress((prev) => prev + 40);

      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };
  

  // Save exercises to user profile
  const saveExercises = () => {
    // toast({
    //   title: "Exercises Saved",
    //   description: "Your personalized exercises have been saved to your profile.",
    // })
  }

  useEffect(()=>{
    if(sessionProgress == 120){
      uploadRecording()
      setActiveTab("exercises")
    }
  },[sessionProgress])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Internal Family Systems Therapy</h1>
        <Button variant="outline" onClick={() => setShowIntroDialog(true)}>
          <Info className="mr-2 h-4 w-4" />
          About IFS
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">Therapy Session</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>

        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IFS Therapy Session</CardTitle>
              <CardDescription>Explore your inner family system with guided prompts and questions</CardDescription>
            </CardHeader>
            <CardContent>
              {isSessionActive ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Session Progress</span>
                      <span>{sessionProgress}%</span>
                    </div>
                    <Progress value={sessionProgress} />
                  </div>
                  <ScrollArea className="h-[400px] pr-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                      >
                        <div
                          className={`rounded-lg p-4 max-w-[80%] ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </ScrollArea>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                  <h3 className="text-xl font-semibold">Start Your IFS Journey</h3>
                  <p className="text-muted-foreground max-w-md">
                    Internal Family Systems therapy helps you understand and heal different parts of yourself. Start a
                    guided session to explore your inner world.
                  </p>
                  <Button onClick={startSession}>Begin Therapy Session</Button>
                </div>
              )}
            </CardContent>
            {isSessionActive && (
              <CardFooter className="flex items-center justify-center">
                {/* <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex w-full space-x-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your response here..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form> */}

                <div className="flex flex-col items-center justify-center space-y-6 py-10">
                  <div className="relative w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
                    {isRecording ? (
                      <div className="absolute inset-0 rounded-full animate-pulse bg-red-500/20"></div>
                    ) : null}
                    <div
                      className={`w-24 h-24 rounded-full ${isRecording ? "bg-red-500" : "bg-primary"} flex items-center justify-center`}
                    >
                      {isRecording ? (
                        <MicOff className="h-10 w-10 text-white" />
                      ) : (
                        <Mic className="h-10 w-10 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                  <div className="flex space-x-4">
                    {isRecording ? (
                      <Button variant="destructive" onClick={stopRecording}>
                        <Pause className="mr-2 h-4 w-4" /> Stop
                      </Button>
                    ) : (
                      <Button onClick={startRecording}>
                        <Play className="mr-2 h-4 w-4" /> Start Recording
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetRecording}>
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button variant="outline" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
<TabsContent value="exercises" className="space-y-4">
  <Card>
    <CardHeader>
      <CardTitle>Personalized IFS Exercises</CardTitle>
      <CardDescription>
        Practice these exercises to deepen your understanding of your inner parts
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Filter exercises based on the selected mood */}
      {exerciseTemplates[mood]?.length > 0 ? (
        <div className="space-y-4">
          {exerciseTemplates[mood].map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        exercise.type === "journaling"
                          ? "default"
                          : exercise.type === "meditation"
                          ? "secondary"
                          : exercise.type === "visualization"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="instructions">
                      <AccordionTrigger>Instructions</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2">
                          {exercise.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={exercise.completed ? "outline" : "default"}
                    onClick={() => toggleExerciseCompletion(exercise.id)}
                    className="w-full"
                  >
                    {exercise.completed ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      "Mark as Completed"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          <div className="flex justify-end">
            <Button onClick={saveExercises}>
              <Save className="mr-2 h-4 w-4" />
              Save Exercises to Profile
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
          <Sparkles className="h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-semibold">No Exercises Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Complete a therapy session to receive personalized exercises based on your responses.
          </p>
          <Button
            onClick={() => {
              setActiveTab("chat");
              startSession();
            }}
          >
            Start a Session
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>

    
    </div>
  )
}

