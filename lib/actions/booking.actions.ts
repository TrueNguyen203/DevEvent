'use server';

import { Booking } from '@/database';
import connectDB from '../mongodb';

const checkEmail = async (eventId: string, email: string) => {
    const filter = { eventId, email };
    const bookingExistsResult = await Booking.exists(filter);
    return bookingExistsResult ? true : false;
};

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string }) => {
    try {
        await connectDB();

        const bookingExists = await checkEmail(eventId, email);

        if (bookingExists) {
            return {
                success: false,
                message: `The ${email} email for booking this event already exists, please try another one`,
            };
        }

        await Booking.create({ eventId, slug, email });

        return { success: true, message: 'Thank you for signing up' };
    } catch (error) {
        console.error('Create booking failed', error);
        return { success: false, message: 'Create booking has failed due to internal server error' };
    }
};
