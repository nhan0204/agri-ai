import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "What does Fermy taste like?",
      answer:
        "It has a subtle sweetness and refreshing fermented taste that's easy to drink! You can enjoy its natural flavor.",
    },
    {
      question: "Can people with milk allergies drink it?",
      answer:
        "People with cow's milk allergies may be able to drink it, but there are individual differences, so please consult your doctor.",
    },
    {
      question: "How should I store it and what's the shelf life?",
      answer: "Store refrigerated for about 14 days. Please consume promptly after opening.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
