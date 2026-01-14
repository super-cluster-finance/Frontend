import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSidebar({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="sticky top-24">
      <div className="space-y-3">
        {items.map((item, index) => {
          const isExpanded = expandedFaq === index;
          return (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isExpanded={isExpanded}
              onToggle={() => setExpandedFaq(isExpanded ? null : index)}
            />
          );
        })}
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isExpanded,
  onToggle,
}: {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div className="bg-white/10 border border-white/10 rounded overflow-hidden backdrop-blur-2xl hover:border-white/20 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full p-5 text-left flex items-start gap-3 hover:bg-white/2 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-200 text-sm leading-snug pr-8">
            {question}
          </h4>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        style={{ height: `${height}px` }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="pb-5 px-5">
          <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
