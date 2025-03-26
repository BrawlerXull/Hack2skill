import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowRight, Brain, Check, Heart, Mic, Smile } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div
      className="font-inter bg-white min-h-screen relative"
      style={{
        backgroundImage: `
            linear-gradient(to right, #FFE5EC 1px, transparent 1px),
            linear-gradient(to bottom, #FFE5EC 1px, transparent 1px)
          `,
        backgroundSize: "40px 40px",
        zIndex: 0,
      }}
    >
      <div className="relative z-10">

        <main className="pt-24 pb-16">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 animate-fadeInUp">
              <div className="inline-flex items-center bg-pink-100 text-pink-600 rounded-full px-4 py-2 text-sm font-medium">
                <Heart className="w-4 h-4 mr-2" />
                AI-Powered Wellness Companion
                <span className="ml-2 px-2 py-0.5 bg-pink-500 text-white rounded-full text-xs">
                  New
                </span>
              </div>

              <h1 className="text-5xl text-blue-400 sm:text-6xl font-bold">
              Experience Instant {" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-500">
                Mental Wellness Support
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl text-gray-600">
                AI-powered tool for personalized mental wellness and stress relief.
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI analyzes your needs and suggests personalized coping mechanisms, like mindfulness, journaling, and stress management.
              </p>
              <Link href="/chatbot" className="flex justify-center gap-4 mt-8">
                <button className="rounded-full px-8 py-6 text-lg gap-2 bg-pink-500 hover:bg-pink-600 text-white inline-flex items-center">
                  Start Your Wellness Journey <ArrowRight className="ml-2" size={18} />
                </button>
              </Link>
            </div>

            {/* Why It Matters Section */}
            <div className="mt-24 bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2">
                    <AlertCircle className="text-pink-500 w-6 h-6" />
                    <h2 className="text-3xl font-bold">Why Mental Wellness Matters</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                        <span className="text-pink-500 font-semibold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Personalized Support
                        </h3>
                        <p className="text-gray-600">
                          AI provides tailored wellness strategies to enhance your mental health.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                        <span className="text-pink-500 font-semibold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Save Time</h3>
                        <p className="text-gray-600">
                          No need to manually search for wellness techniques—our AI suggests them for you.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                        <span className="text-pink-500 font-semibold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          Enhanced Mental Health
                        </h3>
                        <p className="text-gray-600">
                          AI supports emotional well-being, mindfulness, and mental growth.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative mx-auto max-w-[600px]">
                    <div className="relative">
                      <div className="bg-gray-800 rounded-t-xl p-2 aspect-[16/10]">
                        <div className="bg-white rounded-lg h-full p-4 overflow-hidden">
                          <Image
                            src="/image2.png"
                            alt="AI Wellness Companion Dashboard"
                            className="w-full h-full object-cover rounded"
                            layout="responsive"
                            width={600}
                            height={400}
                          />
                        </div>
                      </div>
                      <div className="bg-gray-800 h-4 rounded-b-lg transform perspective-1000 rotateX-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section className="mt-24 grid md:grid-cols-3 gap-8 animate-fadeInUp">
              {[
                {
                  title: "Automated Wellness Highlights",
                  description:
                    "AI scans your responses and suggests the best coping mechanisms.",
                },
                {
                  title: "Smart Mindfulness Suggestions",
                  description:
                    "Auto-generated wellness strategies ensure better mental health and relaxation.",
                },
                {
                  title: "Optimized Self-Care Planning",
                  description:
                    "AI creates personalized schedules and plans to fit your mental wellness journey.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-pink-100 hover:shadow-xl transition-shadow"
                >
                  <Check className="text-pink-500 mb-4" size={24} />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </section>
          </section>

          <section className="bg-pink-500 text-white mt-24 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-4">
                  Share Your Mental Wellness Journey
                </h2>
                <p className="text-xl mb-8">
                  Help us improve by sharing your experience with our AI-powered wellness companion.
                </p>
                <button className="px-6 py-3 bg-white text-pink-500 rounded-full hover:bg-pink-50 transition-all duration-300 ease-in-out hover:scale-105">
                  Give Feedback
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-white border-t border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Mic className="w-8 h-8 text-pink-500" />
                  WellnessAI
                </h3>
                <p className="text-gray-600">
                  Improve your mental health effortlessly with AI-powered support.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
