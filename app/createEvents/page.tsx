'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateEventPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Auto-generate slug from title
        const title = formData.get('title') as string;
        const generatedSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        formData.set('slug', generatedSlug);

        // Process comma-separated strings into arrays for tags and agenda
        const tagsRaw = formData.get('tagsInput') as string;
        const agendaRaw = formData.get('agendaInput') as string;

        const tags = tagsRaw
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        const agenda = agendaRaw
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean);

        // Append the stringified arrays as expected by your API
        formData.set('tags', JSON.stringify(tags));
        formData.set('agenda', JSON.stringify(agenda));

        // Remove the temporary helper fields
        formData.delete('tagsInput');
        formData.delete('agendaInput');

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Event created successfully!');
                // Redirect to the specific event page using the slug from the response
                router.push(`/events/${result.event?.slug || generatedSlug}`);
                router.refresh();
            } else {
                setMessage(result.message || 'Failed to create event');
            }
        } catch (error) {
            setMessage('An error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Create a New Event</h1>

            {message && (
                <div
                    className={`p-4 mb-6 rounded ${message.includes('success') ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 p-8 rounded-xl border border-white/10">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Event Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder="e.g. React Conf 2024"
                        className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={3}
                        className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Overview</label>
                    <textarea
                        name="overview"
                        required
                        rows={2}
                        className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Date</label>
                        <input
                            name="date"
                            type="date"
                            required
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none [color-scheme:dark]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Time</label>
                        <input
                            name="time"
                            type="time"
                            required
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none [color-scheme:dark]"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Mode</label>
                        <select
                            name="mode"
                            required
                            className="bg-black border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                        >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Location</label>
                        <input
                            name="location"
                            type="text"
                            required
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Venue (Optional)</label>
                        <input
                            name="venue"
                            type="text"
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Audience</label>
                        <input
                            name="audience"
                            type="text"
                            required
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Organizer</label>
                        <input
                            name="organizer"
                            type="text"
                            required
                            className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Agenda (comma separated)</label>
                    <input
                        name="agendaInput"
                        type="text"
                        placeholder="Keynote, Workshop, Lunch"
                        required
                        className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Tags (comma separated)</label>
                    <input
                        name="tagsInput"
                        type="text"
                        placeholder="React, Next.js, Frontend"
                        required
                        className="bg-transparent border border-white/20 p-2 rounded focus:border-emerald-400 outline-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Event Banner Image</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        required
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-emerald-400 file:text-black hover:file:bg-emerald-500 cursor-pointer"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-400 text-black font-bold py-3 rounded-lg hover:bg-emerald-500 transition-colors disabled:bg-gray-600"
                >
                    {loading ? 'Creating Event...' : 'Create Event'}
                </button>
            </form>
        </section>
    );
};

export default CreateEventPage;
