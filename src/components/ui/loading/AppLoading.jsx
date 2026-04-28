import { Icon } from '@/components/ui'

export default function AppLoading({
    message = "Loading..."
}) {
    return (
        <div className="fixed inset-0 bg-main/80 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="flex items-center gap-4">

                <div className="relative flex items-center justify-center">
                    <Icon
                        name="line-md:loading-twotone-loop"
                        className="text-primary"
                        width="64"
                        height="64"
                    />

                    <img
                        src="/VRX-logo.svg"
                        alt="logo"
                        className="absolute w-8 h-8"
                    />
                </div>

                <div className="flex flex-col items-center text-center">
                    <h2 className="text-h2 font-semibold">VRXLearn</h2>

                    <div className="flex items-center gap-2 mt-2 text-muted">
                        <p className="text-sm">{message}</p>

                        <Icon
                            name="eos-icons:three-dots-loading"
                            width="28"
                            height="28"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}