import ReactMarkdown from "react-markdown";
import "@/styles/markdown.css";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content, label }) {
  if (!content) return null;

  return (
    <div className="markdown-content text-main">
      {label && <label className="block text-h45 font-medium text-muted-foreground mb-2">{label}</label>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          hr: () => <br />,
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            />
          ),
          ul: ({ children }) => (
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem", margin: "0.75rem 0" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ listStyleType: "decimal", paddingLeft: "2rem", margin: "0.75rem 0" }}>
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}