"use client";

const Branding = () => {
    return (
        <div className="pb-4 flex flex-col items-center justify-center gap-2 border-t border-white/5 pt-4 w-full">
            <h1 className="text-primary lg:text-5xl text-4xl font-bold tracking-tighter transition-all hover:tracking-widest cursor-default">
                nlog
            </h1>
            <p className="text-dark-gray text-sm uppercase tracking-widest font-light text-center">
                stay anti-political
            </p>
            <div className="w-12 h-1 bg-primary mt-4"></div>
        </div>
    );
};

export default Branding;
