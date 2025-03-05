import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Style cho code
import "github-markdown-css"; // Style giống GitHub

const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
