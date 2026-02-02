'use client';

import React from 'react';

/**
 * A simple component to inject JSON-LD structured data into the <head>
 */
export default function JsonLd({ data }: { data: any }) {
    if (!data) return null;
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
