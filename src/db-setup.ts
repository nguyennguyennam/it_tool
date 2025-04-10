// A script to setup the database.
import "dotenv/config";
import { sql } from "drizzle-orm";
import { sections, tools } from "./models/tools";
import { db } from "./services/db-service";

async function setup() {
  // Remove all entries first.
  await db.execute(
    sql`TRUNCATE TABLE "users", "tools", "sections", "favorites" RESTART IDENTITY CASCADE`,
  );

  // Add the sections.
  const sectionNames = [
    "Crypto",
    "Conversion",
    "Web",
    "Development",
    "Physics",
    "Math",
    "Random",
    "API",
    "Media",
    "Advent of Code",
  ];
  await db
    .insert(sections)
    .values(sectionNames.map((node) => ({ name: node })));

  /**
     * - Crypto
      - Password Generator
      - Text Hashing
      - Bcrypt
      - UUID Generator
      - Ciphers
  - Conversion
      - Integer base converter
      - String/Base64 converter
      - Color converter
  - Web Tools:
      - Encode/Decode URI components
      - JWT Parser
      - String slugify
  - Development:
      - JSON prettifier
      - Chmod calculator
      - Flexbox previewer
      - Code paste
  - Physics
      - Force of Attraction
      - Ideal gas law
      - Relative velocity
  - Math
      - Arithmetic/Geometric Sequences
      - Row echelon forms
      - Newton Microservice (Math evaluator)
      - Prime factorization
  - Random
      - Ticket Drawer
      - Die Roller
      - Random Number Generator
  - Open API tools
      - AniList (https://docs.anilist.co)
      - Open Weather
      - Dad Jokes
  - Image & Video Tools
      - Image Masks
      - QR Code Generator
      - Image Encoder
  - Solvers
      - 2024D1
      - 2024D2
      - 2024D3
     */
  await db.insert(tools).values([
    {
      name: "Password Generator",
      description:
        "Generate a password or a secure token using various options and settings, along with a password strength analysis.",
      path: "password",
      section: 1,
    },
    {
      name: "Hash",
      description: "Hash a string into a digest of various algorithms.",
      path: "hash",
      section: 1,
    },
    {
      name: "Bcrypt",
      description:
        "Take a swing at the most commonly used encoding algorithm used for passwords across the web. For example, Spring Security provides BCrypt out of the box!",
      path: "bcrypt",
      section: 1,
    },
    {
      name: "UUID Generator",
      description:
        "Generate a Universally Unique Identifier, most commonly used as primary keys. Did you know, Minecraft profiles use UUIDs?",
      path: "uuid",
      section: 1,
    },
    {
      name: "Ceasar Cipher",
      description:
        "Learn how the uber-popular ceasar cipher works, as it was prominently used in the show Gravity Falls. It's a simple way to encrypt a message by shifting characters on the alphabet.",
      path: "caesar",
      section: 1,
    },
    {
      name: "Integer Base Converter",
      description: "Convert a number from and to many different bases.",
      path: "integer-base",
      section: 2,
    },
    {
      name: "Base64 String",
      description:
        "Convert a data string into a more compact, usually used to encode bit strings for images, base64 encoded string.",
      path: "base64",
      section: 2,
    },
    {
      name: "Color Converter",
      description:
        "Convert a picked color between many notation forms of RGB, HSL and Hex codes for CSS.",
      path: "color",
      section: 2,
    },
    {
      name: "URI Components",
      description:
        "Encode to and decode from percent-encoded URI components, to be used in query items or paths in a URL.",
      path: "uri",
      section: 3,
    },
    {
      name: "JWT Parser",
      description:
        "Try parsing and verifying signed claims packaged in a JSON Web Token, a very common tool used for authentication on the web.",
      path: "jwt",
      section: 3,
    },
    {
      name: "Slugify",
      description:
        "Reformat a string into a 'slug' form, which is an all lowercased, separated by hyphens form of string.",
      path: "slugify",
      section: 3,
    },
    {
      name: "JSON Prettifier",
      description:
        "Prettify a jumbled string of JSON to be able to discern information easier.",
      path: "json-prettify",
      section: 4,
    },
    {
      name: "Chmod Calculator",
      description:
        "Calculate the needed mask for a Linux executable chmod, in base 8.",
      path: "chmod",
      section: 4,
    },
    {
      name: "Flexbox",
      description:
        "Preview basic settings of a flex-box in a playground-like canvas to better understand what flexboxes do.",
      path: "flexbox",
      section: 4,
    },
    {
      name: "Pastebin",
      description:
        "A publicly available paste-bin service to share codes to others.",
      path: "pastebin",
      section: 4,
    },
    {
      name: "Force of Attraction",
      description:
        "Calculate the force of attraction between two objects in an ideal environment.",
      path: "force-of-attraction",
      section: 5,
    },
    {
      name: "Ideal Gas",
      description: "Calculate the missing component of the ideal gas formula.",
      path: "ideal-gas",
      section: 5,
    },
    {
      name: "Relative Velocity",
      description:
        "Calculate using the relativity formula, considering the connection between the object's velocity relative to light and the object's mass.",
      path: "relativity",
      section: 5,
    },
    {
      name: "Sequences",
      description:
        "Generate or calculate an arithmetic or a geometric sequence.",
      path: "sequence",
      section: 6,
    },
    {
      name: "Row echelon form",
      description:
        "Reduce a matrix down to the row echelon form or even the reduced row echelon form.",
      path: "row-echelon",
      section: 6,
    },
    {
      name: "Math evaluator",
      description:
        "Evaluate a simple math expression using a simple wheel of evaluation choices.",
      path: "math",
      section: 6,
    },
    {
      name: "Prime factorization",
      description: "Factorize a number down to a product of prime numbers.",
      path: "factorize",
      section: 6,
    },
    {
      name: "Ticket Drawer",
      description:
        "Randomly pick out a ticket in a box of tickets, like lottery picking.",
      path: "ticket",
      section: 7,
    },
    {
      name: "Die Roller",
      description: "Roll a set number of dies of a set number of faces.",
      path: "die",
      section: 7,
    },
    {
      name: "Random Number",
      description:
        "Simply a generator that generates a random number within bounds.",
      path: "rng",
      section: 7,
    },
    {
      name: "Anime Discovery",
      description:
        "Look up a categorized list of anime, curated over 10 years. Maybe your next waifu or husbando is here.",
      path: "anime",
      section: 8,
    },
    {
      name: "Weather",
      description:
        "Look up weather conditions on a certain region, using OpenWeather API.",
      path: "weather",
      section: 8,
    },
    {
      name: "Dad Jokes",
      description:
        "Generate a random dad joke to either make your day happier, or ruin your day entirely.",
      path: "dad",
      section: 8,
    },
    {
      name: "Image Mask",
      description: "Runs a mask on a bitmap image for various simple results.",
      path: "mask",
      section: 9,
    },
    {
      name: "QR Code Generator",
      description: "Generate a QR code to embed some information.",
      path: "qr-code",
      section: 9,
    },
    {
      name: "Image Encoder",
      description: "Encode an image into a string of base64-encoded data.",
      path: "image-encode",
      section: 9,
    },
    {
      name: "2024 Day 1",
      description:
        "Solve the puzzle of Advent of Code 2024, Day 1: Historian Hysteria.",
      path: "2024-day-1",
      section: 10,
    },
    {
      name: "2024 Day 2",
      description:
        "Solve the puzzle of Advent of Code 2024, Day 2: Red-Nosed Reports.",
      path: "2024-day-2",
      section: 10,
    },
    {
      name: "2024 Day 3",
      description:
        "Solve the puzzle of Advent of Code 2024, Day 3: Mull It Over.",
      path: "2024-day-3",
      section: 10,
    },
  ]);
}

setup().then(() => {
  console.log("Setting up finished");
  process.exit(0);
});
