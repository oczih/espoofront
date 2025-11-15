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
          type AnchorRendererProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> & { 
            href?: string; 
            node?: unknown; 
            children?: React.ReactNode;
          };
          type CodeRendererProps = Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'className'> & { 
            inline?: boolean; 
            className?: string; 
            node?: unknown; 
            children?: React.ReactNode;
          };

          const mdComponents: Components = {
            a: ({ children, node, ...props }: AnchorRendererProps) => {
              // Explicitly ignore node property from react-markdown AST
              void node;
              return (
                // Open links in new tab and keep styling
                <a {...props} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                  {children}
                </a>
              );
            },
            code: ({ inline, className, children, node, ...props }: CodeRendererProps) => {
              // Explicitly ignore node property from react-markdown AST
              void node;
              if (inline) {
                return (
                  <code className={`bg-gray-200 text-sm px-1 py-0.5 rounded ${className ?? ''}`} {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <pre className="bg-gray-900 text-white rounded p-3 overflow-auto text-sm">
                  <code className={className ?? ''} {...props}>
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
