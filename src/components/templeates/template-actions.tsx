"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardSpotlight } from "../ui/card-spotlight"
import { FileText, Code, HelpCircle } from "lucide-react"

interface TemplateActionsProps {
  template: {
    id: string
    title: string
    isPremium: boolean
  }
}

export function TemplateActions({ template }: TemplateActionsProps) {
  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </TabsTrigger>
              <TabsTrigger value="installation" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Installation</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <div className="prose prose-invert max-w-none">
                <h3>About this template</h3>
                <p>
                  This template is designed to help you{" "}
                  {template.isPremium
                    ? "streamline your workflow and enhance your productivity"
                    : "get started quickly with a professional design"}
                  . It's perfect for businesses of all sizes and individuals looking to{" "}
                  {template.isPremium
                    ? "take their digital presence to the next level"
                    : "establish a professional online presence"}
                  .
                </p>

                <h3>Who is this for?</h3>
                <p>This template is ideal for:</p>
                <ul>
                  <li>Marketing professionals</li>
                  <li>Content creators</li>
                  <li>Small to medium-sized businesses</li>
                  <li>Freelancers and consultants</li>
                </ul>

                <h3>Technical specifications</h3>
                <p>The template is built with modern technologies to ensure compatibility and ease of use:</p>
                <ul>
                  <li>Fully responsive design</li>
                  <li>Compatible with all major platforms</li>
                  <li>Regular updates and improvements</li>
                  <li>Comprehensive documentation</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="installation">
              <div className="prose prose-invert max-w-none">
                <h3>Installation Guide</h3>
                <p>Follow these steps to get started with your template:</p>

                <h4>Step 1: Download the template</h4>
                <p>
                  {template.isPremium
                    ? "After purchasing, you'll receive a download link via email. Click the link to download the template package."
                    : "Click the download button at the top of this page to get the template package."}
                </p>

                <h4>Step 2: Extract the files</h4>
                <p>Extract the ZIP file to a location on your computer where you can easily access it.</p>

                <h4>Step 3: Customize the template</h4>
                <p>
                  Open the template files in your preferred editor and customize them according to your needs. Refer to
                  the documentation for detailed instructions on customization options.
                </p>

                <h4>Step 4: Deploy your template</h4>
                <p>
                  Once you've customized the template, you can deploy it to your preferred platform. The template is
                  compatible with all major hosting services.
                </p>

                <h3>Need help?</h3>
                <p>
                  If you encounter any issues during installation or customization, please refer to our documentation or
                  contact our support team for assistance.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="faq">
              <div className="prose prose-invert max-w-none">
                <h3>Frequently Asked Questions</h3>

                <h4>Can I use this template for commercial projects?</h4>
                <p>
                  {template.isPremium
                    ? "Yes, with the premium license, you can use this template for both personal and commercial projects. However, you cannot redistribute or resell the template itself."
                    : "Yes, you can use this free template for both personal and commercial projects. Attribution is appreciated but not required."}
                </p>

                <h4>Do I need coding knowledge to use this template?</h4>
                <p>
                  Basic knowledge of HTML, CSS, and JavaScript is helpful for customization, but the template is
                  designed to be user-friendly even for beginners. We provide comprehensive documentation to guide you
                  through the customization process.
                </p>

                <h4>Will I receive updates for this template?</h4>
                <p>
                  {template.isPremium
                    ? "Yes, premium templates include free updates. You'll be notified via email when updates are available."
                    : "Free templates receive occasional updates. Check back regularly for the latest version."}
                </p>

                <h4>Can I get a refund if I'm not satisfied?</h4>
                <p>
                  {template.isPremium
                    ? "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with the template, contact our support team for a full refund."
                    : "As this is a free template, no refund policy applies."}
                </p>

                <h4>How can I get support?</h4>
                <p>
                  {template.isPremium
                    ? "Premium templates include priority support. You can contact our support team via email or through the support portal."
                    : "For free templates, community support is available through our forums. Premium support is available for purchase."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardSpotlight>
      </div>
    </section>
  )
}

