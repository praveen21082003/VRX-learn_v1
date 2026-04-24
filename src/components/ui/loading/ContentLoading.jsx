export default function ContentLoading({ count = 5 }) {
    return (
        <div className="space-y-1 py-4 animate-pulse">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-6 rounded-md bg-gray-200 dark:bg-gray-700"
                >
                    <div className="h-4 w-40 bg-gray-300 dark:bg-gray-600 rounded" />
                    <div className="h-4 w-6 bg-gray-300 dark:bg-gray-600 rounded" />
                </div>
            ))}
        </div>
    );
}