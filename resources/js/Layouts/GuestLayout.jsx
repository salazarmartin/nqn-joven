import ApplicationLogo from "@/Components/ApplicationLogo";

export default function GuestLayout({ children }) {
    return (
        <div style={{
            backgroundImage:"url('/images/fondo.png')",                
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%"}} 
        className="relative flex min-h-screen flex-col items-center bg-purple-980 pt-6 sm:justify-center sm:pt-0 overflow-hidden">
            

            

            {/* className="relative z-10 flex-1 flex items-center justify-center w-full mb-2" */}
            <div
                className="
                    relative z-10 w-full flex-1 
                    flex items-center justify-center 
                    px-4 py-8
                    sm:py-0 sm:items-center sm:justify-center
                    overflow-y-auto
                "
            >
                {children}
            </div>
        </div>
    );
}
