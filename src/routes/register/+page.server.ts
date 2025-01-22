import { SESSION_COOKIE, createAdminClient } from '$lib/appwrite';
import { redirect, fail } from '@sveltejs/kit';
import { ID } from 'node-appwrite';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        // Extract the form data
        const form = await request.formData();
        const email = form.get('email')?.toString().trim();
        const password = form.get('password')?.toString();
        const name = form.get('name')?.toString().trim();

        try {
            // Validate inputs
            if (!email || !password || !name) {
                return fail(400, { 
                    error: 'All fields are required',
                    email: email || '',
                    name: name || ''
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return fail(400, { 
                    error: 'Invalid email format',
                    email: email,
                    name: name
                });
            }

            // Validate password length (Appwrite requires minimum 8 characters)
            if (password.length < 8) {
                return fail(400, { 
                    error: 'Password must be at least 8 characters long',
                    email: email,
                    name: name
                });
            }
        } catch (error: any) {
            console.error('Validation error:', error);
            return fail(400, {
                error: 'Validation failed',
                email: email || '',
                name: name || ''
            });
        }

        try {
            // Create the Appwrite client
            const { account } = createAdminClient();

            // Create the account
            await account.create(ID.unique(), email, password, name);
            console.log('account', account);
            const session = await account.createEmailPasswordSession(email, password);
            console.log('session', session);
            // Set the session cookie with the secret
            cookies.set(SESSION_COOKIE, session.secret, {
                sameSite: 'strict',
                expires: new Date(session.expire),
                secure: true,
                path: '/',
                httpOnly: true
            });

            // Return the redirect to the dashboard
            
        } catch (error: any) {
            console.error('Registration error:', error);
            return fail(400, {
                error: error.response?.message || 'Failed to create account. Please try again.',
                email: email,
                name: name
            });
        }
        return redirect(302, '/dashboard');
    }
} satisfies Actions;