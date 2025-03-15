import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Style cho code block
import "github-markdown-css"; // Style giống GitHub

const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div
      className="markdown-body"
      style={{
        backgroundColor: "white",
        color: "black",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;