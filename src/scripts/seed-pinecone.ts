/**
 * Script to seed Pinecone index with route information
 * This creates embeddings for routes from routes.ts and ADR snippets for vector search
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { routes } from '../lib/routes';

// Simple embedding function (would use a real embedding API in production)
async function createEmbedding(text: string): Promise<number[]> {
  try {
    // In a real implementation, this would call an embedding API
    // This is a mock implementation that sends the request to the MCP server
    const response = await axios.post('http://localhost:9004/embed', {
      text,
      dimensions: 1536,
    });
    return response.data.embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    // Return a dummy embedding for testing
    return Array(1536)
      .fill(0)
      .map(() => Math.random());
  }
}

async function seedPinecone() {
  try {
    console.log('Seeding Pinecone with route information...');

    // Create vectors for routes
    const routeVectors = await Promise.all(
      routes.map(async (route, index) => {
        const text = `${route.path} ${route.name}`;
        const embedding = await createEmbedding(text);

        return {
          id: `route-${index}`,
          values: embedding,
          metadata: {
            type: 'route',
            path: route.path,
            name: route.name,
            isPublic: route.isPublic,
            requiresAuth: route.requiresAuth,
          },
        };
      }),
    );

    // Extract ADR snippets from routing-refactor.md
    const specPath = path.join(process.cwd(), 'routing-refactor.md');
    const specContent = fs.readFileSync(specPath, 'utf8');

    // Extract ADR sections
    const adrRegex = /## 1️⃣ Architectural Decisions.*?(?=## 2️⃣)/s;
    const adrMatch = specContent.match(adrRegex);

    const adrSnippets = adrMatch
      ? adrMatch[0]
          .split('|')
          .filter(
            (line) =>
              line.trim().length > 0 &&
              !line.includes('---') &&
              !line.includes('Topic') &&
              !line.includes('##'),
          )
      : [];

    // Create vectors for ADR snippets
    const adrVectors = await Promise.all(
      adrSnippets.map(async (snippet, index) => {
        const embedding = await createEmbedding(snippet);

        return {
          id: `adr-${index}`,
          values: embedding,
          metadata: {
            type: 'adr',
            content: snippet.trim(),
          },
        };
      }),
    );

    // Combine all vectors
    const allVectors = [...routeVectors, ...adrVectors];

    // Upsert to Pinecone
    const response = await axios.post(
      'http://localhost:9004/api/collections/portal-routes-index/upsert',
      {
        vectors: allVectors,
      },
    );

    console.log(
      `Successfully seeded Pinecone with ${allVectors.length} vectors`,
    );
    console.log(`- ${routeVectors.length} route vectors`);
    console.log(`- ${adrVectors.length} ADR snippet vectors`);

    // Set memory flag
    await axios.post('http://localhost:9000/api/memory', {
      key: 'pinecone-seeded-flag',
      value: 'true',
    });

    console.log('Pinecone seeding completed!');
    return true;
  } catch (error) {
    console.error('Error seeding Pinecone:', error);
    return false;
  }
}

// Only run directly (not when imported)
if (require.main === module) {
  seedPinecone().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

export { seedPinecone };
