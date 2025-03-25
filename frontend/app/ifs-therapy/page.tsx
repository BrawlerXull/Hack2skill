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

type PartType = "protector" | "exile" | "manager" | "firefighter" | "self"

// IFS therapy prompts and responses
const ifsPrompts = [
  {
    id: "intro",
    content:
      "Welcome to your IFS therapy session. I'm here to help you explore your inner family system. How are you feeling today?",
    followUp: null,
  },
  {
    id: "identify-parts",
    content:
      "In IFS therapy, we recognize different parts of ourselves. These might include protectors, exiles, and the core Self. Can you identify any parts that feel active right now?",
    followUp: "parts-exploration",
  },
  {
    id: "parts-exploration",
    content: "Tell me more about this part. What does it feel like? Where do you feel it in your body?",
    followUp: "parts-purpose",
  },
  {
    id: "parts-purpose",
    content: "What do you think this part is trying to do for you? How might it be trying to protect you?",
    followUp: "self-compassion",
  },
  {
    id: "self-compassion",
    content: "Can you approach this part with curiosity and compassion? What might it need from you right now?",
    followUp: "unburdening",
  },
  {
    id: "unburdening",
    content:
      "If this part could release its burden, what would that feel like? Can you imagine giving it what it needs?",
    followUp: "integration",
  },
  {
    id: "integration",
    content: "How do you feel toward this part now? Has your relationship with it shifted in any way?",
    followUp: "session-reflection",
  },
  {
    id: "session-reflection",
    content: "We're nearing the end of our session. What insights have you gained about your inner system today?",
    followUp: "session-close",
  },
  {
    id: "session-close",
    content:
      "Thank you for exploring your inner world today. I'll generate some personalized exercises based on our conversation to help you continue this work.",
    followUp: null,
  },
]

