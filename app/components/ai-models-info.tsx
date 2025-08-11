import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, Mic, Video, Globe, Zap } from "lucide-react"

export default function AIModelsInfo() {
  const aiModels = [
    {
      name: "OpenAI GPT-4",
      purpose: "Agricultural Script Generation",
      icon: <Brain className="h-5 w-5" />,
      features: ["Crop disease knowledge synthesis", "Localized farming content", "Engagement optimization"],
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Claude 3",
      purpose: "Agricultural Content Analysis",
      icon: <MessageSquare className="h-5 w-5" />,
      features: ["Farming video analysis", "Agricultural expertise extraction", "Cultural context awareness"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "ElevenLabs Voice AI",
      purpose: "Southeast Asian Voiceover",
      icon: <Mic className="h-5 w-5" />,
      features: ["8+ language support", "Local accent adaptation", "Farmer-friendly tone"],
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Whisper AI",
      purpose: "Agricultural Video Transcription",
      icon: <Video className="h-5 w-5" />,
      features: ["Multi-language transcription", "Agricultural terminology", "Timestamp accuracy"],
      color: "bg-orange-100 text-orange-800",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Models for Agricultural Content</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Specialized AI models trained on agricultural knowledge and optimized for Southeast Asian farming contexts and
          languages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiModels.map((model, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {model.icon}
                {model.name}
              </CardTitle>
              <CardDescription>{model.purpose}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge className={model.color}>{model.purpose}</Badge>
                <ul className="space-y-2">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Architecture */}
      <Card className="bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Agricultural Content Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-medium mb-4">Content Processing Flow</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto pb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                  TikTok Agricultural Videos
                </span>
                <span>→</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full whitespace-nowrap">
                  Whisper Transcription
                </span>
                <span>→</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                  Claude Analysis
                </span>
                <span>→</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
                  GPT-4 Script Generation
                </span>
                <span>→</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full whitespace-nowrap">
                  ElevenLabs Voiceover
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <strong className="text-sm">N8N Workflows</strong>
                </div>
                <p className="text-sm text-gray-600">
                  Automated content processing, quality checks, and multi-platform distribution
                </p>
              </Card>
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <strong className="text-sm">Airtable Database</strong>
                </div>
                <p className="text-sm text-gray-600">
                  Agricultural content library, farmer feedback tracking, and performance analytics
                </p>
              </Card>
              <Card className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <strong className="text-sm">Zapier Integration</strong>
                </div>
                <p className="text-sm text-gray-600">
                  TikTok API connections, content scheduling, and farmer engagement analytics
                </p>
              </Card>
            </div>

            {/* Key Benefits */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="font-medium mb-4">Agricultural-Specific Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-green-600">Content Intelligence</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Crop disease identification accuracy</li>
                    <li>• Treatment method validation</li>
                    <li>• Yield optimization insights</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-600">Localization</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Regional farming practices</li>
                    <li>• Local crop varieties</li>
                    <li>• Cultural context adaptation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
