import type { Models } from 'node-appwrite';


export interface Challenger extends Models.Document {
    first_name: string;
    last_name: string;
    email: string;
    linkedin_link?: string;
    bio?: string;
    headshot?: string;
    resume_link?: string;
    project1_title?: string;
    capstones?: Capstones[];
    project1_link1?: string;
    project1_link2?: string;
    project1_description?: string;
    project2_link1?: string;
    project2_link2?: string;
    project2_description?: string;
    project2_title?: string;
    project3_title?: string;
    project3_link1?: string;
    project3_link2?: string;
    project3_description?: string;
    project4_link1?: string;
    project4_link2?: string;
    project4_description?: string;
    project4_title?: string;
    capstone_id?: string;
};

export interface Capstones extends Models.Document {
    name?: string;
    description?: string;
    type: 'group' | 'solo';
    challengers?: Challenger[];
};

export interface Feedback extends Models.Document {
    user_id?: string;
    stars?: number;
    note?: string;
};

export interface Realtime extends Models.Document {
    active?: string;
};



