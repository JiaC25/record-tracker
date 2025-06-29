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

        const parsed = JSON.parse(jsonPayload);

        // Validate all required claim fields exist and are strings
        for (const key of Object.keys(CustomClaimTypes) as Array<keyof JwtPayload>) {
            const claimKey = CustomClaimTypes[key];
            if (typeof parsed[claimKey] !== 'string') {
                return null;
            }
        }

        // Build strongly typed JwtPayload object
        const result: JwtPayload = {
            userId: parsed[CustomClaimTypes.userId],
            email: parsed[CustomClaimTypes.email],
        };

        return result;
    } catch {
        return null;
    }
}