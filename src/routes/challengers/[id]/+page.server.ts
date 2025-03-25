import { createSessionClient } from '$lib/appwrite';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Challenger, Capstones } from '$lib/types';

// Valid capstone types
const CAPSTONE_TYPES = ['group', 'solo'] as const;
type CapstoneType = typeof CAPSTONE_TYPES[number];

export const load: PageServerLoad = async (event) => {
    const client = createSessionClient(event);
    try {
        // Get only capstones
        const capstones = await client.databases.listDocuments('demo', 'capstones');
        
      

        return {
            capstones: capstones.documents,
            capstoneTypes: CAPSTONE_TYPES
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            challengers: [],
            capstones: [],
            capstoneTypes: CAPSTONE_TYPES
        };
    }
};

export const actions: Actions = {
    updateChallenger: async (event) => {
        const client = createSessionClient(event);
        const databases = client.databases;
        const formData = await event.request.formData();
        
        try {
            const challengerId = formData.get('challengerId') as string;
            const selectedCapstone = formData.get('selectedCapstone') as string;
            
            // Prepare challenger data
            const challengerData: Partial<Challenger> = {
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                email: formData.get('email') as string,
                linkedin_link: formData.get('linkedin_link') as string || undefined,
                bio: formData.get('bio') as string || undefined,
                resume_link: formData.get('resume_link') as string || undefined,
                capstone_id: selectedCapstone || undefined
            };
            
            // Handle projects
            for (let i = 1; i <= 4; i++) {
                challengerData[`project${i}_title`] = formData.get(`project${i}_title`) as string || undefined;
                challengerData[`project${i}_description`] = formData.get(`project${i}_description`) as string || undefined;
                challengerData[`project${i}_link1`] = formData.get(`project${i}_link1`) as string || undefined;
                challengerData[`project${i}_link2`] = formData.get(`project${i}_link2`) as string || undefined;
            }
            
            // Update challenger
            await databases.updateDocument(
                'demo',
                'challengers',
                challengerId,
                challengerData
            );
            
            return {
                success: true,
                type: 'success',
                message: 'Challenger updated successfully'
            };
        } catch (error) {
            console.error('Error updating challenger:', error);
            return fail(500, {
                message: 'Failed to update challenger',
                error: String(error),
                type: 'error'
            });
        }
    },

    createCapstone: async (event) => {
        const client = createSessionClient(event);
        const databases = client.databases;
        const formData = await event.request.formData();
        const userId = event.locals.user?.$id;

        try {
            const challengerId = formData.get('challengerId') as string;
            const capstoneType = formData.get('capstone_type') as CapstoneType;
            
            // Validate capstone type
            if (!CAPSTONE_TYPES.includes(capstoneType)) {
                return fail(400, { 
                    message: 'Invalid capstone type',
                    type: 'validation'
                });
            }

            const newCapstone: Partial<Capstones> = {
                name: formData.get('capstone_name') as string,
                description: formData.get('capstone_description') as string,
                type: capstoneType,
                challengers: [challengerId]
            };
            
            // Validate required fields
            if (!newCapstone.name || !newCapstone.description) {
                return fail(400, {
                    message: 'Capstone name and description are required',
                    type: 'validation'
                });
            }

            // Create new capstone
            const createdCapstone = await databases.createDocument(
                'demo',
                'capstones',
                'unique()',
                newCapstone
            );
            
            // Update challenger with new capstone ID
            await databases.updateDocument(
                'demo',
                'challengers',
                challengerId,
                {
                    capstone_id: createdCapstone.$id
                }
            );
            
            return {
                type: 'success',
                message: 'Capstone created successfully'
            };
        } catch (error) {
            console.error('Error creating capstone:', error);
            return fail(500, {
                type: 'error',
                message: 'Failed to create capstone'
            });
        }
    }
};
