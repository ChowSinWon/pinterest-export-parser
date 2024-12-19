// Import necessary libraries
import "jsr:@std/dotenv/load";
import { DOMParser, Element, Node } from "jsr:@b-fuze/deno-dom";

// Configuration constants (can be replaced with environment variables or a config file)
const INPUT_PATH = Deno.env.get("INPUT_PATH") || "./input/pinterest.html";
const OUTPUT_PATH = Deno.env.get("OUTPUT_PATH") || "./output/pindata.json";

// Utility functions
const isElement = (node: Node | null, tagName?: string): boolean =>
  node?.nodeType === 1 && (!tagName || node.nodeName === tagName.toUpperCase());
const isText = (node: Node | null): boolean =>
  node?.nodeType === 3 && node.textContent.trim().length > 0;
const isA = (node: Node | null): boolean => isElement(node, "A");
const isH1 = (node: Node | null): boolean => isElement(node, "H1");

const addMetaData = (
  block: Record<string, string>,
  node: Node | null,
): [Record<string, string>, Node | undefined] => {
  let currentNode = node?.nextSibling;
  while (currentNode) {
    if (isText(currentNode)) {
      const [key, value] = currentNode.textContent.trim().split(": ");
      if (key === "Canonical Link:" && isA(currentNode.nextSibling)) {
        block["Canonical Link"] =
          (currentNode.nextSibling as Element).getAttribute("href") || "";
      } else if (
        value && value.trim() !== "" && value !== "No data," &&
        !value.startsWith("None")
      ) {
        block[key] = value.replace(/,$/, "");
      }
    }

    if (isText(currentNode) && currentNode.textContent.startsWith("Private:")) {
      break;
    }
    currentNode = currentNode.nextSibling;
  }

  return [block, currentNode || undefined];
};

const extractImageUrl = (imageField: string): string => {
  const maxWidth = 736;
  return `https://i.pinimg.com/${maxWidth}x/${imageField.slice(0, 2)}/${
    imageField.slice(2, 4)
  }/${imageField.slice(4, 6)}/${imageField}.jpg`;
};

const parsePinterestHTML = async (): Promise<void> => {
  try {
    const htmlContent = await Deno.readTextFile(INPUT_PATH);
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");

    if (!doc) {
      console.error("Failed to parse the HTML file.");
      return;
    }

    let targetH1 = doc.querySelector("h1#y1bkd"); // This was my identifier
    if (!targetH1) { // Fallback in case identifier changes in other exports
      const h1Elements = doc.querySelectorAll("h1"); // Get all h1 elements
      for (const h1 of h1Elements) {
        if (h1.textContent.trim() === "Pins") {
          targetH1 = h1;
          break;
        }
      }
    }

    if (!targetH1) {
      console.error("Target H1 element not found in the document.");
      return;
    }

    const collectedContent: Record<string, unknown>[] = [];
    let currentNode: Node | undefined = targetH1.nextSibling || undefined;

    while (currentNode) {
      if (isH1(currentNode)) break;

      let block: Record<string, string> = {};
      if (isA(currentNode)) {
        const pinterestLink = (currentNode as Element).getAttribute("href") ||
          "";

        // Validate Pinterest link format
        if (pinterestLink.startsWith("https://www.pinterest.com/pin/")) {
          block["Pinterest Link"] = pinterestLink;
          [block, currentNode] = addMetaData(block, currentNode);

          if (block.Image && block.Image !== "No data") {
            block.ImageUrl = extractImageUrl(block.Image);
          }

          collectedContent.push(block);
        }
      }

      currentNode = currentNode?.nextSibling || undefined;
    }

    await Deno.writeTextFile(
      OUTPUT_PATH,
      JSON.stringify(collectedContent, null, 2),
    );
    console.log(
      `Data extracted and saved ${collectedContent.length} pins to ${OUTPUT_PATH}`,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
};

// Execute the script
parsePinterestHTML();
