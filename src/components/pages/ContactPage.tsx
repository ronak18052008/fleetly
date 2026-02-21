import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Header Section */}
        <section className="w-full bg-section-background">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <h1 className="font-heading text-4xl text-foreground mb-3">Contact Us</h1>
            <p className="font-paragraph text-base text-secondary">
              Get in touch with our support team for inquiries, technical assistance, or feedback
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="w-full">
          <div className="max-w-[100rem] mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-heading text-2xl text-foreground mb-6">Get in Touch</h2>
                  <p className="font-paragraph text-base text-secondary mb-8">
                    Our team is available to assist you with any questions or concerns about FleetFlow.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base text-foreground mb-1">Email</h3>
                        <a href="mailto:support@fleetflow.com" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                          support@fleetflow.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base text-foreground mb-1">Phone</h3>
                        <a href="tel:+1234567890" className="font-paragraph text-sm text-secondary hover:text-primary transition-colors">
                          +1 (234) 567-890
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base text-foreground mb-1">Office</h3>
                        <p className="font-paragraph text-sm text-secondary">
                          123 Fleet Street<br />
                          Logistics District<br />
                          City, State 12345
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-section-background rounded">
                    <h3 className="font-heading text-base text-foreground mb-2">Business Hours</h3>
                    <p className="font-paragraph text-sm text-secondary">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-background p-8 rounded shadow-sm border border-section-background"
                >
                  <h2 className="font-heading text-2xl text-foreground mb-6">Send us a Message</h2>
                  
                  {submitted && (
                    <div className="mb-6 p-4 bg-status-available/10 border border-status-available rounded">
                      <p className="font-paragraph text-sm text-foreground">
                        Thank you for your message! We'll get back to you as soon as possible.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block font-paragraph text-sm text-foreground mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="font-paragraph text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block font-paragraph text-sm text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="font-paragraph text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block font-paragraph text-sm text-foreground mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="font-paragraph text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block font-paragraph text-sm text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="font-paragraph text-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto bg-primary text-primary-foreground hover:opacity-90 font-paragraph text-sm font-medium px-8 py-3"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
