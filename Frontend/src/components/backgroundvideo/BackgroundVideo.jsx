
const BackgroundVideo = () => {


    return (
        <div className="background-video fixed inset-0 z-0 overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
            >
                <source src="/videos/funky-fiber-bg.mp4" type="video/mp4" />
            </video>

            {/* Blur / dark overlay */}
            <div className="video-overlay" />

        </div>



    );
};

export default BackgroundVideo;
