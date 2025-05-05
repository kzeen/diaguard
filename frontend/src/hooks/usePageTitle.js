import { useEffect } from "react";

export default function usePageTitle(sub = "") {
    useEffect(() => {
        const prev = document.title;
        document.title = sub ? `DiaGuard - ${sub}` : "DiaGuard";
        return () => {
            document.title = prev;
        };
    }, [sub]);
}