// Sample exercises based on different parts
const exerciseTemplates = {
  protector: [
    {
      title: "Dialogue with Your Protector",
      description: "A journaling exercise to communicate with your protective part",
      type: "journaling" as const,
      instructions: [
        "Find a quiet space where you won't be interrupted",
        "Write a letter to your protector part, acknowledging its role",
        "Ask what it's trying to protect you from",
        "Write a response from this part's perspective",
        "Reflect on what you learned from this dialogue",
      ],
    },
    {
      title: "Safe Place Visualization for Protectors",
      description: "A visualization exercise to help your protector feel secure",
      type: "visualization" as const,
      instructions: [
        "Sit comfortably and close your eyes",
        "Visualize your protector part in its current form",
        "Imagine a safe, peaceful environment for this part",
        "Ask what would help it feel more secure",
        "Practice this visualization daily for 5-10 minutes",
      ],
    },
  ],
  exile: [
    {
      title: "Healing the Exile Meditation",
      description: "A guided meditation to connect with and comfort exiled parts",
      type: "meditation" as const,
      instructions: [
        "Find a quiet, comfortable space",
        "Close your eyes and focus on your breath for 2 minutes",
        "Gently bring awareness to the exiled part",
        "Imagine your adult self comforting this younger, wounded part",
        "Offer this part what it needed but didn't receive in the past",
        "Practice this meditation for 10-15 minutes daily",
      ],
    },
    {
      title: "Exile Unburdening Ritual",
      description: "A symbolic ritual to help release burdens from exiled parts",
      type: "reflection" as const,
      instructions: [
        "Create or find a small object to represent the burden",
        "Hold the object while connecting with the exiled part",
        "Acknowledge the pain this part has carried",
        "Release the object in a meaningful way (bury it, place it in flowing water, etc.)",
        "Journal about the experience afterward",
      ],
    },
  ],
  manager: [
    {
      title: "Appreciating Your Manager Parts",
      description: "A reflection exercise to acknowledge the role of manager parts",
      type: "reflection" as const,
      instructions: [
        "List all the ways your manager part has tried to keep you safe",
        "Acknowledge the difficult job this part has had",
        "Consider how this part developed and when it first appeared",
        "Reflect on how you might work collaboratively with this part",
        "Write a thank you note to this part",
      ],
    },
    {
      title: "Manager Part Relaxation",
      description: "A meditation to help manager parts ease their vigilance",
      type: "meditation" as const,
      instructions: [
        "Sit comfortably with eyes closed",
        "Locate the manager part in your body",
        "Breathe deeply into that area",
        "Assure this part that it can take a break while you're in a safe space",
        "Practice allowing this part to relax for 5-10 minutes",
      ],
    },
  ],
  firefighter: [
    {
      title: "Alternative Responses for Firefighters",
      description: "A journaling exercise to develop healthier coping strategies",
      type: "journaling" as const,
      instructions: [
        "Identify situations that trigger your firefighter part",
        "List the current coping mechanisms this part uses",
        "For each mechanism, brainstorm 2-3 alternative responses",
        "Create a plan to implement one new response this week",
        "Journal about the results",
      ],
    },
    {
      title: "Grounding Techniques for Intense Emotions",
      description: "Practical techniques to help when firefighter parts are activated",
      type: "reflection" as const,
      instructions: [
        "Practice the 5-4-3-2-1 sensory grounding technique",
        "Try box breathing (4 counts in, 4 hold, 4 out, 4 hold)",
        "Use cold water or ice on wrists to interrupt intense emotional states",
        "Create a playlist of calming music",
        "Develop a list of self-soothing activities you can turn to",
      ],
    },
  ],
  self: [
    {
      title: "Connecting with Your Core Self",
      description: "A meditation to strengthen connection with your authentic Self",
      type: "meditation" as const,
      instructions: [
        "Find a quiet space and sit comfortably",
        "Focus on your breath for several minutes",
        "Recall a time when you felt calm, clear, and compassionate",
        "Notice the qualities of your Self: curiosity, compassion, clarity, etc.",
        "Practice embodying these qualities for 10-15 minutes",
        "Return to this meditation regularly to strengthen Self energy",
      ],
    },
    {
      title: "Self-Led Decision Making",
      description: "A journaling exercise to practice making decisions from Self",
      type: "journaling" as const,
      instructions: [
        "Identify a decision you're currently facing",
        "Notice which parts have strong opinions about this decision",
        "Thank these parts for their input and ask them to step back",
        "Connect with your Self energy (calm, curious, compassionate)",
        "From this Self perspective, journal about what feels right",
        "Notice the difference between part-led and Self-led decisions",
      ],
    },
  ],
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
  const [generatedExercises, setGeneratedExercises] = useState<ExerciseType[]>([])
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
      content: ifsPrompts[0].content,
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

  // End the current therapy session and generate exercises
  const endSession = () => {
    if (!currentSession) return

    // Analyze the conversation to determine which parts were discussed
    const sessionText = messages
      .map((m) => m.content)
      .join(" ")
      .toLowerCase()

    // Identify which parts were discussed based on keywords
    const partMentioned = {
      protector: sessionText.includes("protect") || sessionText.includes("guard") || sessionText.includes("shield"),
      exile:
        sessionText.includes("hurt") ||
        sessionText.includes("pain") ||
        sessionText.includes("wound") ||
        sessionText.includes("young"),
      manager:
        sessionText.includes("control") ||
        sessionText.includes("organize") ||
        sessionText.includes("plan") ||
        sessionText.includes("perfect"),
      firefighter:
        sessionText.includes("distract") ||
        sessionText.includes("numb") ||
        sessionText.includes("avoid") ||
        sessionText.includes("escape"),
      self:
        sessionText.includes("calm") ||
        sessionText.includes("curious") ||
        sessionText.includes("compassion") ||
        sessionText.includes("clarity"),
    }

    // Generate personalized exercises based on the parts discussed
    const exercises: ExerciseType[] = []

    Object.entries(partMentioned).forEach(([part, mentioned]) => {
      if (mentioned && exerciseTemplates[part as PartType]) {
        // Select 1-2 exercises for each identified part
        const selectedExercises = exerciseTemplates[part as PartType]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1)

        selectedExercises.forEach((exercise) => {
          exercises.push({
            ...exercise,
            id: generateId(),
            completed: false,
          })
        })
      }
    })

    // If no specific parts were identified, add a general Self exercise
    if (exercises.length === 0) {
      exercises.push({
        ...exerciseTemplates.self[0],
        id: generateId(),
        completed: false,
      })
    }

    setGeneratedExercises(exercises)

    // Update and save the session
    const completedSession: SessionType = {
      ...currentSession,
      exercises,
      completed: true,
    }

    setPastSessions([completedSession, ...pastSessions])
    setCurrentSession(null)
    setIsSessionActive(false)
    setActiveTab("exercises")

    // toast({
    //   title: "Session Completed",
    //   description: "Your personalized exercises have been generated based on our conversation.",
    // })
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: MessageType = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")

    // Update session progress
    const newProgress = Math.min(100, Math.round((currentPromptIndex / (ifsPrompts.length - 1)) * 100))
    setSessionProgress(newProgress)

    // Get next prompt
    setTimeout(() => {
      const currentPrompt = ifsPrompts[currentPromptIndex]

      // Add bot response
      const botMessage: MessageType = {
        id: generateId(),
        role: "bot",
        content: currentPrompt.content,
        timestamp: new Date(),
      }

      setMessages([...updatedMessages, botMessage])

      // Update current session
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          messages: [...updatedMessages, botMessage],
        })
      }

      // Move to next prompt or end session
      if (currentPrompt.followUp) {
        const nextPromptIndex = ifsPrompts.findIndex((p) => p.id === currentPrompt.followUp)
        setCurrentPromptIndex(nextPromptIndex !== -1 ? nextPromptIndex : currentPromptIndex + 1)
      } else {
        // End of prompts reached
        endSession()
      }
    }, 1000)
  }

  // Toggle exercise completion status
  const toggleExerciseCompletion = (exerciseId: string) => {
    setGeneratedExercises((exercises) =>
      exercises.map((ex) => (ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex)),
    )
  }

  // Save exercises to user profile
  const saveExercises = () => {
    // toast({
    //   title: "Exercises Saved",
    //   description: "Your personalized exercises have been saved to your profile.",
    // })
  }

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
              <CardFooter>
                <form
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
                </form>
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
              {generatedExercises.length > 0 ? (
                <div className="space-y-4">
                  {generatedExercises.map((exercise) => (
                    <motion.div
                      key={exercise.id}
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
                      setActiveTab("chat")
                      startSession()
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

      <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>About Internal Family Systems (IFS) Therapy</DialogTitle>
            <DialogDescription>Understanding the core concepts of IFS therapy</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Internal Family Systems (IFS) is a transformative approach to psychotherapy that recognizes we all have
              multiple sub-personalities or "parts" within our psyche. Developed by Dr. Richard Schwartz in the 1980s,
              IFS provides a framework for understanding and healing these internal relationships.
            </p>

            <h3 className="text-lg font-semibold">Key Concepts in IFS</h3>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="parts">
                <AccordionTrigger>Parts of the Self</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">IFS identifies three main types of parts:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Exiles:</strong> Vulnerable, young parts that carry pain, trauma, or shame
                    </li>
                    <li>
                      <strong>Managers:</strong> Proactive protectors that try to keep exiles suppressed and maintain
                      control
                    </li>
                    <li>
                      <strong>Firefighters:</strong> Reactive protectors that activate when exiles break through, often
                      using impulsive behaviors
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="self">
                <AccordionTrigger>The Core Self</AccordionTrigger>
                <AccordionContent>
                  <p>Beyond all parts is the "Self" – your core essence characterized by qualities like:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Compassion</li>
                    <li>Curiosity</li>
                    <li>Calmness</li>
                    <li>Clarity</li>
                    <li>Courage</li>
                    <li>Confidence</li>
                    <li>Creativity</li>
                    <li>Connectedness</li>
                  </ul>
                  <p className="mt-2">The Self is the natural leader of your internal system when unburdened.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="process">
                <AccordionTrigger>The IFS Process</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Identify parts that are active or causing distress</li>
                    <li>Access Self energy to work with these parts</li>
                    <li>Understand the role and purpose of each part</li>
                    <li>Unburden parts from extreme beliefs and emotions</li>
                    <li>Restore harmony to the internal system</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <p>
              This chatbot will guide you through a simplified IFS process, helping you identify and work with your
              parts. While it&#39;s a helpful tool for self-exploration, it&lsquo;s not a replacement for working with a trained
              IFS therapist.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowIntroDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

