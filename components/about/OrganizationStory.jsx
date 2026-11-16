"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OrganizationStory({ content }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id={content.id}
      aria-labelledby="story-heading"
      className="scroll-mt-24 overflow-hidden bg-white py-16 sm:py-24 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-neutral-100 shadow-xl shadow-emerald-950/10 dark:bg-neutral-900">
              <Image
                src={content.image}
                alt={content.imageAlt || content.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {content.imageCaption && (
              <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-neutral-900/95">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  {content.lekhok} - {content.imageCaption}
                </p>
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="pt-4 lg:pt-0">
            {content.eyebrow && (
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                {content.eyebrow}
              </p>
            )}

            <SectionHeading
              id="story-heading"
              title={content.title}
              subtitle={content.subtitle}
            />

            {/* Paragraphs */}
            <div
              className={`mt-7 max-w-xl space-y-5 overflow-hidden text-base leading-8 text-neutral-600 dark:text-neutral-300 ${
                expanded ? "" : "line-clamp-6"
              }`}
            >
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Read More Button */}
            {content.paragraphs?.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-4 inline-flex items-center bg-gray-400 px-3 py-2 gap-2 rounded text-sm font-bold text-gray-700 transition-colors hover:text-gray-800 dark:text-gray-700 dark:hover:text-gray-700"
                aria-expanded={expanded}
              >
                {expanded ? "সংক্ষিপ্ত করুন" : "সম্পূর্ণ পড়ুন"}

                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}

            {/* Highlights */}
            {content.highlights?.length > 0 && (
              <ul className="mt-8 space-y-4">
                {content.highlights.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-2 size-2 shrink-0 rounded-full bg-emerald-700 dark:bg-amber-400" />
                    <span className="text-sm font-medium leading-7 text-neutral-800 dark:text-neutral-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
