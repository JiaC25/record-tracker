// Keep in sync with backend CustomClaimTypes
export const CustomClaimTypes = {
    userId: 'userId',
    email: 'email',
} as const;

export type JwtPayload = {
    [K in keyof typeof CustomClaimTypes]: string;
};

export const parseJwt = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );

        const parsed = JSON.parse(jsonPayload) as JwtPayload;
        if (!parsed.userId || !parsed.email) {
            return null;
        }
        
        return parsed;
    } catch {
        return null;
    }
}