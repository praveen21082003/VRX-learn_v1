function Tabs({
    tabs,
    activeTab,
    setActiveTab,
    textClass = "text-h4"
}) {
    return (
        <div className="flex gap-6 border-b">
            {tabs.map((tab) => {
                const isActive = Array.isArray(tab.value)
                    ? tab.value.includes(activeTab)
                    : tab.value === activeTab;

                return (
                    <button
                        type="button"
                        key={tab.value}
                        onClick={() =>
                            setActiveTab(Array.isArray(tab.value) ? tab.value[0] : tab.value)
                        }
                        className={`pb-2 ${textClass} transition-colors ${isActive
                            ? "border-b-2 border-brand text-primary"
                            : "text-muted hover:border-b"
                            }`}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    );
}

export default Tabs;
