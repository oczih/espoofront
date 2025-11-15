"use client";

import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Do NOT use rehype-raw by default to avoid rendering raw HTML from untrusted sources.
        components={((): Components => {
          // Explicitly type renderer props to avoid implicit 'any'
          type AnchorRendererProps = React.ComponentPropsWithoutRef<'a'> & { href?: string; node?: any; children?: React.ReactNode };
          type CodeRendererProps = React.HTMLAttributes<HTMLElement> & { inline?: boolean; className?: string; node?: any; children?: React.ReactNode };

          const mdComponents: Components = {
            a: ({ children, ...props }: AnchorRendererProps) => (
              // Open links in new tab and keep styling
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a {...(props as any)} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                {children}
              </a>
            ),
            code: ({ inline, className, children, ...props }: CodeRendererProps) => {
              if (inline) {
                return (
                  <code className={`bg-gray-200 text-sm px-1 py-0.5 rounded ${className ?? ''}`} {...(props as any)}>
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-gray-900 text-white rounded p-3 overflow-auto text-sm">
                  <code className={className as string} {...(props as any)}>
                    {children}
                  </code>
                </pre>
              );
            },
          };
          return mdComponents;
        })()}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
