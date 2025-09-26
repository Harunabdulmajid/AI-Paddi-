
import React from 'react';

interface ScriptViewerProps {
  script: string;
}

export const ScriptViewer: React.FC<ScriptViewerProps> = ({ script }) => {
  // Split script into lines and process each one
  const formattedContent = script.split('\n').map((line, index) => {
    const trimmedLine = line.trim();

    // Check for speaker labels (e.g., "Host:")
    const speakerMatch = trimmedLine.match(/^([\w\s]+):/);
    if (speakerMatch) {
      const speaker = speakerMatch[1];
      const dialogue = trimmedLine.substring(speaker.length + 1).trim();
      return (
        <p key={index} className="mb-3">
          <span className="font-bold text-primary">{speaker}:</span> {dialogue}
        </p>
      );
    }

    // Check for sound effects/cues in parentheses
    if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      return (
        <p key={index} className="my-4 text-accent/90 italic text-base">
          {trimmedLine}
        </p>
      );
    }
    
    // Handle empty lines as paragraph breaks
    if (trimmedLine === '') {
        return <div key={index} className="h-3" />;
    }

    // Regular dialogue line
    return (
      <p key={index} className="mb-3">
        {trimmedLine}
      </p>
    );
  });

  return (
    <div className="h-full bg-neutral-50 p-6 rounded-xl overflow-y-auto border border-neutral-200">
      <div className="prose prose-base max-w-none font-sans text-neutral-800 leading-relaxed">
        {formattedContent}
      </div>
    </div>
  );
};