# Pinterest Data Export Parser

## Overview

This tool automates the extraction of data from a Pinterest HTML export file,
converting it into structured JSON format. It simplifies pin data processing for
Pinterest users.

## Features

- Parses Pinterest HTML export files.
- Converts data to a clean, structured JSON format.
- Extracts metadata and generates URLs for images.

## Prerequisites

- [Deno](https://deno.land/) (v2.1.4 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChowSinWon/pinterest-export-parser.git
   cd pinterest-export-parser
   ```
2. Install [Deno](https://deno.land/) if not already installed.

## Usage

1. Place your Pinterest HTML export file in the `input` directory.
2. Configure input and output paths:
   - Update `INPUT_PATH` and `OUTPUT_PATH` in the `.env` file or set them as
     environment variables.
3. Run the script:
   ```bash
   deno task start
   ```

The extracted data will be saved to the specified output path.

## Example

Very simplified and trimmed input - you do not need to modify the original
document at all (HTML):

```html
<div id="contents">
  <h1 id="y1bkd">Pins</h1>
  <a href="https://www.pinterest.com/pin/123456789/"
  >https://www.pinterest.com/pin/123456789/</a>
  <br>Title: No data,
  <br>Details: some text,
  <br>Image: abcdefghijklmnopqrstuvwxyz,
  <br>Is Native: No data,
  <br>Board Id: 9876543210,
  <br>Board Name: No data,
  <br>Is Video: No data,
  <br>Ip Address: 555.555.555.555,
  <br>Username: me,
  <br>Alt Text: No data,
  <br>Canonical Link: <a
    href="https://some-cool-address-that-leads-to-the-source-of-my-pin"
  >https://some-cool-address-that-leads-to-the-source-of-my-pin</a>,
  <br>Story Pin Media: No data,
  <br>Video: No data,
  <br>Created at: 2017/02/13 15:35:01
  <br>Alive: True
  <br>Is a repin: True
  <br>Private: False<br>
  <br>
  <h1 id="1234">Something else</h1>
</div>
```

Output (JSON):

```json
[
  {
    "Pinterest Link": "https://www.pinterest.com/pin/123456789/",
    "Details": "some text",
    "Image": "abcdefghijklmnopqrstuvwxyz",
    "Board Id": "9876543210",
    "Ip Address": "555.555.555.555",
    "Username": "me",
    "Canonical Link": "https://some-cool-address-that-leads-to-the-source-of-my-pin",
    "Created at": "2017/02/13 15:35:01",
    "Alive": "True",
    "Is a repin": "True",
    "Private": "False",
    "ImageUrl": "https://i.pinimg.com/736x/ab/cd/ef/abcdefghijklmnopqrstuvwxyz.jpg"
  }
]
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, open an issue on
[GitHub](https://github.com/ChowSinWon/pinterest-export-parser/issues).
