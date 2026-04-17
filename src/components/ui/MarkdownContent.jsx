import ReactMarkdown from "react-markdown";
import "@/styles/markdown.css";

export default function MarkdownContent({ content, label }) {
  if (!content) return null;

  return (
    <div className="markdown-content text-main">
      {label && <label className="block text-h45 font-medium text-muted-foreground mb-2">{label}</label>}
      <ReactMarkdown
        components={{
          hr: () => <br />,
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
