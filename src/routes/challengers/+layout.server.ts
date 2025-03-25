import type { PageServerLoad } from './$types';
import { createSessionClient } from '$lib/appwrite';
import { Query, type Models } from 'node-appwrite';
import type { Challenger } from '$lib/types';

export const load: PageServerLoad = async (event) => {
  try {
    const client = createSessionClient(event);
    const databases = client.databases;
    
    // Fetch challengers from the "demo" database, "challengers" collection
    const response = await databases.listDocuments(
      'demo',           // database ID
      'challengers',    // collection ID
      [
        Query.orderAsc('first_name'), // Sort by first name
        Query.limit(200)
      ]
    );
    
    return {
      challengers: response.documents as unknown as Challenger[]
    };
  } catch (error) {
    console.error('Error fetching challengers:', error);
    
    // Return empty array in case of error
    return {
      challengers: []
    };
  }
};
