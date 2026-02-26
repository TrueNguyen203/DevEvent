'use client';

import { useState } from 'react';
import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { success, message } = await createBooking({ eventId, slug, email });
        setMessage(message);
        if (success) {
            setSuccess(true);
            posthog.capture('event_booked', { eventId, slug, email });
        } else {
            setEmail('');
            posthog.captureException(message);
        }
        setSubmitted(true);
    };
    return (
        <div id="book-event">
            {submitted && success ? (
                <p className="text-sm">{message}</p>
            ) : (
                <div>
                    <p className="text-sm">{message}</p>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your Email"
                                required
                            />

                            <button type="submit" className="button-submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BookEvent;
