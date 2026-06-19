import { Icon } from '@/components/ui'
import { useTheme } from '@/context/ThemeProvider'

export default function AppLoading({
    message = "Loading, please wait"
}) {
    const { darkMode } = useTheme();
    return (
        <div className="fixed inset-0 bg-background backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="relative flex items-center justify-center">
                <Icon
                    name="line-md:loading-twotone-loop"
                    className="text-primary dark:text-white"
                    width="40"
                    height="40"
                />

                <img src={darkMode ? "/logo.svg" : "/VRX-logo.svg"} className="absolute h-5 animate-pulse" />

            </div>
            <div className="flex items-end gap-2 mt-2 text-muted">
                <p className="text-sm">{message}</p>

                <Icon
                    name="eos-icons:three-dots-loading"
                    width="16"
                    height="16"
                />
            </div>
        </div>
    )
}