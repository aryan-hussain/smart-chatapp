import React from "react";

export function formatText(inputText) {
  // Split the input text by line breaks to handle new paragraphs
  const paragraphs = inputText.split("\n\n");

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        // Check for bullet points (lines that start with '-')
        if (paragraph.trim().startsWith("-")) {
          const items = paragraph
            .split("\n")
            .map((item, i) => (
              <li key={`item-${index}-${i}`}>{item.replace("-", "").trim()}</li>
            ));
          return <ul key={`list-${index}`}>{items}</ul>;
        }

        // Return a simple paragraph
        return <p key={`paragraph-${index}`}>{paragraph}</p>;
      })}
    </>
  );
}

export function formatText2(response) {
  // Split the response into lines
  console.log(response,"checking the formatText2 response")
  const lines = response.split("\n");

  // Process each line
  return lines.map((line, index) => {
    // Check if the line contains a bullet point
    if (line.trim().startsWith("-")) {
      return (
        <li key={index} style={{ margin: "5px 5px" }}>
          {line.trim().substring(1).trim()}
        </li>
      );
    }

    // For the first and last lines (which are usually not bullet points)
    if (line.trim().length > 0) {
      return (
        <p key={index} style={{ margin: "5px 5px" }}>
          {line.trim()}
        </p>
      );
    }

    // Skip empty lines
    return null;
  });
}
