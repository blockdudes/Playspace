import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { HelpCircle } from "lucide-react"
  
  type FAQItem = {
    question: string
    answer: string
  }
  
  const faqItems: FAQItem[] = [
    {
      question: "How does the referral system work?",
      answer: "Our referral system rewards you for inviting friends to join our gaming platform. For every 10 friends you successfully refer, you'll earn 100 gaming tokens. These tokens can be used in our games or exchanged for other rewards."
    },
    {
      question: "How do I invite friends?",
      answer: "To invite friends, go to the 'Referral' page in your account dashboard. You'll find a form where you can enter up to 10 email addresses. Once you submit the form, invitations will be sent to your friends. Remember, you'll earn tokens only when all 10 friends sign up."
    },
    {
      question: "What are the two games for earning tokens?",
      answer: "We offer two main ways to earn tokens through gaming: 1) Gambling games where you can win tokens, and 2) Play-to-earn games where you earn based on playtime."
    },
    {
      question: "How do I earn tokens through gambling games?",
      answer: "In our gambling games, you can bet your existing tokens for a chance to win more. The amount you can win depends on the game and your luck. Remember to gamble responsibly and within your means."
    },
    {
      question: "How does the play-to-earn system work?",
      answer: "In our play-to-earn games, you earn tokens based on the time you spend playing. The longer you play, the more tokens you accumulate. Different games may have different earning rates, so check each game's details for specific information."
    },
    {
      question: "Are there any limits to how many tokens I can earn?",
      answer: "While there's no strict limit on token earnings, we have systems in place to ensure fair play. Excessive earnings in a short period may trigger a review to prevent abuse of the system."
    },
  ]
  
  export default function Component() {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    )
  }