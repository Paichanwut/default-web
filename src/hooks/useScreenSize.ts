import { useState, useEffect } from 'react';

export const useScreenSize = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // Adjust breakpoint as needed (e.g. 1024px for tablet/topbar switch)
        };

        // Initial check
        checkScreenSize();

        // Listen for resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isMobile };
};
