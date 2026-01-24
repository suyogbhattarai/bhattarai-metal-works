export const getApiImageUrl = (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseURL = 'http://localhost:8000'; // Or process.env.NEXT_PUBLIC_API_URL
    return `${baseURL}${path}`;
};
