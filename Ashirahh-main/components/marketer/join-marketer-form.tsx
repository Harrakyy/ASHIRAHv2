"use client"

import { useState } from "react"
import Image from "next/image"
import { DollarSign, BookOpen, Headphones, Users, CheckCircle, Send, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const benefits = [
  {
    icon: DollarSign,
    title: "Attractive Commission",
    description: "Earn competitive commission for every successful order you bring in.",
  },
  {
    icon: BookOpen,
    title: "Exclusive Catalog",
    description: "Access to complete product catalog with wholesale pricing information.",
  },
  {
    icon: Headphones,
    title: "Marketing Support",
    description: "Get promotional materials, design assets, and dedicated support.",
  },
  {
    icon: Users,
    title: "Growing Network",
    description: "Join a community of successful marketers across Indonesia.",
  },
]

interface FormData {
  name: string
  phone: string
  city: string
  experience: string
  socialMedia: string
}

export function JoinMarketerForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    city: "",
    experience: "",
    socialMedia: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Create mailto link with the required subject format
    const subject = encodeURIComponent(`JOIN MARKETER - ${formData.name}`)
    const body = encodeURIComponent(`
MARKETER APPLICATION
====================

Full Name: ${formData.name}
Phone (WhatsApp): ${formData.phone}
City: ${formData.city}
Experience: ${formData.experience}
Social Media: ${formData.socialMedia}

---
Submitted via ASHIRA Website
    `.trim())

    // Open email client
    window.location.href = `mailto:ashira.hmco@gmail.com?subject=${subject}&body=${body}`

    // Wait a moment then show success
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h2 className="font-serif text-3xl text-foreground mb-4">Application Submitted!</h2>
          
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in joining ASHIRA&apos;s marketing team. 
            Our team will review your application and contact you soon.
          </p>

          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                name: "",
                phone: "",
                city: "",
                experience: "",
                socialMedia: "",
              })
            }}
            className="text-[#D4AF37] hover:underline"
          >
            Submit Another Application
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Career Opportunity
            </span>
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Join Our Marketing Team
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Become a part of ASHIRA GROUP and earn while helping organizations get premium custom apparel.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div>
            <h2 className="font-serif text-2xl text-foreground mb-8">Why Join Us?</h2>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-10 p-6 bg-[#1c2143] rounded-lg">
              <p className="text-white/80 italic mb-4">
                &ldquo;Joining ASHIRA as a marketer has been a great opportunity. The support from the team 
                is excellent and the commission structure is very fair.&rdquo;
              </p>
              <p className="text-[#D4AF37] font-medium">- Active Marketer, Jakarta</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <h2 className="font-serif text-xl text-foreground mb-6">Application Form</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Full Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Phone (WhatsApp) *</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="08123456789"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">City *</label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Jakarta, Bandung, Surabaya"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Experience</label>
                <Textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell us about your marketing or sales experience (if any)"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Social Media Link</label>
                <Input
                  name="socialMedia"
                  value={formData.socialMedia}
                  onChange={handleInputChange}
                  placeholder="Instagram or LinkedIn profile URL"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-6"
                style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your application will be sent to ashira.hmco@gmail.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
