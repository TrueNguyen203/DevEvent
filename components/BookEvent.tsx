'use client';
import { set } from 'mongoose';
import React from 'react';
import { useState } from 'react';

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        }, 2000);
    };
    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
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
            )}
        </div>
    );
};

export default BookEvent;
