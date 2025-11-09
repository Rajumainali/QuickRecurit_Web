import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-4xl mx-auto space-y-4"
    >
      <AccordionItem
        value="item-1"
        className="border border-gray-200 rounded-lg px-6 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
      >
        <AccordionTrigger className="text-left text-gray-700 dark:text-zinc-200 hover:no-underline py-4 text-base font-medium cursor-pointer">
          What's the benefits of QuickRecruit?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-zinc-400 pb-4 text-sm leading-relaxed">
          QuickRecruit offers comprehensive benefits including 24/7 customer
          support, reliable service delivery, cost-effective solutions, and
          personalized assistance tailored to your specific needs. Our platform
          ensures seamless communication and efficient problem resolution.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="item-2"
        className="border border-gray-200 rounded-lg px-6 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
      >
        <AccordionTrigger className="text-left text-gray-700 dark:text-zinc-200 hover:no-underline py-4 text-base font-medium cursor-pointer">
          What's the benefits of QuickRecruit?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-zinc-400 pb-4 text-sm leading-relaxed">
          With QuickRecruit, you get access to expert guidance, streamlined
          processes, and innovative tools that help you achieve your goals
          faster. We provide transparent pricing, flexible service options, and
          a user-friendly interface that makes your experience smooth and
          enjoyable.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="item-3"
        className="border border-gray-200 rounded-lg px-6 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
      >
        <AccordionTrigger className="text-left text-gray-700 dark:text-zinc-200 hover:no-underline py-4 text-base font-medium cursor-pointer">
          What's the benefits of QuickRecruit?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-zinc-400 pb-4 text-sm leading-relaxed">
          QuickRecruit stands out with its commitment to quality, reliability,
          and customer satisfaction. Our benefits include faster response times,
          detailed reporting, secure data handling, and continuous service
          improvements based on user feedback. We prioritize your success and
          work tirelessly to exceed your expectations.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="item-4"
        className="border border-gray-200 rounded-lg px-6 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
      >
        <AccordionTrigger className="text-left text-gray-700 dark:text-zinc-200 hover:no-underline py-4 text-base font-medium cursor-pointer">
          What's the benefits of QuickRecruit?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 dark:text-zinc-400 pb-4 text-sm leading-relaxed">
          Our platform delivers exceptional value through automated workflows,
          real-time notifications, comprehensive analytics, and seamless
          integrations. QuickRecruit helps reduce operational costs, improves
          efficiency, and provides scalable solutions that grow with your
          business needs.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
