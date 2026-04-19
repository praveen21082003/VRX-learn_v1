import { Input, Avatar, InputWarnMessage, Icon } from '@/components/ui'
import { useClickOutside } from "@/hooks/useClickOutside";
import { useState } from 'react';

function SearchSelect({
    label,
    value,
    onChange,
    results = [],
    onSelect,
    placeholder = "Search...",
    loading = false,
    inputWarning,
    getLabel = (item) => item.label || "",
    getSubLabel = null,
    renderItem = null,
}) {

    const [open, ref, setOpen] = useClickOutside(false);

    return (
        <div className="relative" ref={ref}>
            {label && (
                <label className="block text-h5 mb-2">
                    {label} {inputWarning && <InputWarnMessage message={inputWarning} />}
                </label>
            )}

            <Input
                icon="ic:twotone-search"
                paddingClass="py-2"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setOpen(true)}
            />

            {open && value && (
                <div className="absolute mt-1 w-full max-h-40 bg-background border shadow-md overflow-y-auto z-20 rounded-md">

                    {/* Loading */}
                    {loading && (
                        <div className="p-3 flex items-center gap-2 text-sm text-muted">
                            <Icon name="eos-icons:loading" className="animate-spin" />
                            Searching...
                        </div>
                    )}

                    {/* No results */}
                    {!loading && results.length === 0 && (
                        <div className="p-3 text-sm text-gray-400">
                            No results found
                        </div>
                    )}

                    {/* Results */}
                    {!loading && results.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                onSelect(item);
                                setOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                        >

                            {/* Custom render (priority) */}
                            {renderItem ? (
                                renderItem(item)
                            ) : (
                                <>
                                    <Avatar name={getLabel(item)} />
                                    <div>
                                        <div>{getLabel(item)}</div>
                                        {getSubLabel && (
                                            <div className="text-sm text-muted">
                                                {getSubLabel(item)}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default SearchSelect;