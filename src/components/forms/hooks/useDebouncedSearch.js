import { useState, useEffect, useRef } from "react";

export default function useDebouncedSearch({
    searchFn,
    delay = 500,
    initialValue = "",
    extraParams = {}
}) {
    const [search, setSearch] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const lastQuery = useRef("");
    const lastParams = useRef("");

    // Store the searchFn in a ref so we can call the latest version
    // without triggering the useEffect dependency array
    const searchFnRef = useRef(searchFn);
    useEffect(() => {
        searchFnRef.current = searchFn;
    }, [searchFn]);

    const paramsKey = JSON.stringify(extraParams);

    useEffect(() => {
        const query = search.trim();

        if (query === lastQuery.current && paramsKey === lastParams.current) {
            return;
        }

        if (!query) {
            setResults([]);
            lastQuery.current = "";
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                lastQuery.current = query;
                lastParams.current = paramsKey;

                // Call the function from the ref
                const data = await searchFnRef.current({
                    query,
                    ...extraParams
                });

                setResults(data || []);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, delay);

        return () => clearTimeout(timer);
        // REMOVED searchFn from dependencies to stop the loop!
    }, [search, delay, paramsKey]);

    return { search, setSearch, results, searching, setResults };
}